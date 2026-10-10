import type { Response } from 'express';
import { UserService } from '../services/UserService.js';
import type { RegisterUserRequest } from '../types/index.js';

export class AuthController {
    constructor(private userService: UserService) {
        this.userService = userService;
    }
    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        await this.userService.create({ firstName, lastName, email, password });
        res.status(201).json();
    }
}
