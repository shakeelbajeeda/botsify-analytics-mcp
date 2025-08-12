import winston from 'winston';
import { LogContext } from '../types/index.js';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const context = meta.context ? ` [${JSON.stringify(meta.context)}]` : '';
    return `${timestamp} [${level.toUpperCase()}] ${message}${context}`;
  })
);

// Create logger instance
const createLogger = () => {
  
  const transports: winston.transport[] = [
    new winston.transports.Console({
      stderrLevels: ['info', 'warn', 'error', 'debug'], // Send all logs to stderr
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
  ];

  // Add file transport in production
  if (process.env.NODE_ENV === 'production') {
    transports.push(
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        format: logFormat,
      })
    );
  }

  return winston.createLogger({
    level: 'debug',
    format: logFormat,
    transports,
    exitOnError: false,
  });
};

// Global logger instance
const logger = createLogger();

// Logger class with context support
export class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  private log(level: string, message: string, meta?: any) {
    logger.log(level, message, {
      ...meta,
      context: this.context,
    });
  }

  error(message: string, meta?: any) {
    this.log('error', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  debug(message: string, meta?: any) {
    this.log('debug', message, meta);
  }

  // Method to add context to existing logger
  withContext(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }
}

// Default logger instance
export const defaultLogger = new Logger();

// Utility functions for quick logging
export const logError = (message: string, error?: Error, context?: LogContext) => {
  const logger = context ? new Logger(context) : defaultLogger;
  logger.error(message, { error: error?.stack || error?.message });
};

export const logInfo = (message: string, context?: LogContext) => {
  const logger = context ? new Logger(context) : defaultLogger;
  logger.info(message);
};

export const logDebug = (message: string, context?: LogContext) => {
  const logger = context ? new Logger(context) : defaultLogger;
  logger.debug(message);
};

export const logWarn = (message: string, context?: LogContext) => {
  const logger = context ? new Logger(context) : defaultLogger;
  logger.warn(message);
};

// Request logger middleware
export const createRequestLogger = (requestId: string) => {
  return new Logger({ requestId });
}; 