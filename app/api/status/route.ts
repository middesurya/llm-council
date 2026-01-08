import { NextResponse } from "next/server";
import { getLLMConfig } from "@/config/llm-config";
import { createLLMClient, generateWithClient } from "@/lib/llm";

export async function GET() {
  const providers = ["openai", "anthropic", "google"] as const;
  const results: Record<
    string,
    { status: string; model: string; error?: string }
  > = {};

  for (const provider of providers) {
    try {
      const models: Record<string, string> = {
        openai: "gpt-4o",
        anthropic: "claude-3-sonnet-20240229",
        google: "gemini-1.5-flash",
      };

      const config = getLLMConfig(provider, models[provider]);

      if (!config.apiKey || config.apiKey.trim() === "") {
        results[provider] = {
          status: "error",
          model: models[provider],
          error: "API key not configured",
        };
        continue;
      }

      const client = createLLMClient(config);
      const testPrompt = "Respond with just the word: OK";
      const systemPrompt = "You are a helpful assistant.";

      await Promise.race([
        generateWithClient(client, systemPrompt, testPrompt),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout after 10s")), 10000)
        ),
      ]);

      results[provider] = {
        status: "ok",
        model: models[provider],
      };
    } catch (error: any) {
      results[provider] = {
        status: "error",
        model:
          provider === "openai"
            ? "gpt-4o"
            : provider === "anthropic"
            ? "claude-3-sonnet-20240229"
            : "gemini-1.5-flash",
        error: error.message || "Unknown error",
      };
    }
  }

  return NextResponse.json({
    providers: results,
    timestamp: new Date().toISOString(),
  });
}
