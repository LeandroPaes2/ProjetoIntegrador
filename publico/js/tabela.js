document.addEventListener("DOMContentLoaded", exibirTabela);

async function exibirTabela() {
    const divTabela = document.getElementById('tabela');

    try {
        // Fazendo requisição para o backend
        const resposta = await fetch('http://localhost:4000/dados'); // Substitua pelo seu endpoint
        if (!resposta.ok) throw new Error("Erro ao buscar dados: " + resposta.status);

        const dados = await resposta.json();

        // Limpa o conteúdo existente
        divTabela.innerHTML = '';

        // Verifica se há dados
        if (dados.length > 0) {
            // Cria a tabela
            const tabela = document.createElement('table');
            tabela.className = 'tabela';

            // Cabeçalho da tabela
            const cabecalho = document.createElement('thead');
            cabecalho.innerHTML = `
                <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>pH</th>
                    <th>Turbidez</th>
                    <th>Temperatura</th>
                </tr>`;
            tabela.appendChild(cabecalho);

            // Corpo da tabela
            const corpo = document.createElement('tbody');
            dados.forEach(dado => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${dado.id}</td>
                    <td>${new Date(dado.data).toLocaleDateString("pt-BR")}</td>
                    <td>${dado.pH}</td>
                    <td>${dado.turbidez}</td>
                    <td>${dado.temperatura}</td>
                `;
                corpo.appendChild(linha);
            });
            tabela.appendChild(corpo);

            // Adiciona a tabela ao div
            divTabela.appendChild(tabela);
        } else {
            divTabela.innerHTML = '<p>Não há dados para exibir.</p>';
        }
    } catch (erro) {
        console.error("Erro:", erro.message);
        divTabela.innerHTML = '<p>Erro ao carregar os dados.</p>';
    }
}
