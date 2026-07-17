/**
 * api.js
 * Camada única de comunicação com o back-end. Nenhuma outra parte do
 * front-end deve usar fetch() diretamente — tudo passa por este arquivo.
 */

// Ajuste esta URL caso o back-end esteja rodando em outro endereço/porta.
const API_BASE_URL = "http://localhost:3000/api";

const TOKEN_KEY = "kimetsu_token";
const USER_KEY = "kimetsu_usuario";

const Auth = {
  salvarSessao(token, usuario) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  },
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getUsuario() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  estaLogado() {
    return !!this.getToken();
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  /** Redireciona para o login se não houver token. Use no topo de páginas protegidas. */
  exigirLogin() {
    if (!this.estaLogado()) {
      window.location.href = "login.html";
    }
  },
};

/**
 * Wrapper de fetch que já injeta a URL base, o header JSON e o token JWT
 * (quando existir). Lança um erro com a mensagem vinda da API em caso de falha.
 */
async function apiFetch(endpoint, { method = "GET", body, autenticado = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (autenticado) {
    const token = Auth.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Sessão expirada ou inválida -> volta para o login
  if (resposta.status === 401 && autenticado) {
    Auth.logout();
    window.location.href = "login.html";
    return Promise.reject(new Error("Sessão expirada. Faça login novamente."));
  }

  // Requisições DELETE bem-sucedidas retornam 204 sem corpo
  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new Error(dados.erro || "Ocorreu um erro ao comunicar com a API.");
  }

  return dados;
}

const PersonagensAPI = {
  listar: () => apiFetch("/personagens"),
  buscarPorId: (id) => apiFetch(`/personagens/${id}`),
  criar: (dados) => apiFetch("/personagens", { method: "POST", body: dados }),
  atualizar: (id, dados) => apiFetch(`/personagens/${id}`, { method: "PUT", body: dados }),
  remover: (id) => apiFetch(`/personagens/${id}`, { method: "DELETE" }),
};

const AuthAPI = {
  login: (username, password) =>
    apiFetch("/auth/login", { method: "POST", body: { username, password }, autenticado: false }),
  registrar: (username, password) =>
    apiFetch("/auth/registrar", { method: "POST", body: { username, password }, autenticado: false }),
};
