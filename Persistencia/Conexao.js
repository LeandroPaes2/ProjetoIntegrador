import mysql from 'mysql2/promise';
import 'dotenv/config';

export default async function conectar() {
    if (global.poolConexoes) {
        return await global.poolConexoes.getConnection();
    } else {
        global.poolConexoes = await mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectTimeout: 60000,
            waitForConnections: true,
            queueLimit: 20
        });
        return await global.poolConexoes.getConnection();
    }
}
