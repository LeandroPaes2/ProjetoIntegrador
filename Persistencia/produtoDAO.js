//DAO - Data Access Object
import Produto from "../Modelo/produto.js";
import conectar from "./Conexao.js";
export default class ProdutoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try 
        {
            const conexao = await conectar(); //retorna uma conexão
            const sql = `
            CREATE TABLE IF NOT EXISTS produto(
                codigo INT NOT NULL AUTO_INCREMENT,
                descricao VARCHAR(200) NOT NULL,
                precoCusto DECIMAL(10,2) NOT NULL,
                precoVenda DECIMAL(10,2) NOT NULL,
                qtdEstoque INT NOT NULL DEFAULT 0,
                urlImagem VARCHAR(250),
                dataValidade DATE NOT NULL,
                CONSTRAINT pk_produto PRIMARY KEY(codigo)
            )
        `;
            await conexao.execute(sql);
            await conexao.release();
        }
        catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async incluir(produto) {
        if (produto instanceof Produto) {
            const conexao = await conectar();
            const sql = `INSERT INTO produto(descricao,precoCusto,precoVenda,qtdEstoque,urlImagem,dataValidade)
                values(?,?,?,?,?,str_to_date(?,'%d/%m/%Y'))
            `;
            let parametros = [
                produto.descricao,
                produto.precoCusto,
                produto.precoVenda,
                produto.qtdEstoque,
                produto.urlImagem,
                produto.dataValidade
            ]; //dados do produto
            const resultado = await conexao.execute(sql, parametros);
            produto.codigo = resultado[0].insertId;
            await conexao.release(); //libera a conexão
        }
    }
    async alterar(produto) {
        if (produto instanceof Produto) {
            const conexao = await conectar();
            const sql = `UPDATE produto SET descricao=?,precoCusto=?,precoVenda=?,qtdEstoque=?,urlImagem=?,dataValidade=str_to_date(?,'%d/%m/%Y')
                WHERE codigo = ?
            `;
            let parametros = [
                produto.descricao,
                produto.precoCusto,
                produto.precoVenda,
                produto.qtdEstoque,
                produto.urlImagem,
                produto.dataValidade,
                produto.codigo
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
    async consultar(termo) {
        //resuperar as linhas da tabela produto e transformá-las de volta em produtos
        const conexao = await conectar();
        let sql = "";
        let parametros = [];
        if (isNaN(parseInt(termo))) {
            sql = "SELECT * FROM produto WHERE descricao LIKE ?";
            parametros = ['%' + termo + '%'];
        }
        else {
            sql = "SELECT * FROM produto WHERE codigo = ?"
            parametros = [termo];
        }
        const [linhas, campos] = await conexao.execute(sql, parametros);
        let listaProdutos = [];
        for (const linha of linhas) {
            const produto = new Produto(
                linha['codigo'],
                linha['descricao'],
                linha['precoCusto'],
                linha['precoVenda'],
                linha['qtdEstoque'],
                linha['urlImagem'],
                linha['dataValidade']
            );
            listaProdutos.push(produto);
        }
        await conexao.release();
        return listaProdutos;
    }
    async excluir(produto) {
        if (produto instanceof Produto) {
            const conexao = await conectar();
            const sql = `DELETE FROM produto WHERE codigo = ?`;
            let parametros = [
                produto.codigo
            ]; //dados do produto
            await conexao.execute(sql, parametros);
            await conexao.release(); //libera a conexão
        }
    }
}