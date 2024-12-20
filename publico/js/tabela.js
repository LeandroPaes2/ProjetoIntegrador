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
                    <th>Cal Hidratada (g/L)</th>
                    <th>Sulfato de Alumínio (mg/L)</th>
                    <th>Ácido Clorídrico (mL/L)</th>
                </tr>`;
            tabela.appendChild(cabecalho);

            // Corpo da tabela de dados
            const corpo = document.createElement('tbody');
            dados.forEach((dado) => {
                // Calcular Cal Hidratada (Hidróxido de Cálcio) para aumentar pH
                let calHidratada = 0;
                if (dado.pH < 7) {
                    calHidratada = (7 - dado.pH) * 1000; // 1g de cal para cada 1L de água para aumentar 1 unidade de pH
                }

                // Calcular Sulfato de Alumínio (30mg/L por turbidez de NTU)
                // Defina o valor de NTU
                let sulfatoAluminio = 0;
                if (dado.turbidez > 0) {
                    sulfatoAluminio = (dado.turbidez / 100) * 30000; // 30 mg/L por 'ntu' NTU
                }

                // Calcular Ácido Clorídrico para reduzir pH
                let acidoCloridrico = 0;
                if (dado.pH > 7) {
                    acidoCloridrico = (dado.pH - 7) * 1000; // 10mL/L de ácido para reduzir 1 unidade de pH
                }


                // Criar a linha da tabela com os valores calculados
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${dado.id}</td>
                    <td>${new Date(dado.data).toLocaleDateString("pt-BR")}</td>
                    <td>${dado.pH}</td>
                    <td>${dado.turbidez}</td>
                    <td>${dado.temperatura}</td>
                    <td>${calHidratada.toFixed(2)}</td> <!-- Cal Hidratada -->
                    <td>${sulfatoAluminio.toFixed(2)}</td> <!-- Sulfato de Alumínio -->
                    <td>${acidoCloridrico.toFixed(2)}</td> <!-- Ácido Clorídrico -->
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
                <tr>
                    <td>Cal Hidratada (g/L)</td>
                    <td>${estatisticas.calHidratada}</td>
                </tr>
                <tr>
                    <td>Sulfato de Alumínio (mg/L)</td>
                    <td>${estatisticas.sulfatoAluminio}</td>
                </tr>
                <tr>
                    <td>Ácido Clorídrico (mL/L)</td>
                    <td>${estatisticas.acidoCloridrico}</td>
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

// Função para calcular as estatísticas finais e os produtos necessários
function calcularEstatisticas(dados) {
    let somaTemperatura = 0;
    let deltaTTotal = 0;
    let countDeltaT = 0;
    let countAcima30 = 0;
    let count = dados.length;
    let temperaturas = [];
    let calHidratadaTotal = 0;
    let sulfatoAluminioTotal = 0;
    let acidoCloridricoTotal = 0;

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

        // Calcular Cal Hidratada (Hidróxido de Cálcio) para aumentar pH
        if (dado.pH < 7) {
            calHidratadaTotal += (7 - dado.pH) * 1000; // 1g de cal para cada 1L de água para aumentar 1 unidade de pH
        }

        // Calcular Sulfato de Alumínio (30mg/L por turbidez de 100 NTU)
        if (dado.turbidez > 0) {
            sulfatoAluminioTotal += (dado.turbidez / dado.turbidez) * 30000; // 30 mg/L por 100 NTU
        }

        // Calcular Ácido Clorídrico para reduzir pH
        if (dado.pH > 7) {
            acidoCloridricoTotal += (dado.pH - 7) * 1000; // 10mL/L de ácido pCara reduzir 1 unidade de pH
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
            percentualAcima30: 'N/A',
            calHidratada: 'N/A',
            sulfatoAluminio: 'N/A',
            acidoCloridrico: 'N/A'
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
        percentualAcima30,
        calHidratada: calHidratadaTotal.toFixed(2),
        sulfatoAluminio: sulfatoAluminioTotal.toFixed(2),
        acidoCloridrico: acidoCloridricoTotal.toFixed(2)
    };
}
