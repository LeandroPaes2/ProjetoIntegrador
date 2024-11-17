

async consultarRelatorio(requisicao, resposta) {
    resposta.type("text/html");

    if (requisicao.method === "GET") {
        try {
            const dados = await Dados.consultar();
            let html = "<html><head><title>Relatório de Dados</title></head><body>";
            html += "<h1>Relatório de Dados</h1>";
            html += "<table border='1'><tr><th>ID</th><th>Data</th><th>pH</th><th>Turbidez</th><th>Temperatura</th></tr>";

            dados.forEach((dado) => {
                html += `<tr>
                    <td>${dado.id}</td>
                    <td>${dado.data}</td>
                    <td>${dado.pH}</td>
                    <td>${dado.turbidez}</td>
                    <td>${dado.temperatura}</td>
                </tr>`;
            });

            html += "</table></body></html>";
            resposta.status(200).send(html);
        } catch (erro) {
            this.responderErro(resposta, 500, "Erro ao consultar dados: " + erro.message);
        }
    } else {
        this.responderErro(resposta, 400, "Requisição inválida! Consulte a documentação da API.");
    }
}
