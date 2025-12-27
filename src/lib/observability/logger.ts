import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format (pretty print for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, queryId, domain, stage, ...metadata }) => {
    let msg = `${timestamp} [${level}]`;

    if (queryId) msg += ` query:${queryId}`;
    if (domain) msg += ` domain:${domain}`;
    if (stage) msg += ` stage:${stage}`;

    msg += ` ${message}`;

    // Add metadata
    const keys = Object.keys(metadata);
    if (keys.length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }

    return msg;
  })
);

// Create logs directory
const logDir = path.join(process.cwd(), 'logs');

// File transport for all logs
const fileTransport = new DailyRotateFile({
  dirname: logDir,
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat,
});

// File transport for errors only
const errorFileTransport = new DailyRotateFile({
  dirname: logDir,
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  level: 'error',
  format: logFormat,
});

// Create logger instance
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  format: logFormat,
  transports: [
    fileTransport,
    errorFileTransport,
  ],
  // Don't exit on error
  exitOnError: false,
});

// Add console transport in development
if (isDevelopment) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Enhanced logging methods with context
export const logWithContext = {
  info: (message: string, context?: { queryId?: string; domain?: string; stage?: string; [key: string]: any }) => {
    logger.info(message, context || {});
  },
  error: (message: string, error?: Error | unknown, context?: { queryId?: string; domain?: string; stage?: string; [key: string]: any }) => {
    const errorContext = {
      ...context,
      ...(error instanceof Error ? {
        error: error.message,
        stack: error.stack,
      } : { error }),
    };
    logger.error(message, errorContext);
  },
  warn: (message: string, context?: { queryId?: string; domain?: string; stage?: string; [key: string]: any }) => {
    logger.warn(message, context || {});
  },
  debug: (message: string, context?: { queryId?: string; domain?: string; stage?: string; [key: string]: any }) => {
    logger.debug(message, context || {});
  },
};

// Stage-specific logging
export const logStage = (stage: 'stage1' | 'stage2' | 'stage3', queryId: string, domain: string) => ({
  start: () => logWithContext.info(`${stage} started`, { queryId, domain, stage }),
  complete: (duration: number, additionalContext?: Record<string, any>) =>
    logWithContext.info(`${stage} completed`, { queryId, domain, stage, duration, ...additionalContext }),
  error: (error: Error) =>
    logWithContext.error(`${stage} failed`, error, { queryId, domain, stage }),
});

export default logger;
