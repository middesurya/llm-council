export interface PersonaConfig {
  name: string;
  title: string;
  icon: string;
  color: string;
  gradient: string;
}

/**
 * Get domain-specific persona for a model provider
 */
export function getModelPersona(
  provider: string,
  domain: string
): PersonaConfig {
  const providerLower = provider.toLowerCase();

  if (domain === "healthcare") {
    switch (providerLower) {
      case "openai":
        return {
          name: "Dr. GPT",
          title: "Medical Specialist",
          icon: "🩺",
          color: "emerald",
          gradient: "from-emerald-500 to-teal-600",
        };
      case "anthropic":
        return {
          name: "Dr. Claude",
          title: "Clinical Consultant",
          icon: "🏥",
          color: "cyan",
          gradient: "from-cyan-500 to-blue-600",
        };
      case "google":
        return {
          name: "Dr. Gemini",
          title: "Healthcare Analyst",
          icon: "💊",
          color: "teal",
          gradient: "from-teal-500 to-emerald-600",
        };
      default:
        return {
          name: `Dr. ${provider}`,
          title: "Medical Expert",
          icon: "👨‍⚕️",
          color: "emerald",
          gradient: "from-emerald-500 to-teal-600",
        };
    }
  }

  if (domain === "finance") {
    switch (providerLower) {
      case "openai":
        return {
          name: "Analyst GPT",
          title: "Financial Advisor",
          icon: "📊",
          color: "amber",
          gradient: "from-amber-500 to-orange-600",
        };
      case "anthropic":
        return {
          name: "Auditor Claude",
          title: "Risk Analyst",
          icon: "💰",
          color: "yellow",
          gradient: "from-yellow-500 to-amber-600",
        };
      case "google":
        return {
          name: "Strategist Gemini",
          title: "Investment Analyst",
          icon: "📈",
          color: "orange",
          gradient: "from-orange-500 to-red-600",
        };
      default:
        return {
          name: `Analyst ${provider}`,
          title: "Financial Expert",
          icon: "💼",
          color: "amber",
          gradient: "from-amber-500 to-orange-600",
        };
    }
  }

  // General domain
  switch (providerLower) {
    case "openai":
      return {
        name: "Expert GPT",
        title: "Research Analyst",
        icon: "💡",
        color: "indigo",
        gradient: "from-indigo-500 to-purple-600",
      };
    case "anthropic":
      return {
        name: "Scholar Claude",
        title: "Knowledge Specialist",
        icon: "📚",
        color: "violet",
        gradient: "from-violet-500 to-purple-600",
      };
    case "google":
      return {
        name: "Thinker Gemini",
        title: "Information Analyst",
        icon: "🧠",
        color: "cyan",
        gradient: "from-cyan-500 to-blue-600",
      };
    default:
      return {
        name: `Expert ${provider}`,
        title: "AI Specialist",
        icon: "🤖",
        color: "indigo",
        gradient: "from-indigo-500 to-purple-600",
      };
  }
}
