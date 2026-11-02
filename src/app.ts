import e from 'express';
import createHttpError from 'http-errors';
import 'reflect-metadata';
import { errorHandler } from './middlewares/globalErrorHandler.js';
import authRouter from './routes/auth.js';

const app = e();
app.use(e.json());

app.get('/', (req, res, next) => {
    const err = createHttpError(401);
    next(err);
});

app.use('/auth', authRouter);

app.use(errorHandler);

export { app };
