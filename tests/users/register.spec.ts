import bcrypt from 'bcryptjs';
import request from 'supertest';
import type { DataSource } from 'typeorm';
import { app } from '../../src/app.js';
import { Roles } from '../../src/constants/index.js';
import { AppDataSource } from '../../src/data-source.js';
import { User } from '../../src/entities/User.js';
import { validationErrorResponseSchema } from '../../src/validators/register.js';

const validUser = {
    firstName: 'Rayan',
    lastName: 'Hossain',
    email: 'rayan.cit.bd@gmail.com',
    password: 'Pa$$w0rd',
};

type RegisterPayload = typeof validUser;

const registerUser = (payload: Partial<RegisterPayload> = validUser) =>
    request(app).post('/auth/register').send(payload);

describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        if (connection.isInitialized) {
            await connection.destroy();
        }
    });

    describe('Given valid registration data', () => {
        it('should return 201 Created', async () => {
            const response = await registerUser();

            expect(response.statusCode).toBe(201);
        });

        it('should return a JSON response', async () => {
            const response = await registerUser();

            expect(response.headers['content-type']).toContain(
                'application/json',
            );
        });

        it('should persist the user in the database', async () => {
            await registerUser();

            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOneBy({
                email: validUser.email,
            });

            expect(user).not.toBeNull();
            expect(user?.firstName).toBe(validUser.firstName);
            expect(user?.lastName).toBe(validUser.lastName);
            expect(user?.email).toBe(validUser.email);
        });

        it('should assign the customer role by default', async () => {
            await registerUser();

            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOneBy({
                email: validUser.email,
            });

            expect(user?.role).toBe(Roles.CUSTOMER);
        });

        it('should store a hashed password, not plaintext', async () => {
            await registerUser();

            const userRepository = connection.getRepository(User);
            const user = await userRepository.findOneBy({
                email: validUser.email,
            });

            expect(user).not.toBeNull();
            expect(user!.password).not.toBe(validUser.password);

            await expect(
                bcrypt.compare(validUser.password, user!.password),
            ).resolves.toBe(true);
        });
    });

    describe('Given an email that already exists', () => {
        it('should return 400 and not create a duplicate user', async () => {
            await registerUser();

            const response = await registerUser();

            const userRepository = connection.getRepository(User);

            expect(response.statusCode).toBe(400);
            await expect(userRepository.count()).resolves.toBe(1);
        });
    });

    describe('Given missing or empty fields', () => {
        it.each([
            ['firstName', { ...validUser, firstName: '' }],
            ['lastName', { ...validUser, lastName: '' }],
            ['email', { ...validUser, email: '' }],
            ['password', { ...validUser, password: '' }],
        ] as const)(
            'should return a validation error for %s',
            async (field, payload) => {
                const response = await registerUser(payload);

                expect(response.statusCode).toBe(400);

                const body = validationErrorResponseSchema.parse(response.body);

                expect(body.message).toBe('Validation failed');
                expect(body.errors).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({ field }),
                    ]),
                );
            },
        );
    });

    describe('Given invalid field values', () => {
        it.each([
            {
                field: 'email',
                value: 'invalid-email',
                expectedMessage: 'Please provide a valid email address.',
            },
            {
                field: 'password',
                value: 'short',
                expectedMessage: 'Password must be at least 8 characters long.',
            },
        ] as const)(
            'should return the correct error for invalid $field',
            async ({ field, value, expectedMessage }) => {
                const payload = {
                    ...validUser,
                    [field]: value,
                };

                const response = await registerUser(payload);

                expect(response.statusCode).toBe(400);

                const body = validationErrorResponseSchema.parse(response.body);

                expect(body.errors).toEqual(
                    expect.arrayContaining([
                        {
                            field,
                            message: expectedMessage,
                        },
                    ]),
                );
            },
        );
    });
});
