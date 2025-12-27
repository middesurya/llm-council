export interface PersonaConfig {
  name: string;
  title: string;
  icon: string;
}

/**
 * Get domain-specific persona for a model provider
 */
export function getModelPersona(provider: string, domain: string): PersonaConfig {
  const providerLower = provider.toLowerCase();

  if (domain === "healthcare") {
    switch (providerLower) {
      case "openai":
        return { name: "Dr. GPT", title: "Medical Specialist", icon: "🩺" };
      case "anthropic":
        return { name: "Dr. Claude", title: "Clinical Consultant", icon: "🏥" };
      case "google":
        return { name: "Dr. Gemini", title: "Healthcare Analyst", icon: "💊" };
      default:
        return { name: `Dr. ${provider}`, title: "Medical Expert", icon: "👨‍⚕️" };
    }
  }

  if (domain === "finance") {
    switch (providerLower) {
      case "openai":
        return { name: "Analyst GPT", title: "Financial Advisor", icon: "📊" };
      case "anthropic":
        return { name: "Auditor Claude", title: "Risk Analyst", icon: "💰" };
      case "google":
        return { name: "Strategist Gemini", title: "Investment Analyst", icon: "📈" };
      default:
        return { name: `Analyst ${provider}`, title: "Financial Expert", icon: "💼" };
    }
  }

  // General domain
  switch (providerLower) {
    case "openai":
      return { name: "Expert GPT", title: "Research Analyst", icon: "💡" };
    case "anthropic":
      return { name: "Scholar Claude", title: "Knowledge Specialist", icon: "📚" };
    case "google":
      return { name: "Thinker Gemini", title: "Information Analyst", icon: "🧠" };
    default:
      return { name: `Expert ${provider}`, title: "AI Specialist", icon: "🤖" };
  }
}
