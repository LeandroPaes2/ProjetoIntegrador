import mysql from 'mysql2/promise';

export default async function conectar() {
    if (global.poolConexoes) {
        return await global.poolConexoes.getConnection();
    } else {
        global.poolConexoes = await mysql.createPool({
            "host": process.env.DB_HOST, // Exemplo: 'trabalhopi.sp1.br.saveincloud.net.br'
            "port": process.env.PORTA_BANCO_DE_DADOS, // Exemplo: 14455
            "database": process.env.DB_NAME, // Exemplo: 'dados'
            "user": process.env.DB_USER, // Exemplo: 'root'
            "password": process.env.DB_PASSWORD, // Exemplo: 'IDXyqy79979'
            "connectTimeout": 60000,
            "waitForConnections": true,
            "queueLimit": 20
        });
        return await global.poolConexoes.getConnection();
    }
}
