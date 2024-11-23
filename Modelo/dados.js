import DadoDAO from "../Persistencia/dadoDAO.js"
export default class Dados{

    #id;
    #data;
    #pH;
    #turbidez;
    #temperatura;

    get id(){
        return this.#id;
    }

    set id(novoId){
        this.#id=novoId;
    } 

    get data(){
        return this.#data;
    }

    set data(novoData){
        this.#data=novoData;
    } 

    get pH(){
        return this.#pH;
    }

    set pH(novopH){
        this.#pH=novopH;
    } 

    get turbidez(){
        return this.#turbidez;
    }

    set turbidez(novoTurbidez){
        this.#turbidez=novoTurbidez;
    } 

    get temperatura(){
        return this.#temperatura;
    }

    set temperatura(novoTemperatura){
        this.#temperatura=novoTemperatura;
    } 


    constructor(id=0, data="", pH=0, turbidez=0, temperatura=0)
    {
        this.#id=id;
        this.#data=data;
        this.#pH=pH;
        this.#turbidez=turbidez;
        this.#temperatura=temperatura;
    }

    toJSON(){
        return{
            "id":this.#id,
            "data":this.#data,
            "pH":this.#pH,
            "turbidez":this.#turbidez,
            "temperatura":this.#temperatura
        }
    }

    async incluir(){
        const dadoDAO = new DadoDAO();
        await dadoDAO.incluir(this); 
    }

    async consultar(termo){
        const dadoDAO = new DadoDAO();
        return await dadoDAO.consultar(termo);
    }

    async excluir(){
        const dadoDAO = new DadoDAO();
        await dadoDAO.excluir(this);
    }

    async alterar(){
        const dadoDAO = new DadoDAO();
        await dadoDAO.alterar(this);
    }
}