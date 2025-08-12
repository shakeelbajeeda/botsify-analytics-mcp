import { Request, Response, NextFunction } from 'express';
import { MCPError, ValidationError, ApiError } from '../types/index.js';
import { Logger } from '../utils/logger.js';

export class ErrorHandler {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({ service: 'ErrorHandler' });
  }

  /**
   * Main error handling middleware
   */
  handleError = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    const requestId = req.headers['x-request-id'] as string;
    const logger = this.logger.withContext({ requestId });

    // Log the error
    logger.error('Request error', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });

    // Handle different types of errors
    if (error instanceof ValidationError) {
      this.handleValidationError(error, res);
    } else if (error instanceof ApiError) {
      this.handleApiError(error, res);
    } else if (error instanceof MCPError) {
      this.handleMCPError(error, res);
    } else {
      this.handleGenericError(error, res);
    }
  };

  /**
   * Handle validation errors
   */
  private handleValidationError(error: ValidationError, res: Response): void {
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: error.message,
      details: error.context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle API errors
   */
  private handleApiError(error: ApiError, res: Response): void {
    res.status(error.statusCode).json({
      success: false,
      error: 'API Error',
      message: error.message,
      details: error.context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle MCP errors
   */
  private handleMCPError(error: MCPError, res: Response): void {
    res.status(error.statusCode).json({
      success: false,
      error: 'MCP Error',
      message: error.message,
      code: error.code,
      details: error.context,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle generic errors
   */
  private handleGenericError(error: Error, res: Response): void {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Handle 404 errors
   */
  handleNotFound = (req: Request, res: Response): void => {
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Route ${req.method} ${req.url} not found`,
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * Handle async route errors
   */
  wrapAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
}

export const errorHandler = new ErrorHandler(); 