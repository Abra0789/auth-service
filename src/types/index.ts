import type { Request } from 'express';

interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface RegisterUserRequest extends Request {
    body: UserData;
}

export type { RegisterUserRequest, UserData };
