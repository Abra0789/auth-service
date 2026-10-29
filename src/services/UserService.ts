import bcrypt from 'bcryptjs';
import type { Repository } from 'typeorm';
import { User } from '../entities/User.js';
import type { UserData } from '../types/index.js';
import { saltRound } from '../constants/index.js';
import createHttpError from 'http-errors';

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            const err = createHttpError(400, 'Email already exists');
            throw err;
        }
        const salt = await bcrypt.genSalt(saltRound);
        const hashPassword = await bcrypt.hash(password, salt);
        await this.userRepository.save({
            firstName,
            lastName,
            email,
            password: hashPassword,
        });
    }
}
