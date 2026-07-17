// Se já estiver logado, não faz sentido ver a tela de login de novo
if (Auth.estaLogado()) {
  window.location.href = "index.html";
}

const form = document.getElementById("form-auth");
const mensagemErro = document.getElementById("mensagem-erro");
const btnSubmit = document.getElementById("btn-submit");
const linkAlternar = document.getElementById("link-alternar");
const formTitulo = document.getElementById("form-titulo");

let modo = "login"; // ou "registro"

linkAlternar.addEventListener("click", (evento) => {
  evento.preventDefault();
  modo = modo === "login" ? "registro" : "login";

  if (modo === "registro") {
    formTitulo.textContent = "Criar conta";
    btnSubmit.textContent = "Criar conta";
    linkAlternar.textContent = "Já tenho uma conta";
  } else {
    formTitulo.textContent = "Entrar";
    btnSubmit.textContent = "Entrar";
    linkAlternar.textContent = "Criar uma conta";
  }
  esconderErro();
});

function mostrarErro(texto) {
  mensagemErro.textContent = texto;
  mensagemErro.hidden = false;
}

function esconderErro() {
  mensagemErro.hidden = true;
}

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  esconderErro();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;

  btnSubmit.disabled = true;
  btnSubmit.textContent = modo === "login" ? "Entrando..." : "Criando...";

  try {
    if (modo === "registro") {
      await AuthAPI.registrar(username, password);
    }
    const resposta = await AuthAPI.login(username, password);
    Auth.salvarSessao(resposta.token, resposta.usuario);
    window.location.href = "index.html";
  } catch (erro) {
    mostrarErro(erro.message);
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = modo === "login" ? "Entrar" : "Criar conta";
  }
});
