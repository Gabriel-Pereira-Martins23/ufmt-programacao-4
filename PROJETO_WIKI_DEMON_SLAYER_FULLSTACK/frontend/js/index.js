Auth.exigirLogin();

const grid = document.getElementById("grid-personagens");
const statusCarregamento = document.getElementById("status-carregamento");
const statusErro = document.getElementById("status-erro");
const usuarioLogadoEl = document.getElementById("usuario-logado");
const linkLogout = document.getElementById("link-logout");

const usuario = Auth.getUsuario();
if (usuario) usuarioLogadoEl.textContent = usuario.username;

linkLogout.addEventListener("click", (evento) => {
  evento.preventDefault();
  Auth.logout();
  window.location.href = "login.html";
});

function criarCard(personagem) {
  const card = document.createElement("div");
  card.className = "card";
  card.addEventListener("click", () => {
    window.location.href = `personagem.html?id=${personagem.id}`;
  });

  const img = document.createElement("img");
  img.src = personagem.imagem || "imagens/kapa.jpg";
  img.alt = personagem.titulo;

  const titulo = document.createElement("h3");
  titulo.textContent = personagem.titulo;

  // Mostra um pequeno trecho do conteúdo (sem tags HTML) como prévia
  const previa = document.createElement("p");
  const textoPuro = personagem.conteudo.replace(/<[^>]*>/g, " ").trim();
  previa.textContent = textoPuro.length > 120 ? textoPuro.slice(0, 120) + "..." : textoPuro;

  card.append(img, titulo, previa);
  return card;
}

async function carregarPersonagens() {
  try {
    const personagens = await PersonagensAPI.listar();

    statusCarregamento.hidden = true;

    if (personagens.length === 0) {
      statusErro.textContent = "Nenhum personagem cadastrado ainda. Use o Painel Admin para adicionar.";
      statusErro.hidden = false;
      return;
    }

    // A API já retorna ordenado por "ordem", mas reforçamos aqui também
    personagens.sort((a, b) => a.ordem - b.ordem);
    personagens.forEach((p) => grid.appendChild(criarCard(p)));
  } catch (erro) {
    statusCarregamento.hidden = true;
    statusErro.textContent = `Erro ao carregar personagens: ${erro.message}`;
    statusErro.hidden = false;
  }
}

carregarPersonagens();
