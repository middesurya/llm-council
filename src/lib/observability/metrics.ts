interface MetricData {
  queryId: string;
  domain: string;
  stage1Duration?: number;
  stage2Duration?: number;
  stage3Duration?: number;
  totalDuration?: number;
  tokenUsage?: {
    openai?: number;
    anthropic?: number;
    google?: number;
  };
  providerSuccess?: {
    openai: boolean;
    anthropic: boolean;
    google: boolean;
  };
  timestamp: Date;
}

class MetricsCollector {
  private metrics: Map<string, Partial<MetricData>> = new Map();

  // Initialize a new metric collection for a query
  initialize(queryId: string, domain: string): void {
    this.metrics.set(queryId, {
      queryId,
      domain,
      timestamp: new Date(),
    });
  }

  // Record stage duration
  recordStage(queryId: string, stage: 'stage1' | 'stage2' | 'stage3', duration: number): void {
    const metric = this.metrics.get(queryId);
    if (metric) {
      metric[`${stage}Duration`] = duration;
    }
  }

  // Record token usage
  recordTokenUsage(queryId: string, provider: 'openai' | 'anthropic' | 'google', tokens: number): void {
    const metric = this.metrics.get(queryId);
    if (metric) {
      if (!metric.tokenUsage) {
        metric.tokenUsage = {};
      }
      metric.tokenUsage[provider] = tokens;
    }
  }

  // Record provider success/failure
  recordProviderSuccess(queryId: string, provider: 'openai' | 'anthropic' | 'google', success: boolean): void {
    const metric = this.metrics.get(queryId);
    if (metric) {
      if (!metric.providerSuccess) {
        metric.providerSuccess = {
          openai: false,
          anthropic: false,
          google: false,
        };
      }
      metric.providerSuccess[provider] = success;
    }
  }

  // Mark query as complete and calculate total duration
  complete(queryId: string): MetricData | null {
    const metric = this.metrics.get(queryId);
    if (!metric) return null;

    const totalDuration = (metric.stage1Duration || 0) +
                         (metric.stage2Duration || 0) +
                         (metric.stage3Duration || 0);

    const completeMetric: MetricData = {
      ...metric,
      totalDuration,
    } as MetricData;

    // Keep in memory for analytics (with TTL)
    // In production, this would go to a time-series database
    this.metrics.set(queryId, completeMetric);

    return completeMetric;
  }

  // Get metric for a specific query
  get(queryId: string): MetricData | null {
    const metric = this.metrics.get(queryId);
    return metric ? (metric as MetricData) : null;
  }

  // Calculate success rate for a provider
  getProviderSuccessRate(provider: 'openai' | 'anthropic' | 'google'): number {
    let successCount = 0;
    let totalCount = 0;

    this.metrics.forEach((metric) => {
      if (metric.providerSuccess && provider in metric.providerSuccess) {
        totalCount++;
        if (metric.providerSuccess[provider]) {
          successCount++;
        }
      }
    });

    return totalCount > 0 ? (successCount / totalCount) * 100 : 0;
  }

  // Get average duration for a stage
  getAverageStageDuration(stage: 'stage1' | 'stage2' | 'stage3'): number {
    let total = 0;
    let count = 0;

    this.metrics.forEach((metric) => {
      const duration = metric[`${stage}Duration`];
      if (duration) {
        total += duration;
        count++;
      }
    });

    return count > 0 ? total / count : 0;
  }

  // Get metrics for a domain
  getDomainMetrics(domain: string): MetricData[] {
    const domainMetrics: MetricData[] = [];

    this.metrics.forEach((metric) => {
      if (metric.domain === domain) {
        domainMetrics.push(metric as MetricData);
      }
    });

    return domainMetrics;
  }

  // Clear old metrics (prevent memory leaks)
  clear(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.metrics.forEach((metric, queryId) => {
      if (metric.timestamp && (now - metric.timestamp.getTime()) > maxAgeMs) {
        toDelete.push(queryId);
      }
    });

    toDelete.forEach(queryId => this.metrics.delete(queryId));
  }

  // Get summary statistics
  getSummary() {
    const totalQueries = this.metrics.size;
    const domainCounts: Record<string, number> = {};
    const avgTotalDuration = this.getAverageStageDuration('stage1') +
                             this.getAverageStageDuration('stage2') +
                             this.getAverageStageDuration('stage3');

    this.metrics.forEach((metric) => {
      if (metric.domain) {
        domainCounts[metric.domain] = (domainCounts[metric.domain] || 0) + 1;
      }
    });

    return {
      totalQueries,
      domainCounts,
      avgTotalDuration,
      providerSuccessRates: {
        openai: this.getProviderSuccessRate('openai'),
        anthropic: this.getProviderSuccessRate('anthropic'),
        google: this.getProviderSuccessRate('google'),
      },
    };
  }
}

// Export singleton instance
export const metricsCollector = new MetricsCollector();

// Export MetricData type at module level
export type { MetricData };


// Auto-clear old metrics every hour
if (typeof window === 'undefined') {
  setInterval(() => {
    metricsCollector.clear();
  }, 60 * 60 * 1000);
}
