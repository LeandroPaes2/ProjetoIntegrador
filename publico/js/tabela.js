document.addEventListener("DOMContentLoaded", exibirTabela);

async function exibirTabela() {
    const divTabela = document.getElementById('tabela');

    try {
        // Fazendo requisição para o backend
        const resposta = await fetch('https://projeto-integrador-amber.vercel.app/dados'); // Substitua pelo seu endpoint
        if (!resposta.ok) throw new Error("Erro ao buscar dados: " + resposta.status);

        const dados = await resposta.json();

        // Limpa o conteúdo existente
        divTabela.innerHTML = '';

        // Verifica se há dados
        if (dados.length > 0) {
            // Cria a tabela de dados
            const tabela = document.createElement('table');
            tabela.className = 'tabela';

            // Cabeçalho da tabela de dados
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

            // Corpo da tabela de dados
            const corpo = document.createElement('tbody');
            dados.forEach((dado, index) => {
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

            // Adiciona a tabela de dados ao div
            divTabela.appendChild(tabela);

            // Calcular estatísticas finais
            const estatisticas = calcularEstatisticas(dados);

            // Exibe as estatísticas no final da tabela
            const divEstatisticas = document.createElement('div');
            divEstatisticas.className = 'estatisticas';

            // Criação de uma nova tabela para as estatísticas finais
            const tabelaEstatisticas = document.createElement('table');
            tabelaEstatisticas.className = 'tabela estatisticas-finais';

            // Cabeçalho da tabela de estatísticas
            const cabecalhoEstatisticas = document.createElement('thead');
            cabecalhoEstatisticas.innerHTML = `
                <tr>
                    <th>Estatística</th>
                    <th>Valor</th>
                </tr>`;
            tabelaEstatisticas.appendChild(cabecalhoEstatisticas);

            // Corpo da tabela de estatísticas finais
            const corpoEstatisticas = document.createElement('tbody');
            corpoEstatisticas.innerHTML = `
                <tr>
                    <td>Diferença de Temperatura (ΔT)</td>
                    <td>${estatisticas.deltaT}</td>
                </tr>
                <tr>
                    <td>Fator de Correção da Temperatura</td>
                    <td>${estatisticas.fatorCorrecao}</td>
                </tr>
                <tr>
                    <td>Desvio Padrão da Temperatura</td>
                    <td>${estatisticas.desvioPadraoTemperatura}</td>
                </tr>
                <tr>
                    <td>Temperatura Máxima</td>
                    <td>${estatisticas.temperaturaMaxima}</td>
                </tr>
                <tr>
                    <td>Temperatura Mínima</td>
                    <td>${estatisticas.temperaturaMinima}</td>
                </tr>
                <tr>
                    <td>Percentual de Temperaturas Acima de 30ºC</td>
                    <td>${estatisticas.percentualAcima30}%</td>
                </tr>
            `;
            tabelaEstatisticas.appendChild(corpoEstatisticas);

            // Adiciona a tabela de estatísticas ao div
            divEstatisticas.appendChild(tabelaEstatisticas);
            divTabela.appendChild(divEstatisticas);
        } else {
            divTabela.innerHTML = '<p>Não há dados para exibir.</p>';
        }
    } catch (erro) {
        console.error("Erro:", erro.message);
        divTabela.innerHTML = '<p>Erro ao carregar os dados.</p>';
    }
}

// Função para calcular as estatísticas finais
function calcularEstatisticas(dados) {
    let somaTemperatura = 0;
    let deltaTTotal = 0;
    let countDeltaT = 0;
    let countAcima30 = 0;
    let count = dados.length;
    let temperaturas = [];
    
    dados.forEach((dado, index) => {
        // Garantir que a temperatura é numérica
        if (isNaN(dado.temperatura)) {
            console.warn(`Dado inválido: ID ${dado.id} possui temperatura inválida.`);
            return; // Ignorar dados inválidos
        }

        somaTemperatura += dado.temperatura;
        temperaturas.push(dado.temperatura);

        if (dado.temperatura > 30) {
            countAcima30++;
        }

        if (index > 0) {
            deltaTTotal += Math.abs(dado.temperatura - dados[index - 1].temperatura);
            countDeltaT++;
        }
    });

    // Se count for 0, retorna N/A para outras métricas
    if (count === 0) {
        return {
            deltaT: 'N/A',
            fatorCorrecao: 'N/A',
            desvioPadraoTemperatura: 'N/A',
            temperaturaMaxima: 'N/A',
            temperaturaMinima: 'N/A',
            percentualAcima30: 'N/A'
        };
    }

    // Cálculo do desvio padrão da temperatura
    const temperaturaMedia = somaTemperatura / count;
    const somaQuadrados = temperaturas.reduce((total, temp) => total + Math.pow(temp - temperaturaMedia, 2), 0);
    const desvioPadraoTemperatura = Math.sqrt(somaQuadrados / count).toFixed(2);

    // Calculando as estatísticas
    const deltaT = countDeltaT > 0 ? (deltaTTotal / countDeltaT).toFixed(2) : 'N/A';
    const fatorCorrecao = (somaTemperatura > 25 ? 1.05 : (somaTemperatura < 15 ? 0.95 : 1)).toFixed(2);
    const temperaturaMaxima = Math.max(...temperaturas);
    const temperaturaMinima = Math.min(...temperaturas);
    const percentualAcima30 = ((countAcima30 / count) * 100).toFixed(2);

    return {
        deltaT,
        fatorCorrecao,
        desvioPadraoTemperatura,
        temperaturaMaxima,
        temperaturaMinima,
        percentualAcima30
    };
}
