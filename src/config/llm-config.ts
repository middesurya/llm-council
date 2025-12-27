export interface LLMConfig {
  provider: "openai" | "anthropic" | "google";
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export function getLLMConfig(provider: LLMConfig["provider"], model: string): LLMConfig {
  const apiKeyEnvVars: Record<LLMConfig["provider"], string> = {
    openai: "OPENAI_API_KEY",
    anthropic: "ANTHROPIC_API_KEY",
    google: "GOOGLE_API_KEY",
  };

  const apiKey = process.env[apiKeyEnvVars[provider]] || "";

  const baseUrls: Partial<Record<LLMConfig["provider"], string>> = {
    openai: "https://api.openai.com/v1",
    google: "https://generativelanguage.googleapis.com/v1beta",
  };

  return {
    provider,
    apiKey,
    model,
    baseUrl: baseUrls[provider],
  };
}
