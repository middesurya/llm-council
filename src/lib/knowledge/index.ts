/**
 * Knowledge Service
 * Provides domain-specific context and knowledge retrieval for enhanced LLM responses
 */

import { getMedicalContext } from "./healthcare-kb";
import { getFinancialContext } from "./finance-kb";

export interface KnowledgeEnhancement {
  context: string;
  sources: string[];
}

/**
 * Retrieve relevant knowledge context based on domain and query
 */
export function getKnowledgeContext(
  query: string,
  domain: string
): KnowledgeEnhancement {
  const lowerQuery = query.toLowerCase();
  const lowerDomain = domain.toLowerCase();

  let context = "";
  const sources: string[] = [];

  if (lowerDomain === "healthcare") {
    context = getMedicalContext(query);
    if (context.trim()) {
      sources.push("ICD-10 Codes", "Medical Reference Database");
    }
  } else if (lowerDomain === "finance") {
    context = getFinancialContext(query);
    if (context.trim()) {
      sources.push("GAAP Standards", "IFRS Standards", "Financial Reference Database");
    }
  }

  return {
    context: context.trim(),
    sources,
  };
}

/**
 * Enhance a query with relevant knowledge context
 */
export function enhanceQueryWithKnowledge(
  query: string,
  domain: string
): string {
  const { context } = getKnowledgeContext(query, domain);

  if (!context) {
    return query;
  }

  return `${query}\n\n=== RELEVANT KNOWLEDGE CONTEXT ===${context}\n=== END KNOWLEDGE CONTEXT ===`;
}
