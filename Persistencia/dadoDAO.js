import Dados from "../Modelo/dados.js";
import conectar from "./Conexao.js"
import moment from "moment";

export default class DadoDAO {
    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar();
            const sql = `
                CREATE TABLE IF NOT EXISTS dados(
                    id INT NOT NULL AUTO_INCREMENT,
                    data DATE NOT NULL,
                    pH DECIMAL(10,2) NOT NULL,
                    turbidez DECIMAL(10,2) NOT NULL,
                    temperatura INT NOT NULL,
                    CONSTRAINT pk_dados PRIMARY KEY(id)
                )
            `;
            await conexao.execute(sql);
            console.log("Tabela `dados` criada ou já existente.");
            await conexao.release();
        } catch (e) {
            console.log("Erro ao criar tabela `dados`: " + e.message);
        }
    }
    

    async incluir(dado) {
        const conexao = await conectar();
        try {
            if (dado instanceof Dados) {
                // Usa a data atual se não for fornecida
                const dataFormatada = dado.data 
                    ? moment(dado.data, "DD-MM-YYYY").format("YYYY-MM-DD") 
                    : moment().format("YYYY-MM-DD");
    
                const sql = `INSERT INTO dados(data, ph, turbidez, temperatura)
                    VALUES (STR_TO_DATE(?, '%Y-%m-%d'), ?, ?, ?)
                `;
                const parametros = [
                    dataFormatada || null, // Garante uma data válida
                    dado.pH,
                    dado.turbidez,
                    dado.temperatura
                ];
                const [resultado] = await conexao.execute(sql, parametros);
                dado.id = resultado.insertId;
            }
        } catch (erro) {
            console.error("Erro ao incluir dado:", erro.message);
            throw erro;
        } finally {
            await conexao.release();
        }
    }
    
    
    async alterar(dado) {
        if (dado instanceof Dados) {
            const conexao = await conectar();
            const sql = `UPDATE dados SET data=str_to_date(?,'%d/%m/%Y'),pH=?,turbidez=?,temperatura=?
                WHERE id = ?
            `;
            let parametros = [
                dado.data,
                dado.pH,
                dado.turbidez,
                dado.temperatura,
                dado.id
            ];
            await conexao.execute(sql, parametros);
            await conexao.release(); 
        }
    }
    async consultar(termo){
        let sql = "";
        let parametros = [];
        if (isNaN(parseInt(termo))) {
            sql = "SELECT * FROM dados WHERE id LIKE ? ORDER BY id";
            parametros.push("%"+termo+"%");
        }
        else{
            sql = "SELECT * FROM dados WHERE id = ? ORDER BY id";
            parametros.push(termo);
        }
        const conexao = await conectar();
        
        const [registros, campos] = await conexao.query(sql, parametros);
        await conexao.release();
        let listaDados=[];
        for (const registro of registros){
            const dado = new Dados(
                                    registro['id'],
                                    registro['data'],
                                    registro['pH'],
                                    registro['turbidez'],
                                    registro['temperatura']
            );
            listaDados.push(dado);
        }
        
        return listaDados;

    }
    async excluir(dado) {
        if (dado instanceof Dados) {
            const conexao = await conectar();
            const sql = `DELETE FROM dados WHERE id = ?`;
            let parametros = [
                dado.id
            ]; 
            await conexao.execute(sql, parametros);
            await conexao.release(); 
        }
    }
}