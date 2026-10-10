import { config } from 'dotenv';
import path from 'node:path';
import { requiredEnv } from '../utils/index.js';

config({
    path: path.join(import.meta.dirname, `../../.env.${process.env.NODE_ENV}`),
    override: true,
});

export const Config = Object.freeze({
    PORT: requiredEnv('PORT'),
    NODE_ENV: requiredEnv('NODE_ENV'),

    DB_HOST: requiredEnv('DB_HOST'),
    DB_PORT: requiredEnv('DB_PORT'),
    DB_USERNAME: requiredEnv('DB_USERNAME'),
    DB_PASSWORD: requiredEnv('DB_PASSWORD'),
    DB_NAME: requiredEnv('DB_NAME'),
});
