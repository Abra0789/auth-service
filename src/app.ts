import e, { type NextFunction, type Request, type Response } from 'express';
import type { HttpError } from 'http-errors';
import createHttpError from 'http-errors';
import 'reflect-metadata';
import { logger } from './config/logger.js';
import authRouter from './routes/auth.js';

const app = e();
app.use(e.json());

app.get('/', (req, res, next) => {
    const err = createHttpError(401);
    next(err);
});

app.use('/auth', authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});

export { app };
