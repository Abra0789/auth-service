import type { NextFunction, Response } from 'express';
import { UserService } from '../services/UserService.js';
import type { RegisterUserRequest } from '../types/index.js';
import { registerSchema } from '../validators/register.js';
import createHttpError from 'http-errors';

export class AuthController {
    constructor(private userService: UserService) {
        this.userService = userService;
    }
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        // the parsed result is validated and type safe!
        const validationResult = registerSchema.safeParse(req.body);
        if (!validationResult.success) {
            const err = createHttpError(400, 'All fields are required');
            next(err);
        }

        const { firstName, lastName, email, password } = req.body;
        await this.userService.create({ firstName, lastName, email, password });
        res.status(201).json();
    }
}
