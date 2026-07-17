Auth.exigirLogin();

const statusCarregamento = document.getElementById("status-carregamento");
const statusErro = document.getElementById("status-erro");
const conteudoPersonagem = document.getElementById("conteudo-personagem");

function getIdDaURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function carregarPersonagem() {
  const id = getIdDaURL();

  if (!id) {
    statusCarregamento.hidden = true;
    statusErro.textContent = "Nenhum personagem informado na URL (?id=...).";
    statusErro.hidden = false;
    return;
  }

  try {
    const personagem = await PersonagensAPI.buscarPorId(id);

    document.getElementById("titulo-aba").textContent = `${personagem.titulo} - KIMETSU_ZONE`;
    document.getElementById("nome-personagem").textContent = personagem.titulo;
    document.getElementById("nome-infobox").textContent = personagem.titulo;

    const imagemEl = document.getElementById("imagem-infobox");
    imagemEl.src = personagem.imagem || "imagens/kapa.jpg";
    imagemEl.alt = personagem.titulo;

    document.getElementById("banner-topo").style.backgroundImage =
      `linear-gradient(to top, #121212, transparent), url('${personagem.imagem || "imagens/kapa.jpg"}')`;

    // O conteúdo é armazenado como HTML (parágrafos, títulos, listas) no banco de dados,
    // por isso usamos innerHTML aqui para preservar a formatação da wiki.
    document.getElementById("texto-personagem").innerHTML = personagem.conteudo;

    statusCarregamento.hidden = true;
    conteudoPersonagem.hidden = false;
  } catch (erro) {
    statusCarregamento.hidden = true;
    statusErro.textContent = `Erro ao carregar personagem: ${erro.message}`;
    statusErro.hidden = false;
  }
}

carregarPersonagem();
