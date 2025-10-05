import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const isProduction = process.env.NODE_ENV === 'production';

const config = {
    database: isProduction ? process.env.PROD_DB_NAME : process.env.DEV_DB_NAME,
    host: isProduction ? process.env.PROD_DB_HOST : process.env.DEV_DB_HOST,
    port: isProduction ? process.env.PROD_DB_PORT || 27017 : process.env.DEV_DB_PORT || 27017,
    user: isProduction ? process.env.PROD_DB_USER : process.env.DEV_DB_USER,
    password: isProduction ? process.env.PROD_DB_PASS : process.env.DEV_DB_PASS,
    authSource: 'admin', // MongoDB auth database
};

console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Database config:', config);

export default config;
