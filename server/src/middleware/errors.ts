import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            code: err.code,
        }),
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    res.status(404).json({
        success: false,
        error: `Not Found - ${req.method} ${req.originalUrl}`,
    });
};

/**
 * Async handler wrapper to catch errors in async routes
 */
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Create custom error with status code
 */
export const createError = (message: string, statusCode: number): ApiError => {
    const error: ApiError = new Error(message);
    error.statusCode = statusCode;
    return error;
};
