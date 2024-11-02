import mysql from 'mysql2/promise';


export default async function conectar(){
    
    if (global.poolConexoes){
        return await poolConexoes.getConnection();
    }
    else{
        global.poolConexoes = await mysql.createPool({
            "host": process.env.DB_HOST, 
            "port": process.env.PORTA_BANCO_DE_DADOS,
            "database": process.env.DB_NAME,
            "password": process.env.DB_PASSWORD,
            "user": process.env.DB_USER,
            "connectTimeout":60000,
            "waitForConnections":true,
            "queueLimit":20
        });
        return await global.poolConexoes.getConnection();
    }
}