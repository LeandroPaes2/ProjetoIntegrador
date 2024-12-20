import express from 'express';
import rotaDado from './Rotas/rotaDados.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const host = '0.0.0.0'; 
const porta = 4000;


const app = express(); 

app.use(express.json());

app.use(cors({
    origin: '*'  // Permite acesso de qualquer origem
}));



app.use(express.static('./publico'));

app.use('/dados', rotaDado);

/*
app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`)
});*/


export default app;
