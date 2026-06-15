// =========================================================================
// 🎭 [SPRITE] IMAGENS INDIVIDUAIS DE CADA UMA DAS SEMENTES DO JOGO
// Altere o atributo 'sprite' de cada linha para apontar para a sua imagem na pasta sprites!
// Exemplo: sprite: "sprites/pinhao.png"
// =========================================================================
const tiposSementes = [
    { id: 0, nome: "Pinhão (Araucária)", valor: 1, liberado: true, custo: 0, estoque: 0, tempoCrescimento: 3000, sprite: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text y='40' font-size='40'>🌲</text></svg>" },
    { id: 1, nome: "Erva-Mate", valor: 6, liberado: false, custo: 350, estoque: 0, tempoCrescimento: 7000, sprite: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text y='40' font-size='40'>🌿</text></svg>" },
    { id: 2, nome: "Soja Pé-Vermelho", valor: 35, liberado: false, custo: 3000, estoque: 0, tempoCrescimento: 15000, sprite: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text y='40' font-size='40'>🌱</text></svg>" },
    { id: 3, nome: "Milho Safrinha", valor: 200, liberado: false, custo: 22000, estoque: 0, tempoCrescimento: 28000, sprite: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text y='40' font-size='40'>🌽</text></svg>" },
    { id: 4, nome: "Café do Norte Pioneiro", valor: 1200, liberado: false, custo: 110000, estoque: 0, tempoCrescimento: 50000, sprite: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50'><text y='40' font-size='40'>☕</text></svg>" }
];

let moedas = 0;
let sementeAtualIndex = 0;
let sementesPorClique = 1; 

let tratores = 0;      let precoTrator = 100;
let totalCampos = 1;   let precoCampo = 250;
let operarios = 0;     let precoOperario = 600;
let precoFertilizante = 40;

let dadosCampos = Array.from({ length: 9 }, (_, i) => ({
    id: i,
    status: i === 0 ? 'vazio' : 'bloqueado', 
    progresso: 0,
    tempoCrescimento: 3000,
    tipoPlantaIndex: 0 
}));

window.onload = () => {
    renderizarCampos();
    atualizarTela();
    
    setInterval(loopTrator, 1000);
    setInterval(loopCampos, 100);
    setInterval(loopOperarios, 2500); // Operários trabalham em ritmo firme de fazenda
};

document.getElementById('planta-central').addEventListener('click', () => {
    tiposSementes[sementeAtualIndex].estoque += sementesPorClique;
    atualizarTela();
});

function abrirCidade() { 
    const cidade = document.getElementById('tela-cidade');
    cidade.style.display = 'flex'; 
    setTimeout(() => { cidade.style.opacity = '1'; }, 10);
    atualizarTela(); 
}

function fecharCidade() { 
    const cidade = document.getElementById('tela-cidade');
    cidade.style.opacity = '0';
    setTimeout(() => { cidade.style.display = 'none'; }, 400);
}

function abrirInterior(idLoja) {
    if(idLoja === 'loja-vendas') {
        document.getElementById('loja-vendas').style.display = 'flex';
        document.getElementById('texto-vendedor').innerText = "Olá, paranaense! Clique em mim para ver suas opções comerciais.";
        document.getElementById('opcoes-vendedor').style.display = 'none';
        document.getElementById('ancora-vendas').style.display = 'none';
    } else {
        document.getElementById('loja-seeds').style.display = 'flex';
        renderizarInteriorSementesHorizontais();
    }
}

function fecharInterior(idLoja) {
    document.getElementById(idLoja).style.display = 'none';
}

function interagirVendedor() {
    document.getElementById('texto-vendedor').innerText = "O que você deseja fazer hoje na cooperativa?";
    const boxOpcoes = document.getElementById('opcoes-vendedor');
    boxOpcoes.innerHTML = `
        <button class="btn-resposta" onclick="escolhaVender()">Quero vender minhas sementes</button>
        <button class="btn-resposta btn-resposta-sair" onclick="escolhaSairDireto()">Só de passagem (Sair)</button>
    `;
    boxOpcoes.style.display = 'flex';
}

function escolhaVender() {
    document.getElementById('texto-vendedor').innerText = "Excelente! Aqui está a tabela de preços do dia. Clique nas sementes para vender.";
    document.getElementById('ancora-vendas').style.display = 'block';
    renderizarInteriorVendas();
}

function escolhaSairDireto() {
    document.getElementById('texto-vendedor').innerText = "Volte sempre! Boa lida no campo.";
    setTimeout(() => { 
        fecharInterior('loja-vendas'); 
    }, 400);
}

function loopTrator() {
    if (tratores > 0) {
        tiposSementes[sementeAtualIndex].estoque += (tratores * sementesPorClique);
        atualizarTela();
    }
}

function loopCampos() {
    dadosCampos.forEach(campo => {
        if (campo.status === 'vazio') {
            campo.status = 'crescendo';
            // DIFICULDADE: O tempo de crescimento agora depende diretamente de qual semente está ativa!
            campo.tempoCrescimento = tiposSementes[sementeAtualIndex].tempoCrescimento;
            campo.tipoPlantaIndex = sementeAtualIndex; 
            campo.progresso = 0;
        } else if (campo.status === 'crescendo') {
            campo.progresso += (100 / (campo.tempoCrescimento / 100));
            if (campo.progresso >= 100) {
                campo.progresso = 100;
                campo.status = 'pronto';
            }
            atualizarVisualCampo(campo.id);
        }
    });
}

function loopOperarios() {
    if (operarios > 0) {
        let colheuAlgo = false;
        dadosCampos.forEach(campo => {
            if (campo.status === 'pronto') {
                tiposSementes[campo.tipoPlantaIndex].estoque += (sementesPorClique * 4);
                campo.status = 'vazio';
                campo.progresso = 0;
                atualizarVisualCampo(campo.id);
                colheuAlgo = true;
            }
        });
        if(colheuAlgo) {
            tiposSementes.forEach(s => {
                if(s.estoque > 0) {
                    moedas += (s.estoque * s.valor);
                    s.estoque = 0;
                }
            });
            atualizarTela();
        }
    }
}

function clicarNoCampo(id) {
    let campo = dadosCampos[id];
    if (campo.status === 'pronto') {
        tiposSementes[campo.tipoPlantaIndex].estoque += (sementesPorClique * 4); 
        campo.status = 'vazio';
        campo.progresso = 0;
        atualizarVisualCampo(id);
        atualizarTela();
        if(document.getElementById('ancora-vendas').style.display === 'block') {
            renderizarInteriorVendas();
        }
    }
}

// DIFICULDADE MID-GAME: Multiplicadores de custo ligeiramente aumentados para melhor balanceamento
function comprarFertilizante() {
    if (moedas >= precoFertilizante) {
        moedas -= precoFertilizante;
        sementesPorClique += 1;
        precoFertilizante = Math.floor(precoFertilizante * 1.95);
        document.getElementById('lvl-fertilizante').innerText = sementesPorClique;
        atualizarTela();
    }
}

function comprarTrator() {
    if (moedas >= precoTrator) {
        moedas -= precoTrator;
        tratores += 1;
        precoTrator = Math.floor(precoTrator * 1.85);
        document.getElementById('qtd-trator').innerText = tratores;
        atualizarTela();
    }
}

function comprarCampo() {
    if (moedas >= precoCampo && totalCampos < 9) {
        moedas -= precoCampo;
        dadosCampos[totalCampos].status = 'vazio';
        totalCampos += 1;
        precoCampo = Math.floor(precoCampo * 3.0);
        document.getElementById('qtd-campos-comprados').innerText = totalCampos;
        renderizarCampos();
        atualizarTela();
    }
}

function comprarOperario() {
    if (moedas >= precoOperario) {
        moedas -= precoOperario;
        operarios += 1;
        precoOperario = Math.floor(precoOperario * 2.1);
        document.getElementById('qtd-operarios').innerText = operarios;
        atualizarTela();
    }
}

function renderizarInteriorVendas() {
    const container = document.getElementById('ancora-vendas');
    container.innerHTML = '';
    tiposSementes.forEach(s => {
        let ganhoPotencial = s.estoque * s.valor;
        let div = document.createElement('div');
        div.className = 'item-loja';
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${s.sprite}" style="width:35px; height:35px; object-fit:contain;">
                <div>
                    <strong>${s.nome}</strong><br>
                    <small>Estoque: ${s.estoque} | Valor: $${s.valor}</small>
                </div>
            </div>
            <button ${s.estoque === 0 ? 'disabled' : ''} onclick="venderEspecifico(${s.id})">Vender ($${ganhoPotencial})</button>
        `;
        container.appendChild(div);
    });
}

function venderEspecifico(id) {
    let s = tiposSementes[id];
    moedas += (s.estoque * s.valor);
    document.getElementById('texto-vendedor').innerText = `Fechado! Guardei as sacas de ${s.nome} e adicionei $${s.estoque * s.valor} na sua conta!`;
    s.estoque = 0;
    renderizarInteriorVendas();
    atualizarTela();
}

function renderizarInteriorSementesHorizontais() {
    const prateleira = document.getElementById('ancora-prateleira-1');
    prateleira.innerHTML = '';
    
    tiposSementes.forEach(s => {
        let txtBotao = "";
        let corBorda = "#ccc";
        if (!s.liberado) {
            txtBotao = `Comprar ($${s.custo})`;
        } else {
            txtBotao = sementeAtualIndex === s.id ? "Ativa" : "Ativar";
            if(sementeAtualIndex === s.id) corBorda = "#27ae60";
        }
        
        let card = document.createElement('div');
        card.className = 'semente-prateleira';
        card.style.borderColor = corBorda;
        card.innerHTML = `
            <img class="img-semente-prateleira" src="${s.sprite}">
            <strong style="font-size:0.9rem;">${s.nome}</strong>
            <small style="color: #666; margin-bottom: 5px; font-size:0.75rem;">Preço: $${s.valor}</small>
            <button id="btn-cidade-sem-${s.id}" style="font-size:0.75rem; padding:4px 8px;" ${sementeAtualIndex === s.id ? 'disabled style="background:#555;"' : ''} onclick="acaoSementeCidade(${s.id})">${txtBotao}</button>
        `;
        prateleira.appendChild(card);
    });
}

function acaoSementeCidade(id) {
    let s = tiposSementes[id];
    if (!s.liberado) {
        if (moedas >= s.custo) {
            moedas -= s.custo;
            s.liberado = true;
            sementeAtualIndex = id;
            document.getElementById('fala-atendente').innerText = `Semente de ${s.nome} liberada e ativa para plantio nas suas terras!`;
        }
    } else {
        sementeAtualIndex = id;
        document.getElementById('fala-atendente').innerText = `Perfeito, mudamos seu foco principal de cultivo para o(a) ${s.nome}.`;
    }
    renderizarInteriorSementesHorizontais();
    atualizarTela();
}

function atualizarTela() {
    document.getElementById('qtd-sementes-ativas').innerText = tiposSementes[sementeAtualIndex].estoque;
    document.getElementById('qtd-moedas').innerText = moedas;
    document.getElementById('cidade-moedas').innerText = moedas;
    document.getElementById('txt-semente-atual').innerText = tiposSementes[sementeAtualIndex].nome;
    
    document.getElementById('planta-central').src = tiposSementes[sementeAtualIndex].sprite;

    document.getElementById('btn-fertilizante').disabled = moedas < precoFertilizante;
    document.getElementById('btn-fertilizante').querySelector('span').innerText = precoFertilizante;
    document.getElementById('btn-trator').disabled = moedas < precoTrator;
    document.getElementById('btn-trator').querySelector('span').innerText = precoTrator;
    document.getElementById('btn-campo').disabled = (moedas < precoCampo) || (totalCampos >= 9);
    document.getElementById('btn-campo').querySelector('span').innerText = totalCampos >= 9 ? "MÁX" : precoCampo;
    document.getElementById('btn-operario').disabled = moedas < precoOperario;
    document.getElementById('btn-operario').querySelector('span').innerText = precoOperario;

    tiposSementes.forEach(s => {
        let btn = document.getElementById(`btn-cidade-sem-${s.id}`);
        if (btn && !s.liberado) {
            btn.disabled = moedas < s.custo;
        }
    });
}

// SOLUÇÃO DO BUG: Nova estrutura persistente que nunca destrói os elementos filhos da barra
function renderizarCampos() {
    const grid = document.getElementById('grid-campos');
    grid.innerHTML = '';
    dadosCampos.forEach(campo => {
        let div = document.createElement('div');
        div.className = 'campo';
        div.id = `campo-${campo.id}`;
        
        if (campo.status === 'bloqueado') {
            div.style.backgroundColor = '#444'; div.style.borderColor = '#222';
            div.innerText = '🔒'; div.style.color = 'white'; div.style.fontSize = '1.5rem'; div.style.cursor = 'not-allowed';
        } else {
            div.setAttribute('onclick', `clicarNoCampo(${campo.id})`);
            
            // Sub-container seguro para renderizar os emojis/sprites das plantas
            let plantaIcone = document.createElement('div');
            plantaIcone.id = `planta-icone-${campo.id}`;
            plantaIcone.style.fontSize = '1.5rem';
            div.appendChild(plantaIcone);
            
            // Barra de progresso persistente (nunca será deletada via innerHTML)
            let barra = document.createElement('div');
            barra.className = 'progresso'; 
            barra.id = `progresso-${campo.id}`;
            div.appendChild(barra);
        }
        
        grid.appendChild(div);
        atualizarVisualCampo(campo.id);
    });
}

function atualizarVisualCampo(id) {
    let campo = dadosCampos[id];
    let elCampo = document.getElementById(`campo-${id}`);
    if (!elCampo || campo.status === 'bloqueado') return;

    let elIcone = document.getElementById(`planta-icone-${id}`);
    let elBarra = document.getElementById(`progresso-${id}`);
    let imgPlanta = tiposSementes[campo.tipoPlantaIndex].sprite;

    if (campo.status === 'crescendo') {
        if (elIcone) elIcone.innerHTML = `🌱`;
        if (elBarra) elBarra.style.width = `${campo.progresso}%`;
    } else if (campo.status === 'pronto') {
        if (elIcone) elIcone.innerHTML = `<img src="${imgPlanta}" style="width: 70px; height: 70px; object-fit: contain;">`;
        if (elBarra) elBarra.style.width = '0%';
    } else if (campo.status === 'vazio') {
        if (elIcone) elIcone.innerHTML = `🟫`;
        if (elBarra) elBarra.style.width = '0%';
    }
}