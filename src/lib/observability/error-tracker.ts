import { logWithContext } from './logger';

export enum ErrorCategory {
  PROVIDER_ERROR = 'provider',
  VALIDATION_ERROR = 'validation',
  SYSTEM_ERROR = 'system',
  TIMEOUT_ERROR = 'timeout',
  DATABASE_ERROR = 'database',
}

export interface ErrorContext {
  queryId?: string;
  domain?: string;
  provider?: string;
  stage?: string;
  [key: string]: any;
}

interface TrackedError {
  id: string;
  category: ErrorCategory;
  message: string;
  stackTrace?: string;
  context: ErrorContext;
  timestamp: Date;
  resolved: boolean;
}

class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private errorCounts: Map<string, number> = new Map();

  // Track a new error
  track(
    error: Error | string,
    category: ErrorCategory,
    context: ErrorContext = {}
  ): string {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const message = typeof error === 'string' ? error : error.message;
    const stackTrace = typeof error === 'string' ? undefined : error.stack;

    const trackedError: TrackedError = {
      id: errorId,
      category,
      message,
      stackTrace,
      context,
      timestamp: new Date(),
      resolved: false,
    };

    this.errors.set(errorId, trackedError);

    // Increment error count for this category
    const countKey = `${category}:${message.substring(0, 50)}`;
    this.errorCounts.set(countKey, (this.errorCounts.get(countKey) || 0) + 1);

    // Log the error
    logWithContext.error(
      `[${category}] ${message}`,
      typeof error === 'string' ? new Error(message) : error,
      context
    );

    return errorId;
  }

  // Mark error as resolved
  resolve(errorId: string): void {
    const error = this.errors.get(errorId);
    if (error) {
      error.resolved = true;
      logWithContext.info(`Error ${errorId} marked as resolved`, {
        errorId,
        category: error.category,
      });
    }
  }

  // Get error by ID
  get(errorId: string): TrackedError | undefined {
    return this.errors.get(errorId);
  }

  // Get all errors
  getAll(): TrackedError[] {
    return Array.from(this.errors.values());
  }

  // Get unresolved errors
  getUnresolved(): TrackedError[] {
    return Array.from(this.errors.values()).filter(e => !e.resolved);
  }

  // Get errors by category
  getByCategory(category: ErrorCategory): TrackedError[] {
    return Array.from(this.errors.values()).filter(e => e.category === category);
  }

  // Get error frequency
  getErrorFrequency(): Map<string, number> {
    return new Map(this.errorCounts);
  }

  // Get errors for a specific query
  getQueryErrors(queryId: string): TrackedError[] {
    return Array.from(this.errors.values()).filter(e => e.context.queryId === queryId);
  }

  // Get error statistics
  getStatistics() {
    const totalErrors = this.errors.size;
    const unresolvedErrors = this.getUnresolved().length;
    const errorsByCategory: Record<string, number> = {};

    this.errors.forEach(error => {
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
    });

    return {
      totalErrors,
      unresolvedErrors,
      errorsByCategory,
      mostFrequentErrors: Array.from(this.errorCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
    };
  }

  // Clear old errors
  clear(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.errors.forEach((error, errorId) => {
      if ((now - error.timestamp.getTime()) > maxAgeMs) {
        toDelete.push(errorId);
      }
    });

    toDelete.forEach(errorId => this.errors.delete(errorId));
  }
}

// Export singleton instance
export const errorTracker = new ErrorTracker();

// Convenience function for tracking provider errors
export const trackProviderError = (provider: string, error: Error, context: ErrorContext): string => {
  return errorTracker.track(error, ErrorCategory.PROVIDER_ERROR, {
    ...context,
    provider,
  });
};

// Convenience function for tracking validation errors
export const trackValidationError = (message: string, context: ErrorContext): string => {
  return errorTracker.track(message, ErrorCategory.VALIDATION_ERROR, context);
};

// Convenience function for tracking timeout errors
export const trackTimeoutError = (context: ErrorContext): string => {
  return errorTracker.track('Request timeout', ErrorCategory.TIMEOUT_ERROR, context);
};
