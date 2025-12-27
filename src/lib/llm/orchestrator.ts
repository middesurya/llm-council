import { v4 as randomUUID } from "uuid";
import { getLLMConfig, LLMConfig } from "@/config/llm-config";
import { getDomainConfig, DomainConfig } from "@/config/domains";
import { generateWithClient } from "./index";

export interface ExpertAnswer {
  provider: string;
  model: string;
  answer: string;
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
    throw new Error(`Unknown domain: ${domain}`);
  }

  const models = domainConfig.models;

  // Stage 1: Divergent Answers - Each LLM provides their independent answer
  console.log(`[${queryId}] Stage 1: Gathering divergent answers...`);
  const stage1Promises = Object.entries(models).map(async ([provider, model]) => {
    try {
      const config = getLLMConfig(provider as any, model);
      const answer = await generateWithClient(
        config,
        domainConfig.systemPrompt,
        councilQuery.query
      );
      return { provider, model, answer };
    } catch (error) {
      console.error(`[${queryId}] ${provider} error:`, error);
      return {
        provider,
        model,
        answer: `[Error: ${error instanceof Error ? error.message : String(error)}]`,
      };
    }
  });

  const stage1Results = await Promise.all(stage1Promises);

  // Stage 2: Peer Review - Each LLM reviews all answers and ranks them
  console.log(`[${queryId}] Stage 2: Conducting peer review...`);
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

      return reviewData.rankings.map((r: any) => ({
        reviewerProvider,
        reviewerModel,
        targetProvider: r.provider,
        ranking: r.rank,
        reasoning: r.reasoning,
      }));
    } catch (error) {
      console.error(`[${queryId}] Peer review by ${reviewerProvider} error:`, error);
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

  // Calculate average rankings to find the best answer
  const avgRankings: Record<string, number> = {};
  stage2Results.forEach((review) => {
    if (!avgRankings[review.targetProvider]) {
      avgRankings[review.targetProvider] = 0;
    }
    avgRankings[review.targetProvider] += review.ranking;
  });

  Object.keys(avgRankings).forEach((provider) => {
    avgRankings[provider] = avgRankings[provider] / 3; // Average across 3 reviewers
  });

  const bestProvider = Object.entries(avgRankings).sort((a, b) => a[1] - b[1])[0][0];
  const bestAnswer = stage1Results.find((a) => a.provider === bestProvider)!;

  // Stage 3: Final Synthesis - Best answer synthesizes all insights
  console.log(`[${queryId}] Stage 3: Creating final synthesis...`);
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
  };
}
