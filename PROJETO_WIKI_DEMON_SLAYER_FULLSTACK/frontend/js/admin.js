Auth.exigirLogin();

const form = document.getElementById("form-personagem");
const corpoTabela = document.getElementById("corpo-tabela");
const formTitulo = document.getElementById("form-titulo");
const btnSalvar = document.getElementById("btn-salvar");
const btnCancelar = document.getElementById("btn-cancelar");
const mensagemErro = document.getElementById("mensagem-erro");
const mensagemSucesso = document.getElementById("mensagem-sucesso");
const linkLogout = document.getElementById("link-logout");

const campoId = document.getElementById("personagem-id");
const campoTitulo = document.getElementById("titulo");
const campoImagem = document.getElementById("imagem");
const campoOrdem = document.getElementById("ordem");
const campoConteudo = document.getElementById("conteudo");

linkLogout.addEventListener("click", (evento) => {
  evento.preventDefault();
  Auth.logout();
  window.location.href = "login.html";
});

function esconderMensagens() {
  mensagemErro.hidden = true;
  mensagemSucesso.hidden = true;
}

function mostrarErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
}

function mostrarSucesso(texto) {
  mensagemSucesso.textContent = texto;
  mensagemSucesso.hidden = false;
  setTimeout(() => (mensagemSucesso.hidden = true), 3000);
}

function limparFormulario() {
  campoId.value = "";
  campoTitulo.value = "";
  campoImagem.value = "";
  campoOrdem.value = "0";
  campoConteudo.value = "";
  formTitulo.textContent = "Novo personagem";
  btnSalvar.textContent = "Salvar";
  btnCancelar.hidden = true;
}

function preencherFormularioParaEdicao(personagem) {
  campoId.value = personagem.id;
  campoTitulo.value = personagem.titulo;
  campoImagem.value = personagem.imagem || "";
  campoOrdem.value = personagem.ordem;
  campoConteudo.value = personagem.conteudo;
  formTitulo.textContent = `Editando: ${personagem.titulo}`;
  btnSalvar.textContent = "Atualizar";
  btnCancelar.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function criarLinha(personagem) {
  const linha = document.createElement("tr");

  const tdOrdem = document.createElement("td");
  tdOrdem.textContent = personagem.ordem;

  const tdTitulo = document.createElement("td");
  tdTitulo.textContent = personagem.titulo;

  const tdAcoes = document.createElement("td");

  const btnEditar = document.createElement("button");
  btnEditar.textContent = "Editar";
  btnEditar.className = "btn-editar";
  btnEditar.addEventListener("click", () => preencherFormularioParaEdicao(personagem));

  const btnVer = document.createElement("button");
  btnVer.textContent = "Ver página";
  btnVer.className = "btn-ver";
  btnVer.addEventListener("click", () => {
    window.location.href = `personagem.html?id=${personagem.id}`;
  });

  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "Excluir";
  btnExcluir.className = "btn-excluir";
  btnExcluir.addEventListener("click", () => excluirPersonagem(personagem));

  tdAcoes.append(btnVer, btnEditar, btnExcluir);
  linha.append(tdOrdem, tdTitulo, tdAcoes);
  return linha;
}

async function carregarTabela() {
  try {
    const personagens = await PersonagensAPI.listar();
    corpoTabela.innerHTML = "";
    personagens
      .sort((a, b) => a.ordem - b.ordem)
      .forEach((p) => corpoTabela.appendChild(criarLinha(p)));
  } catch (erro) {
    mostrarErro(`Erro ao carregar personagens: ${erro.message}`);
  }
}

async function excluirPersonagem(personagem) {
  const confirmado = window.confirm(`Excluir "${personagem.titulo}"? Essa ação não pode ser desfeita.`);
  if (!confirmado) return;

  try {
    await PersonagensAPI.remover(personagem.id);
    mostrarSucesso("Personagem excluído com sucesso.");
    await carregarTabela();
  } catch (erro) {
    mostrarErro(`Erro ao excluir: ${erro.message}`);
  }
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  esconderMensagens();

  const dados = {
    titulo: campoTitulo.value.trim(),
    imagem: campoImagem.value.trim(),
    ordem: parseInt(campoOrdem.value, 10) || 0,
    conteudo: campoConteudo.value.trim(),
  };

  const id = campoId.value;

  try {
    if (id) {
      await PersonagensAPI.atualizar(id, dados);
      mostrarSucesso("Personagem atualizado com sucesso.");
    } else {
      await PersonagensAPI.criar(dados);
      mostrarSucesso("Personagem criado com sucesso.");
    }
    limparFormulario();
    await carregarTabela();
  } catch (erro) {
    mostrarErro(erro.message);
  }
});

btnCancelar.addEventListener("click", limparFormulario);

carregarTabela();
