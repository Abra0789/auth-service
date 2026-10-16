import request from 'supertest';
import type { DataSource } from 'typeorm';
import { app } from '../../src/app.js';
import { Roles } from '../../src/constants/index.js';
import { AppDataSource } from '../../src/data-source.js';
import { User } from '../../src/entities/User.js';

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
        await connection.destroy();
    });
    describe('Given all fields', () => {
        it('should return the 201 status code', async () => {
            //AAA
            // Arrange
            const userData = {
                firstName: 'Abrar',
                lastName: ' Galib',
                email: 'galibabrar06@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return a valid JSON', async () => {
            //AAA
            // Arrange
            const userData = {
                firstName: 'Abrar',
                lastName: ' Galib',
                email: 'galibabrar06@gmail.com',
                password: 'secret',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
        });
        it('should persist the user data in the database', async () => {
            //AAA
            // Arrange
            const userData = {
                firstName: 'Abrar',
                lastName: ' Galib',
                email: 'galibabrar06@gmail.com',
                password: 'secret',
            };
            //Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0]?.firstName).toBe(userData.firstName);
            expect(users[0]?.lastName).toBe(userData.lastName);
            expect(users[0]?.email).toBe(userData.email);
            expect(users[0]?.password).toBe(userData.password);
        });

        it.todo('should return an id of the created user');

        it('should assign a customer role ', async () => {
            //AAA
            // Arrange
            const userData = {
                firstName: 'Abrar',
                lastName: ' Galib',
                email: 'galibabrar06@gmail.com',
                password: 'secret',
            };
            //Act
            await request(app).post('/auth/register').send(userData);
            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0]?.role).toBe(Roles.CUSTOMER);
        });
    });
    describe('Fields are missing', () => {});
});
