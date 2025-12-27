import { v4 as randomUUID } from "uuid";
import { getLLMConfig, LLMConfig } from "@/config/llm-config";
import { getDomainConfig, DomainConfig } from "@/config/domains";
import { generateWithClient } from "./index";
import { logWithContext, logStage } from "@/lib/observability";
import { metricsCollector } from "@/lib/observability";
import { trackProviderError, ErrorCategory } from "@/lib/observability";
import { enhanceQueryWithKnowledge } from "@/lib/knowledge";

export interface ExpertAnswer {
  provider: string;
  model: string;
  answer: string;
  success: boolean;
  tokensUsed?: number;
}

export interface PeerReview {
  reviewerProvider: string;
  reviewerModel: string;
  targetProvider: string;
  ranking: number;
  reasoning: string;
}

export interface CouncilResponse {
  queryId: string;
  domain: string;
  query: string;
  stage1: ExpertAnswer[];
  stage2: PeerReview[];
  stage3: {
    provider: string;
    model: string;
    synthesis: string;
  };
  timestamp: string;
  metrics?: {
    stage1Duration: number;
    stage2Duration: number;
    stage3Duration: number;
    totalDuration: number;
    tokenUsage?: {
      openai?: number;
      anthropic?: number;
      google?: number;
    };
  };
}

export interface CouncilQuery {
  query: string;
  domain?: string;
  conversationId?: string;
}

export async function orchestrateCouncil(councilQuery: CouncilQuery): Promise<CouncilResponse> {
  const queryId = randomUUID();
  const domain = councilQuery.domain || "general";
  const domainConfig = getDomainConfig(domain);

  if (!domainConfig) {
    const error = new Error(`Unknown domain: ${domain}`);
    throw error;
  }

  const models = domainConfig.models;

  // Initialize metrics collection
  metricsCollector.initialize(queryId, domain);
  logWithContext.info('Council orchestration started', { queryId, domain });

  // Track stage timings
  const timings = {
    stage1Start: Date.now(),
    stage1End: 0,
    stage2Start: 0,
    stage2End: 0,
    stage3Start: 0,
    stage3End: 0,
  };

  // Track provider success
  const providerSuccess: Record<string, boolean> = {};

  // Enhance query with domain-specific knowledge
  const enhancedQuery = enhanceQueryWithKnowledge(councilQuery.query, councilQuery.domain || "general");

  if (enhancedQuery !== councilQuery.query) {
    logWithContext.info('Query enhanced with knowledge context', {
      queryId,
      domain,
      originalLength: councilQuery.query.length,
      enhancedLength: enhancedQuery.length,
    });
  }

  // Stage 1: Divergent Answers - Each LLM provides their independent answer
  const stage1Logger = logStage('stage1', queryId, domain);
  stage1Logger.start();

  logWithContext.info('Gathering divergent answers', { queryId, domain, stage: 'stage1' });

  const stage1Promises = Object.entries(models).map(async ([provider, model]) => {
    try {
      const config = getLLMConfig(provider as any, model);
      const answer = await generateWithClient(
        config,
        domainConfig.systemPrompt,
        enhancedQuery
      );

      providerSuccess[provider] = true;

      // TODO: Extract actual token usage from API response
      // For now, estimate based on answer length
      const estimatedTokens = Math.ceil(answer.length / 4);
      metricsCollector.recordTokenUsage(queryId, provider as any, estimatedTokens);

      logWithContext.info(`${provider} answer received`, {
        queryId,
        domain,
        provider,
        answerLength: answer.length
      });

      return { provider, model, answer, success: true, tokensUsed: estimatedTokens };
    } catch (error) {
      providerSuccess[provider] = false;

      trackProviderError(
        provider,
        error instanceof Error ? error : new Error(String(error)),
        { queryId, domain, stage: 'stage1' }
      );

      logWithContext.error(`${provider} failed to generate answer`, error, {
        queryId,
        domain,
        provider
      });

      return {
        provider,
        model,
        answer: `[Error: ${error instanceof Error ? error.message : String(error)}]`,
        success: false,
        tokensUsed: 0,
      };
    }
  });

  const stage1Results = await Promise.all(stage1Promises);

  timings.stage1End = Date.now();
  const stage1Duration = timings.stage1End - timings.stage1Start;
  metricsCollector.recordStage(queryId, 'stage1', stage1Duration);
  stage1Logger.complete(stage1Duration, {
    providers: stage1Results.length,
    successful: stage1Results.filter(r => r.success).length
  });

  // Stage 2: Peer Review - Each LLM reviews all answers and ranks them
  timings.stage2Start = Date.now();
  const stage2Logger = logStage('stage2', queryId, domain);
  stage2Logger.start();

  logWithContext.info('Conducting peer review', { queryId, domain, stage: 'stage2' });

  const stage2Promises = Object.entries(models).map(async ([reviewerProvider, reviewerModel]) => {
    try {
      const config = getLLMConfig(reviewerProvider as any, reviewerModel);

      const answersText = stage1Results
        .map((a) => `### ${a.provider}\n${a.answer}`)
        .join("\n\n");

      const reviewPrompt = `You are reviewing the following expert answers to the question: "${councilQuery.query}"

${answersText}

Your task:
1. Evaluate each answer for:
   - Accuracy and completeness
   - Quality of reasoning
   - Clarity and organization
   - Use of evidence and support

2. Rank the answers from best (1) to worst (${stage1Results.length})

3. For each ranking, provide your reasoning (2-3 sentences per answer)

Respond in this exact JSON format:
{
  "rankings": [
    {"provider": "openai", "rank": 1, "reasoning": "..."},
    {"provider": "anthropic", "rank": 2, "reasoning": "..."},
    {"provider": "google", "rank": 3, "reasoning": "..."}
  ]
}`;

      const reviewResponse = await generateWithClient(
        config,
        "You are an objective reviewer. Always respond with valid JSON only.",
        reviewPrompt
      );

      // Try to extract JSON from response
      const jsonMatch = reviewResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const reviewData = JSON.parse(jsonMatch[0]);

      metricsCollector.recordTokenUsage(
        queryId,
        reviewerProvider as any,
        Math.ceil(reviewResponse.length / 4)
      );

      return reviewData.rankings.map((r: any) => ({
        reviewerProvider,
        reviewerModel,
        targetProvider: r.provider,
        ranking: r.rank,
        reasoning: r.reasoning,
      }));
    } catch (error) {
      trackProviderError(
        reviewerProvider,
        error instanceof Error ? error : new Error(String(error)),
        { queryId, domain, stage: 'stage2' }
      );

      // Return default rankings if review fails
      return stage1Results.map((a, idx) => ({
        reviewerProvider,
        reviewerModel,
        targetProvider: a.provider,
        ranking: idx + 1,
        reasoning: `[Review error: ${error instanceof Error ? error.message : String(error)}]`,
      }));
    }
  });

  const stage2Results = (await Promise.all(stage2Promises)).flat();

  timings.stage2End = Date.now();
  const stage2Duration = timings.stage2End - timings.stage2Start;
  metricsCollector.recordStage(queryId, 'stage2', stage2Duration);
  stage2Logger.complete(stage2Duration, {
    reviews: stage2Results.length
  });

  // Calculate average rankings to find the best answer
  const avgRankings: Record<string, number> = {};
  stage2Results.forEach((review) => {
    if (!avgRankings[review.targetProvider]) {
      avgRankings[review.targetProvider] = 0;
    }
    avgRankings[review.targetProvider] += review.ranking;
  });

  Object.keys(avgRankings).forEach((provider) => {
    avgRankings[provider] = avgRankings[provider] / Object.keys(models).length;
  });

  const bestProvider = Object.entries(avgRankings).sort((a, b) => a[1] - b[1])[0][0];
  const bestAnswer = stage1Results.find((a) => a.provider === bestProvider)!;

  // Stage 3: Final Synthesis - Best answer synthesizes all insights
  timings.stage3Start = Date.now();
  const stage3Logger = logStage('stage3', queryId, domain);
  stage3Logger.start();

  logWithContext.info('Creating final synthesis', {
    queryId,
    domain,
    synthesizer: bestProvider
  });

  const synthesisConfig = getLLMConfig(bestProvider as any, bestAnswer.model);

  const allAnswersText = stage1Results
    .map((a) => `### ${a.provider} (${models[a.provider as keyof typeof models]})\n${a.answer}`)
    .join("\n\n");

  const synthesisPrompt = `You provided the top-ranked answer to the question: "${councilQuery.query}"

Here are all the expert answers that were provided:

${allAnswersText}

Your task:
1. Synthesize the best insights from ALL answers (including yours)
2. Create a comprehensive final response that incorporates the strongest points
3. Acknowledge when other experts provided valuable insights
4. Maintain clarity and conciseness while being thorough

Provide the final synthesis answer:`;

  const synthesis = await generateWithClient(
    synthesisConfig,
    domainConfig.systemPrompt,
    synthesisPrompt
  );

  metricsCollector.recordTokenUsage(
    queryId,
    bestProvider as any,
    Math.ceil(synthesis.length / 4)
  );

  timings.stage3End = Date.now();
  const stage3Duration = timings.stage3End - timings.stage3Start;
  metricsCollector.recordStage(queryId, 'stage3', stage3Duration);
  stage3Logger.complete(stage3Duration);

  // Record provider success rates
  Object.entries(providerSuccess).forEach(([provider, success]) => {
    metricsCollector.recordProviderSuccess(queryId, provider as any, success);
  });

  // Complete metrics collection
  const finalMetrics = metricsCollector.complete(queryId);

  const totalDuration = stage1Duration + stage2Duration + stage3Duration;

  logWithContext.info('Council orchestration completed', {
    queryId,
    domain,
    totalDuration,
    stage1Duration,
    stage2Duration,
    stage3Duration,
    synthesizer: bestProvider,
  });

  return {
    queryId,
    domain,
    query: councilQuery.query,
    stage1: stage1Results,
    stage2: stage2Results,
    stage3: {
      provider: bestProvider,
      model: bestAnswer.model,
      synthesis,
    },
    timestamp: new Date().toISOString(),
    metrics: {
      stage1Duration,
      stage2Duration,
      stage3Duration,
      totalDuration,
      tokenUsage: finalMetrics?.tokenUsage,
    },
  };
}
