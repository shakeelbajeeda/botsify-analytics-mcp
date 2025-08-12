import {z} from 'zod';

// Logging types
export interface LogContext {
    requestId?: string;
    userId?: string;
    tool?: string;

    [key: string]: any;
}

export const UpdateBotSettingsSchema = z.object({
    key: z.string().min(1),
    value: z.string().min(1),
});

// Error types
export class MCPError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public context?: Record<string, any>
    ) {
        super(message);
        this.name = 'MCPError';
    }
}

export class ValidationError extends MCPError {
    constructor(message: string, context?: Record<string, any>) {
        super(message, 'VALIDATION_ERROR', 400, context);
        this.name = 'ValidationError';
    }
}

export class ApiError extends MCPError {
    constructor(message: string, statusCode: number = 500, context?: Record<string, any>) {
        super(message, 'API_ERROR', statusCode, context);
        this.name = 'ApiError';
    }
} 