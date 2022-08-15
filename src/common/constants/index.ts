import * as dotenv from 'dotenv';
dotenv.config();

export const SEQUELIZE = 'SEQUELIZE';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';

export const BASE_URL = process.env.BASE_URL

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const CONTACT_REPOSITORY = 'CONTACT_REPOSITORY';