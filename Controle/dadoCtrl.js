import Dados from "../Modelo/dados.js";

export default class DadoCtrl {
    
    async gravar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === 'POST' && requisicao.is("application/json")) {
            const data = requisicao.body.data;
            const pH = requisicao.body.pH;
            const turbidez = requisicao.body.turbidez;
            const temperatura = requisicao.body.temperatura;

            if (data && pH >= 0 && turbidez >= 0 && temperatura >= 0) {
                const dado = new Dados(id, data, pH, turbidez, temperatura);

                try {
                    await dado.incluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Dado adicionado com sucesso!",
                        "id": dado.id
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível incluir o dado: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async editar(requisicao, resposta) {
        resposta.type("application/json");

        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is("application/json")) {
            const id = requisicao.params.id;
            const data = requisicao.body.data;
            const pH = requisicao.body.pH;
            const turbidez = requisicao.body.turbidez;
            const temperatura = requisicao.body.temperatura;

            if (id && data && pH >= 0 && turbidez >= 0 && temperatura >= 0) {
                const dado = new Dados(id, data, pH, turbidez, temperatura);

                try {
                    await dado.alterar();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Dado alterado com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível alterar o dado: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe corretamente todos os dados conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async excluir(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === 'DELETE') {
            const id = requisicao.params.id;

            if (id) {
                const dado = new Dados(id);

                try {
                    await dado.excluir();
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Dado excluído com sucesso!"
                    });
                } catch (erro) {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Não foi possível excluir o dado: " + erro.message
                    });
                }
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Informe um ID válido conforme documentação da API."
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    async consultar(requisicao, resposta) {
        resposta.type("application/json");

        if (requisicao.method === "GET") {
            let id = requisicao.params.id;
            if(isNaN(id)){
                id = "";
            }

            const dado = new Dados();

            dado.consultar(id)
                .then((listaDados) => {
                    resposta.status(200).json(listaDados
                    );
                })
                .catch((erro) => {
                    resposta.status(500).json(
                        {
                            "status": false,
                            "mensagem": "Erro ao consultar dados: " + erro.message
                        }
                    );
                });

        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Requisição inválida! Consulte a documentação da API."
            });
        }
    }

    
}
