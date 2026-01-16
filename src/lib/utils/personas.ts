export interface PersonaConfig {
  name: string;
  title: string;
  icon: string;
  color: string;
}

/**
 * Get domain-specific persona for a model provider
 */
export function getModelPersona(provider: string, domain: string): PersonaConfig {
  const providerLower = provider.toLowerCase();

  if (domain === "healthcare") {
    switch (providerLower) {
      case "openai":
        return { name: "Dr. GPT", title: "Medical Specialist", icon: "🩺", color: "indigo" };
      case "anthropic":
        return { name: "Dr. Claude", title: "Clinical Consultant", icon: "🏥", color: "violet" };
      case "google":
        return { name: "Dr. Gemini", title: "Healthcare Analyst", icon: "💊", color: "cyan" };
      default:
        return { name: `Dr. ${provider}`, title: "Medical Expert", icon: "👨‍⚕️", color: "emerald" };
    }
  }

  if (domain === "finance") {
    switch (providerLower) {
      case "openai":
        return { name: "Analyst GPT", title: "Financial Advisor", icon: "📊", color: "indigo" };
      case "anthropic":
        return { name: "Auditor Claude", title: "Risk Analyst", icon: "💰", color: "violet" };
      case "google":
        return { name: "Strategist Gemini", title: "Investment Analyst", icon: "📈", color: "cyan" };
      default:
        return { name: `Analyst ${provider}`, title: "Financial Expert", icon: "💼", color: "amber" };
    }
  }

  // General domain
  switch (providerLower) {
    case "openai":
      return { name: "Expert GPT", title: "Research Analyst", icon: "💡", color: "indigo" };
    case "anthropic":
      return { name: "Scholar Claude", title: "Knowledge Specialist", icon: "📚", color: "violet" };
    case "google":
      return { name: "Thinker Gemini", title: "Information Analyst", icon: "🧠", color: "cyan" };
    default:
      return { name: `Expert ${provider}`, title: "AI Specialist", icon: "🤖", color: "gray" };
  }
}
