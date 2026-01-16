export interface PersonaConfig {
  name: string;
  title: string;
  icon: string;
  color: string;
  gradient: string;
}

/**
 * Get domain-specific persona for a model provider
 * Updated to use new Violet/Cyan/Teal/Blue color palette
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
          color: "teal",
          gradient: "from-teal-500 to-cyan-500",
        };
      case "anthropic":
        return {
          name: "Dr. Claude",
          title: "Clinical Consultant",
          icon: "🏥",
          color: "cyan",
          gradient: "from-cyan-500 to-teal-500",
        };
      case "google":
        return {
          name: "Dr. Gemini",
          title: "Healthcare Analyst",
          icon: "💊",
          color: "emerald",
          gradient: "from-emerald-500 to-teal-500",
        };
      default:
        return {
          name: `Dr. ${provider}`,
          title: "Medical Expert",
          icon: "👨‍⚕️",
          color: "teal",
          gradient: "from-teal-500 to-cyan-500",
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
          color: "blue",
          gradient: "from-blue-500 to-indigo-500",
        };
      case "anthropic":
        return {
          name: "Auditor Claude",
          title: "Risk Analyst",
          icon: "💰",
          color: "indigo",
          gradient: "from-indigo-500 to-blue-500",
        };
      case "google":
        return {
          name: "Strategist Gemini",
          title: "Investment Analyst",
          icon: "📈",
          color: "violet",
          gradient: "from-violet-500 to-blue-500",
        };
      default:
        return {
          name: `Analyst ${provider}`,
          title: "Financial Expert",
          icon: "💼",
          color: "blue",
          gradient: "from-blue-500 to-indigo-500",
        };
    }
  }

  // General domain - Cyan/Violet theme
  switch (providerLower) {
    case "openai":
      return {
        name: "Expert GPT",
        title: "Research Analyst",
        icon: "💡",
        color: "cyan",
        gradient: "from-cyan-500 to-violet-500",
      };
    case "anthropic":
      return {
        name: "Scholar Claude",
        title: "Knowledge Specialist",
        icon: "📚",
        color: "violet",
        gradient: "from-violet-500 to-cyan-500",
      };
    case "google":
      return {
        name: "Thinker Gemini",
        title: "Information Analyst",
        icon: "🧠",
        color: "teal",
        gradient: "from-teal-500 to-violet-500",
      };
    default:
      return {
        name: `Expert ${provider}`,
        title: "AI Specialist",
        icon: "🤖",
        color: "cyan",
        gradient: "from-cyan-500 to-violet-500",
      };
  }
}
