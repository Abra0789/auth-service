import type { NextFunction, Response } from 'express';
import createHttpError from 'http-errors';
import { UserService } from '../services/UserService.js';
import type { RegisterUserRequest } from '../types/index.js';
import { registerSchema } from '../validators/register.js';

export class AuthController {
    constructor(private userService: UserService) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const validationResult = registerSchema.safeParse(req.body);

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }));

            return next(
                createHttpError(400, 'Validation failed', {
                    errors,
                }),
            );
        }

        const { firstName, lastName, email, password } = validationResult.data;

        await this.userService.create({
            firstName,
            lastName,
            email,
            password,
        });

        return res.status(201).json({
            message: 'User registered successfully.',
        });
    }
}
