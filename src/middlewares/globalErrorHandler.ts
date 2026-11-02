import type { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = createHttpError.isHttpError(err) ? err.statusCode : 500;

    const errors = (
        err as Error & {
            errors?: { field: string; message: string }[];
        }
    ).errors;

    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal server error.',
        ...(errors ? { errors } : {}),
    });
};
