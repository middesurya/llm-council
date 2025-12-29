/**
 * Vector Store for Semantic Search
 * Uses OpenAI embeddings with local storage (can migrate to Pinecone/Weaviate)
 */

import OpenAI from 'openai';
import { getLLMConfig } from '@/config/llm-config';

export interface VectorEmbedding {
  id: string;
  text: string;
  embedding: number[];
  metadata: {
    domain: string;
    type: 'icd10' | 'medical_reference' | 'accounting_standard' | 'financial_reference';
    code?: string;
    topic?: string;
    category?: string;
    framework?: 'GAAP' | 'IFRS';
    keywords?: string[];
  };
  timestamp: number;
}

export interface SearchResult {
  item: VectorEmbedding;
  similarity: number;
}

class VectorStore {
  private embeddings: Map<string, VectorEmbedding> = new Map();
  private openai: OpenAI | null = null;
  private initialized = false;

  /**
   * Initialize vector store with OpenAI client
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const config = getLLMConfig('openai', 'gpt-4');
      this.openai = new OpenAI({ apiKey: config.apiKey });

      // Load existing embeddings from file
      await this.loadEmbeddings();

      this.initialized = true;
      console.log('[VectorStore] Initialized with', this.embeddings.size, 'embeddings');
    } catch (error) {
      console.warn('[VectorStore] Initialization failed:', error);
      // Continue without vector search
      this.initialized = true;
    }
  }

  /**
   * Generate embedding for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openai) {
      console.warn('[VectorStore] OpenAI client not initialized');
      return null;
    }

    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small', // Cost-effective, good performance
        input: text,
        dimensions: 1536, // Standard embedding dimension
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('[VectorStore] Failed to generate embedding:', error);
      return null;
    }
  }

  /**
   * Add embedding to store
   */
  async addEmbedding(item: Omit<VectorEmbedding, 'embedding' | 'timestamp'>): Promise<void> {
    const embedding = await this.generateEmbedding(item.text);
    if (!embedding) return;

    const vectorItem: VectorEmbedding = {
      ...item,
      embedding,
      timestamp: Date.now(),
    };

    this.embeddings.set(vectorItem.id, vectorItem);
    await this.saveEmbeddings();
  }

  /**
   * Add multiple embeddings in batch
   */
  async addBatchEmbeddings(items: Omit<VectorEmbedding, 'embedding' | 'timestamp'>[]): Promise<void> {
    const batchSize = 100; // OpenAI rate limit consideration
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (item) => {
          const embedding = await this.generateEmbedding(item.text);
          if (embedding) {
            this.embeddings.set(item.id, {
              ...item,
              embedding,
              timestamp: Date.now(),
            });
          }
        })
      );
      console.log(`[VectorStore] Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`);
    }
    await this.saveEmbeddings();
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Search for similar items using vector similarity
   */
  async search(query: string, options: {
    limit?: number;
    minSimilarity?: number;
    domain?: string;
    type?: VectorEmbedding['metadata']['type'];
  } = {}): Promise<SearchResult[]> {
    if (this.embeddings.size === 0) {
      return [];
    }

    const { limit = 10, minSimilarity = 0.7, domain, type } = options;

    // Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    if (!queryEmbedding) {
      return [];
    }

    // Calculate similarities
    const results: SearchResult[] = [];

    for (const [id, item] of this.embeddings.entries()) {
      // Filter by domain/type if specified
      if (domain && item.metadata.domain !== domain) continue;
      if (type && item.metadata.type !== type) continue;

      const similarity = this.cosineSimilarity(queryEmbedding, item.embedding);

      if (similarity >= minSimilarity) {
        results.push({ item, similarity });
      }
    }

    // Sort by similarity (descending) and limit
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  }

  /**
   * Get contextual text for search results
   */
  formatSearchResults(results: SearchResult[]): string {
    if (results.length === 0) {
      return '';
    }

    let context = '\n\n=== SEMANTIC SEARCH RESULTS ===\n';

    results.forEach((result, idx) => {
      const { item, similarity } = result;
      context += `\n[${idx + 1}] Similarity: ${(similarity * 100).toFixed(1)}%\n`;

      if (item.metadata.type === 'icd10') {
        context += `ICD-10 Code: ${item.metadata.code}\n`;
        context += `${item.text}\n`;
        if (item.metadata.category) {
          context += `Category: ${item.metadata.category}\n`;
        }
      } else if (item.metadata.type === 'medical_reference') {
        context += `Medical Reference: ${item.metadata.topic}\n`;
        context += `${item.text}\n`;
      } else if (item.metadata.type === 'accounting_standard') {
        context += `Standard: ${item.metadata.code} (${item.metadata.framework})\n`;
        context += `${item.text}\n`;
      } else if (item.metadata.type === 'financial_reference') {
        context += `Financial Reference: ${item.metadata.topic}\n`;
        context += `${item.text}\n`;
      }
    });

    context += '\n=== END SEARCH RESULTS ===\n';
    return context;
  }

  /**
   * Save embeddings to local file
   */
  private async saveEmbeddings(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      const data = Array.from(this.embeddings.values());
      const filePath = path.join(process.cwd(), '.data', 'embeddings.json');

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('[VectorStore] Failed to save embeddings:', error);
    }
  }

  /**
   * Load embeddings from local file
   */
  private async loadEmbeddings(): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');

      const filePath = path.join(process.cwd(), '.data', 'embeddings.json');
      const exists = await fs.access(filePath).then(() => true).catch(() => false);

      if (!exists) {
        console.log('[VectorStore] No existing embeddings found');
        return;
      }

      const data = await fs.readFile(filePath, 'utf-8');
      const items: VectorEmbedding[] = JSON.parse(data);

      for (const item of items) {
        this.embeddings.set(item.id, item);
      }

      console.log('[VectorStore] Loaded', items.length, 'embeddings from file');
    } catch (error) {
      console.error('[VectorStore] Failed to load embeddings:', error);
    }
  }

  /**
   * Get statistics
   */
  getStats() {
    const byDomain = { healthcare: 0, finance: 0, general: 0 };
    const byType = {
      icd10: 0,
      medical_reference: 0,
      accounting_standard: 0,
      financial_reference: 0,
    };

    for (const item of this.embeddings.values()) {
      byDomain[item.metadata.domain as keyof typeof byDomain]++;
      byType[item.metadata.type]++;
    }

    return {
      total: this.embeddings.size,
      byDomain,
      byType,
    };
  }

  /**
   * Clear all embeddings (for testing)
   */
  async clear(): Promise<void> {
    this.embeddings.clear();
    await this.saveEmbeddings();
  }
}

// Singleton instance
export const vectorStore = new VectorStore();
