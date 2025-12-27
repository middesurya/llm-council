import { randomUUID } from "crypto";
import { CouncilQuery } from "./orchestrator";
import { getDomainConfig } from "@/config/domains";
import { getLLMConfig } from "@/config/llm-config";
import { streamWithOpenAI } from "./openai-stream";
import { streamWithAnthropic } from "./anthropic-stream";
import { generateWithOpenAI } from "./openai-client";
import { generateWithAnthropic } from "./anthropic-client";
import { logWithContext, logStage } from "@/lib/observability";
import { checkContent } from "@/lib/security/content-filter";

interface ExpertAnswer {
  provider: string;
  model: string;
  answer: string;
}

interface PeerReview {
  reviewerProvider: string;
  reviewerModel: string;
  targetProvider: string;
  ranking: number;
  reasoning: string;
}

interface StreamingOrchestratorOptions {
  onStage1Complete?: (answers: ExpertAnswer[]) => void;
  onStage2Complete?: (reviews: PeerReview[]) => void;
  onStage3Token?: (token: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Streaming orchestrator that:
 * - Processes Stage 1 (divergent answers) in background
 * - Processes Stage 2 (peer review) in background
 * - Streams Stage 3 (final synthesis) to client
 */
export async function* orchestrateCouncilStreaming(
  councilQuery: CouncilQuery,
  options: StreamingOrchestratorOptions = {}
): AsyncGenerator<string, void, unknown> {
  const queryId = randomUUID();
  const domain = councilQuery.domain || "general";
  const domainConfig = getDomainConfig(domain);

  if (!domainConfig) {
    yield `Error: Unknown domain "${domain}". Valid domains are: general, healthcare, finance`;
    return;
  }

  const models = domainConfig.models;

  // Filter out google provider since it's not configured and not supported in streaming
  const supportedProviders = Object.fromEntries(
    Object.entries(models).filter(([provider]) => provider !== 'google')
  );

  logWithContext.info('Streaming council orchestration started', { queryId, domain });

  // Content moderation check
  const contentCheck = checkContent(councilQuery.query, domain);
  if (!contentCheck.allowed) {
    yield `Error: ${contentCheck.warning}`;
    return;
  }

  let stage1Results: ExpertAnswer[] = [];
  let stage2Results: PeerReview[] = [];
  let hasError = false;

  // Process Stages 1 & 2 in background
  const backgroundProcessing = (async () => {
    try {
      // Stage 1: Divergent Answers
      const stage1Logger = logStage('stage1', queryId, domain);
      stage1Logger.start();

      const stage1Promises = Object.entries(supportedProviders).map(async ([provider, model]) => {
        try {
          const config = getLLMConfig(provider as any, model);
          let answer: string;

          if (provider === 'openai') {
            answer = await generateWithOpenAI(config, domainConfig.systemPrompt, councilQuery.query);
          } else if (provider === 'anthropic') {
            answer = await generateWithAnthropic(config, domainConfig.systemPrompt, councilQuery.query);
          } else {
            throw new Error(`Unknown provider: ${provider}`);
          }

          logWithContext.info(`${provider} answer received`, { queryId, domain, provider });
          return { provider, model, answer };
        } catch (error) {
          logWithContext.error(`${provider} failed in stage1`, error as Error, { queryId, domain, provider });
          return {
            provider,
            model,
            answer: `[Error: ${error instanceof Error ? error.message : String(error)}]`
          };
        }
      });

      stage1Results = await Promise.all(stage1Promises);
      stage1Logger.complete(Date.now());
      options.onStage1Complete?.(stage1Results);

      // Stage 2: Peer Review
      const stage2Logger = logStage('stage2', queryId, domain);
      stage2Logger.start();

      const validAnswers = stage1Results.filter(a => !a.answer.startsWith('[Error'));

      if (validAnswers.length < 2) {
        stage2Results = [];
        stage2Logger.complete(Date.now());
        options.onStage2Complete?.(stage2Results);
        return;
      }

      const stage2Promises: Promise<PeerReview>[] = [];

      for (const [reviewerProvider, reviewerModel] of Object.entries(supportedProviders)) {
        for (const targetAnswer of validAnswers) {
          if (targetAnswer.provider === reviewerProvider) continue;

          const reviewPrompt = `Review the following answer from ${targetAnswer.provider}:\n\n${targetAnswer.answer}\n\nRank this answer from 1 (worst) to ${validAnswers.length} (best) compared to other answers, and explain your reasoning in one sentence.`;

          stage2Promises.push((async () => {
            try {
              const config = getLLMConfig(reviewerProvider as any, reviewerModel);
              let review: string;

              if (reviewerProvider === 'openai') {
                review = await generateWithOpenAI(config, domainConfig.systemPrompt, reviewPrompt);
              } else if (reviewerProvider === 'anthropic') {
                review = await generateWithAnthropic(config, domainConfig.systemPrompt, reviewPrompt);
              } else {
                throw new Error(`Unknown provider: ${reviewerProvider}`);
              }

              // Parse ranking
              const rankingMatch = review.match(/(\d+)/);
              const ranking = rankingMatch ? parseInt(rankingMatch[1]) : 1;

              return {
                reviewerProvider,
                reviewerModel,
                targetProvider: targetAnswer.provider,
                ranking: Math.max(1, Math.min(ranking, validAnswers.length)),
                reasoning: review
              };
            } catch (error) {
              logWithContext.error(`Review by ${reviewerProvider} failed`, error as Error, { queryId, domain });
              return {
                reviewerProvider,
                reviewerModel,
                targetProvider: targetAnswer.provider,
                ranking: 1,
                reasoning: `[Error: ${error instanceof Error ? error.message : String(error)}]`
              };
            }
          })());
        }
      }

      stage2Results = await Promise.all(stage2Promises);
      stage2Logger.complete(Date.now());
      options.onStage2Complete?.(stage2Results);

    } catch (error) {
      hasError = true;
      logWithContext.error('Background processing failed', error as Error, { queryId, domain });
      options.onError?.(error as Error);
    }
  })();

  // Start Stage 3: Streaming Synthesis
  const stage3Logger = logStage('stage3', queryId, domain);
  stage3Logger.start();

  try {
    // Wait a bit for Stage 1 to complete so we have answers to synthesize
    await new Promise(resolve => setTimeout(resolve, 500));

    // Wait for background processing to at least finish Stage 1
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Re-check stage1Results after waiting
    let attempts = 0;
    while (stage1Results.length === 0 && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (stage1Results.length === 0) {
      yield "Error: No answers received from experts. Please try again.";
      return;
    }

    // Find best answer based on stage 2 reviews
    let bestAnswer = stage1Results[0];
    if (stage2Results.length > 0) {
      const rankings = new Map<string, number[]>();
      stage2Results.forEach(r => {
        if (!rankings.has(r.targetProvider)) {
          rankings.set(r.targetProvider, []);
        }
        rankings.get(r.targetProvider)!.push(r.ranking);
      });

      let bestAvgRank = Infinity;
      stage1Results.forEach(answer => {
        const answerRankings = rankings.get(answer.provider) || [];
        const avgRank = answerRankings.length > 0
          ? answerRankings.reduce((a, b) => a + b, 0) / answerRankings.length
          : 999;
        if (avgRank < bestAvgRank) {
          bestAvgRank = avgRank;
          bestAnswer = answer;
        }
      });
    }

    // Build synthesis prompt
    const synthesisPrompt = `You are synthesizing the final answer.

Original Question: ${councilQuery.query}

Expert Answers:
${stage1Results.map(a => `- ${a.provider}: ${a.answer}`).join('\n\n')}

Peer Reviews:
${stage2Results.map(r => `${r.reviewerProvider} ranked ${r.targetProvider} as #${r.ranking}: ${r.reasoning}`).join('\n')}

Based on the expert answers and peer reviews, provide a comprehensive final answer. Synthesize the best insights from all experts and present a clear, well-structured response.`;

    // Stream the synthesis
    const config = getLLMConfig(bestAnswer.provider as any, bestAnswer.model);

    if (bestAnswer.provider === 'openai') {
      for await (const token of streamWithOpenAI(config, domainConfig.systemPrompt, synthesisPrompt)) {
        yield token;
        options.onStage3Token?.(token);
      }
    } else if (bestAnswer.provider === 'anthropic') {
      for await (const token of streamWithAnthropic(config, domainConfig.systemPrompt, synthesisPrompt)) {
        yield token;
        options.onStage3Token?.(token);
      }
    } else {
      // Fallback to OpenAI if unknown provider
      const openaiConfig = getLLMConfig('openai', supportedProviders.openai);
      for await (const token of streamWithOpenAI(openaiConfig, domainConfig.systemPrompt, synthesisPrompt)) {
        yield token;
        options.onStage3Token?.(token);
      }
    }

    stage3Logger.complete(Date.now());
    options.onComplete?.();

    // Ensure background processing completes
    await backgroundProcessing;

  } catch (error) {
    logWithContext.error('Stage 3 streaming failed', error as Error, { queryId, domain });
    yield `\n\nError: ${error instanceof Error ? error.message : String(error)}`;
    options.onError?.(error as Error);
  }
}
