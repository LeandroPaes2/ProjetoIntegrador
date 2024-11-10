import conectar from './Conexao.js';

async function testarConexao() {
    try {
        const conexao = await conectar();
        console.log("Conexão bem-sucedida!");
        await conexao.release();
    } catch (e) {
        console.log("Erro na conexão: " + e.message);
    }
}

testarConexao();
