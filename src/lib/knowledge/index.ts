/**
 * Knowledge Service
 * Provides domain-specific context and knowledge retrieval for enhanced LLM responses
 * Now with vector semantic search!
 */

import { getMedicalContext } from "./healthcare-kb";
import { getFinancialContext } from "./finance-kb";
import { vectorStore } from "./vector-store";

export interface KnowledgeEnhancement {
  context: string;
  sources: string[];
  searchMethod: 'keyword' | 'semantic' | 'hybrid';
  semanticSimilarity?: number; // 0-100 scaled similarity score
}

/**
 * Retrieve relevant knowledge context using semantic search
 */
async function getSemanticContext(
  query: string,
  domain: string
): Promise<{ context: string; avgSimilarity: number }> {
  try {
    await vectorStore.initialize();

    const results = await vectorStore.search(query, {
      limit: 5,
      minSimilarity: 0.7,
      domain: domain.toLowerCase(),
    });

    if (results.length === 0) {
      return { context: '', avgSimilarity: 0 };
    }

    // Calculate average similarity (scaled to 0-100)
    const avgSimilarity = (results.reduce((sum, r) => sum + r.similarity, 0) / results.length) * 100;
    const context = vectorStore.formatSearchResults(results);

    return { context, avgSimilarity };
  } catch (error) {
    console.error('[KnowledgeService] Semantic search failed:', error);
    return { context: '', avgSimilarity: 0 };
  }
}

/**
 * Retrieve relevant knowledge context based on domain and query
 * Hybrid approach: Uses semantic search first, falls back to keyword matching
 */
export async function getKnowledgeContext(
  query: string,
  domain: string,
  options: {
    preferSemantic?: boolean;
  } = {}
): Promise<KnowledgeEnhancement> {
  const lowerQuery = query.toLowerCase();
  const lowerDomain = domain.toLowerCase();
  const { preferSemantic = true } = options;

  let context = "";
  let searchMethod: KnowledgeEnhancement['searchMethod'] = 'keyword';
  let semanticSimilarity: number | undefined;
  const sources: string[] = [];

  // Try semantic search first (if enabled and available)
  if (preferSemantic) {
    try {
      const semanticResult = await getSemanticContext(query, domain);
      if (semanticResult.context.trim()) {
        context = semanticResult.context;
        semanticSimilarity = semanticResult.avgSimilarity;
        searchMethod = 'semantic';
        sources.push("Vector Semantic Search");
      }
    } catch (error) {
      console.warn('[KnowledgeService] Semantic search unavailable, using keywords');
    }
  }

  // Fall back to keyword search if semantic search didn't find anything
  if (!context) {
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
    searchMethod = 'keyword';
  }

  return {
    context: context.trim(),
    sources,
    searchMethod,
    semanticSimilarity,
  };
}

/**
 * Enhance a query with relevant knowledge context (async version with semantic search)
 */
export async function enhanceQueryWithKnowledge(
  query: string,
  domain: string,
  options?: {
    preferSemantic?: boolean;
  }
): Promise<string> {
  const { context } = await getKnowledgeContext(query, domain, options);

  if (!context) {
    return query;
  }

  return `${query}\n\n=== RELEVANT KNOWLEDGE CONTEXT ===${context}\n=== END KNOWLEDGE CONTEXT ===`;
}

/**
 * Synchronous version for backward compatibility (keyword-only)
 */
export function enhanceQueryWithKnowledgeSync(
  query: string,
  domain: string
): string {
  const lowerQuery = query.toLowerCase();
  const lowerDomain = domain.toLowerCase();

  let context = "";

  if (lowerDomain === "healthcare") {
    context = getMedicalContext(query);
  } else if (lowerDomain === "finance") {
    context = getFinancialContext(query);
  }

  if (!context) {
    return query;
  }

  return `${query}\n\n=== RELEVANT KNOWLEDGE CONTEXT ===${context}\n=== END KNOWLEDGE CONTEXT ===`;
}
