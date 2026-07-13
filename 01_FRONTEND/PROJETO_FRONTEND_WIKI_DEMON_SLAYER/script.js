// Função para simular o banco de dados dos personagens
const dadosPersonagens = {
    'Tanjiro': {
        nome: "Tanjiro Kamado",
        raca: "Humano",
        afiliacao: "Corpo de Caçadores de Demônios",
        descricao: "Tanjiro é o protagonista que busca transformar sua irmã de volta em humana."
    },
    'Nezuko': {
        nome: "Nezuko Kamado",
        raca: "Demônio (Oni)",
        afiliacao: "Família Kamado",
        descricao: "Nezuko foi transformada em demônio, mas mantém suas emoções humanas."
    }
};

// Salva qual personagem o usuário clicou e muda de página
function irParaPersonagem(nome) {
    localStorage.setItem('personagemSelecionado', nome);
    window.location.href = 'personagem.html';
}

// Preenche a página de personagem com as informações certas
function carregarDados() {
    const nomeSalvo = localStorage.getItem('personagemSelecionado');
    const personagem = dadosPersonagens[nomeSalvo];

    if (personagem) {
        document.getElementById('nome-titulo').innerText = personagem.nome;
        document.getElementById('nome-info').innerText = personagem.nome;
        document.getElementById('raca').innerText = personagem.raca;
        document.getElementById('afiliacao').innerText = personagem.afiliacao;
        document.getElementById('descricao').innerText = personagem.descricao;
    }
}