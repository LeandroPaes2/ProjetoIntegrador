import express from 'express';
import rotaProduto from './Rotas/rotaProdutos.js';
import rotaDado from './Rotas/rotaDados.js';
import cors from 'cors';


const host = "0.0.0.0"; 
const porta = 3000;

const app = express(); 

app.use(express.json());

app.use(cors({
                "origin":"*",
                "Access-Control-Allow-Origin":'*'
        }));


app.use(express.static('./publico'));


app.use('/produtos', rotaProduto);
app.use('/dados', rotaDado);


app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://${host}:${porta}`)
});