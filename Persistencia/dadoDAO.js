import Dados from "../Modelo/dados.js";
import conectar from "./Conexao.js"
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
        if (dado instanceof Dados) {
            const conexao = await conectar();
            const sql = `INSERT INTO dados(data,ph,turbidez,temperatura)
                values(str_to_date(?,'%d/%m/%Y'),?,?,?)
            `;
            let parametros = [
                dado.data,
                dado.pH,
                dado.turbidez,
                dado.temperatura
            ]; 
            const resultado = await conexao.execute(sql, parametros);
            dado.id = resultado[0].insertId;
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
            sql = "SELECT * FROM dados WHERE data LIKE ? ORDER BY data";
            parametros.push("%"+termo+"%");
        }
        else{
            sql = "SELECT * FROM dados WHERE id = ? ORDER BY dados";
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