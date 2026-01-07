/**
 * Environment validation and configuration
 * Validates required environment variables on startup
 */

export interface EnvConfig {
  // Database
  DATABASE_URL: string;

  // Redis (optional - graceful degradation)
  REDIS_URL?: string;
  ENABLE_CACHE?: boolean;

  // LLM Providers (at least one required)
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GOOGLE_API_KEY?: string;

  // Admin
  ADMIN_PASSWORD: string;

  // Feature Flags
  ENABLE_STREAMING?: boolean;
  ENABLE_FILE_UPLOAD?: boolean;

  // Logging
  LOG_LEVEL?: "debug" | "info" | "warn" | "error";

  // Runtime
  NODE_ENV: "development" | "production" | "test";
  VERCEL?: boolean;
}

class EnvValidationError extends Error {
  constructor(
    public missingVars: string[],
    public warnings: string[]
  ) {
    super(`Missing required environment variables: ${missingVars.join(", ")}`);
    this.name = "EnvValidationError";
  }
}

export function validateEnv(): { config: EnvConfig; warnings: string[] } {
  const missingVars: string[] = [];
  const warnings: string[] = [];

  // Required variables
  if (!process.env.DATABASE_URL) {
    missingVars.push("DATABASE_URL");
  }

  if (!process.env.ADMIN_PASSWORD) {
    missingVars.push("ADMIN_PASSWORD");
  } else if (process.env.ADMIN_PASSWORD === "admin123") {
    warnings.push(
      "ADMIN_PASSWORD is set to default value. Change it in production!"
    );
  }

  // At least one LLM provider required
  const hasLLMProvider =
    process.env.OPENAI_API_KEY ||
    process.env.ANTHROPIC_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (!hasLLMProvider) {
    missingVars.push("At least one LLM API key (OPENAI/ANTHROPIC/GOOGLE)");
  }

  // Optional but recommended
  if (!process.env.REDIS_URL) {
    warnings.push(
      "REDIS_URL not set. Caching will be disabled, which may impact performance."
    );
  }

  if (missingVars.length > 0 && process.env.NODE_ENV === "production") {
    throw new EnvValidationError(missingVars, warnings);
  }

  const config: EnvConfig = {
    DATABASE_URL: process.env.DATABASE_URL || "",
    REDIS_URL: process.env.REDIS_URL,
    ENABLE_CACHE: process.env.ENABLE_CACHE === "true",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "admin123",
    ENABLE_STREAMING: process.env.ENABLE_STREAMING === "true",
    ENABLE_FILE_UPLOAD: process.env.ENABLE_FILE_UPLOAD === "true",
    LOG_LEVEL:
      (process.env.LOG_LEVEL as EnvConfig["LOG_LEVEL"]) || "info",
    NODE_ENV: (process.env.NODE_ENV as EnvConfig["NODE_ENV"]) || "development",
    VERCEL: !!process.env.VERCEL,
  };

  return { config, warnings };
}

export function getEnvConfig(): EnvConfig {
  const { config } = validateEnv();
  return config;
}

// Log warnings on import in development
if (process.env.NODE_ENV !== "production") {
  try {
    const { warnings } = validateEnv();
    if (warnings.length > 0) {
      console.warn("\n⚠️  Environment Warnings:");
      warnings.forEach((w) => console.warn(`   - ${w}`));
      console.warn("");
    }
  } catch (e) {
    // Ignore in development
  }
}
