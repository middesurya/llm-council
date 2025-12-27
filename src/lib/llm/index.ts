import { LLMConfig } from "@/config/llm-config";
import { generateWithOpenAI } from "./openai-client";
import { generateWithAnthropic } from "./anthropic-client";
import { generateWithGoogle } from "./google-client";

export function createLLMClient(config: LLMConfig) {
  return config;
}

export async function generateWithClient(
  config: LLMConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  switch (config.provider) {
    case "openai":
      return generateWithOpenAI(config, systemPrompt, userPrompt);
    case "anthropic":
      return generateWithAnthropic(config, systemPrompt, userPrompt);
    case "google":
      return generateWithGoogle(config, systemPrompt, userPrompt);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

export * from "./orchestrator";
