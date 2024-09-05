import atletas from './dados.js';

let containerPaginacao = document.getElementById('paginas');
let containerAtletas = document.getElementById('container-atletas');
let input = document.getElementById('busca');
let botaoAnterior = document.getElementById('btn-anterior');
let botaoProximo = document.getElementById('btn-proximo');

// Ordena os atletas por medalhas
function compararAtletas(a, b) {
    if (a.medalhasOuro !== b.medalhasOuro) {
        return b.medalhasOuro - a.medalhasOuro; // Ordena por ouro em ordem decrescente
    } else if (a.medalhasPrata !== b.medalhasPrata) {
        return b.medalhasPrata - a.medalhasPrata; // Ordena por prata em ordem decrescente
    } else if (a.medalhasBronze !== b.medalhasBronze) {
        return b.medalhasBronze - a.medalhasBronze; // Ordena por bronze em ordem decrescente
    } else {
        return a.nome.localeCompare(b.nome); // Ordena por nome em ordem alfabética
    }
}

atletas.sort(compararAtletas);

// Paginação
let atletasPorPagina = 10;
let paginaAtual = 1;
let totalPaginas = Math.ceil(atletas.length / atletasPorPagina);
let contagem = 1

while (contagem <= totalPaginas) {
    let classeSelecionada = (contagem === paginaAtual) ? "selecionada" : "";

    let pagina = `<h2 class="pagina ${classeSelecionada}">${contagem}</h2>`;
    contagem++;

    containerPaginacao.innerHTML += pagina;
}

let atletasAtuais = atletas.slice((paginaAtual - 1) * atletasPorPagina, paginaAtual * atletasPorPagina);

// Navegar entre páginas
function navegar(pagina) {
    // Remover a classe 'selecionada' da página atual
    document.querySelector('.pagina.selecionada')?.classList.remove('selecionada');

    // Atualizar a página atual
    paginaAtual = pagina;
    console.log('paginaAtual', paginaAtual);

    // Adicionar a classe 'selecionada' à nova página
    document.querySelector(`.pagina:nth-child(${paginaAtual})`)?.classList.add('selecionada');

    // Atualizar a lista de atletas exibida
    atletasAtuais = atletas.slice((paginaAtual - 1) * atletasPorPagina, paginaAtual * atletasPorPagina);
    console.log('atletasAtuais', atletasAtuais);
    renderizarAtletas(atletasAtuais);
}

// Event listeners para os botões de navegação
botaoAnterior.addEventListener('click', () => {
    if (paginaAtual > 1) {
        navegar(paginaAtual - 1);
    }
});

botaoProximo.addEventListener('click', () => {
    if (paginaAtual < totalPaginas) {
        navegar(paginaAtual + 1);
    }
});

// Mostrar atletas
function renderizarAtletas(atletasAtuais) {
    containerAtletas.innerHTML = '';
    atletasAtuais.forEach((atleta) => {
        let card = document.createElement('div');
        card.classList.add('card'); // Adiciona a classe "card" ao elemento div

        card.innerHTML = `<div class="card" id="btnAbrirModal">
            <div class="pregos">
            <div class="prego-superior"></div>
            <div class="prego-superior"></div>
            </div>
            <img class="img-atleta" src=${atleta.imagem} alt="${atleta.nome}">
            <div class="detalhes-atleta">
            <div class="wrap-modalidade">
            <img class="img-modalidade" src="imagens/modalidades/${atleta.modalidade.toLowerCase()}.png" alt="${atleta.modalidade}">
            </div>
            <img class="img-pais" src="imagens/bandeiras/${atleta.nacionalidade.toLowerCase()}.png" alt="${atleta.nacionalidade}">
            </div>
            <h3 class="nome-atleta">${atleta.nome}</h3>
            <div class="pregos">
            <div class="prego-inferior"></div>
            <div class="prego-inferior"></div>
            </div>
            </div>`;

        card.addEventListener('click', () => {
            abrirModal(atleta);
        });

        containerAtletas.appendChild(card);
    });
}

if (paginaAtual === 1) {
    renderizarAtletas(atletasAtuais);
}

// Pesquisar atletas
input.addEventListener('input', function() {
    let value = this.value.toLowerCase();

    let cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        let nome = card.querySelector('.nome-atleta').textContent.toLowerCase();

        if (nome.includes(value)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Abrir e fechar modal
const modal = document.getElementById("modal");
const btn = document.getElementById("btnAbrirModal");

btn.onclick = function() {
  modal.style.display = "flex";
}

function abrirModal(atleta) {
    const modal = document.getElementById('modal');
    const containerModal = document.querySelector('.container-modal');

    let conteudoModal = `
        <div class="header-modal">
            <h1 class="nome-atleta-modal">${atleta.nome}</h1>
            <div class="wrap-modalidade-modal">
                <img class="img-modalidade-modal" src="imagens/modalidades/${atleta.modalidade.toLowerCase()}.png" alt="${atleta.modalidade}">
            </div>
        </div>
        <div class="body-modal">
            <div class="wrap-imagem-atleta">
                <img class="imagem-atleta" src="${atleta.imagem}" alt="${atleta.nome}">
            </div>
            <div class="info-atleta">
                <div class="resultados">
                    <h3>Resultados</h3>
                    <div class="medalhas">
                        <div class="ouro">${atleta.medalhasOuro}</div>
                        <div class="prata">${atleta.medalhasPrata}</div>
                        <div class="bronze">${atleta.medalhasBronze}</div>
                    </div>
                </div>
                <div class="biografia">
                    <h3>Biografia</h3>
                    <p>Participações: ${atleta.edicoes}</p>
                    <p>Ano de nascimento: ${atleta.anoNascimento}</p>
                    <p>Primeira edição: ${atleta.primeiraEdicao}</p>
                </div>
            </div>
        </div>
        <div class="footer-modal">
            <img class="imagem-bandeira" src="imagens/bandeiras/${atleta.nacionalidade.toLowerCase()}.png" alt="${atleta.nacionalidade}">
        </div>
    `;

    containerModal.innerHTML = conteudoModal;

    modal.style.display = "flex";
}


// Função para fechar o modal
function fecharModal() {
    modal.style.display = "none";
}

window.addEventListener("click", (event) => {
    if (event.target == modal) {
        fecharModal();
    }
});