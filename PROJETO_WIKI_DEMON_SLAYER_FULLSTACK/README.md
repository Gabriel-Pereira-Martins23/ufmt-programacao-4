# KIMETSU_ZONE — Integração Front-end e Back-end

Projeto prático que evolui a wiki estática de Demon Slayer (KIMETSU_ZONE) para uma
aplicação full-stack dinâmica: **Back-end** em Node.js/Express com banco **SQLite**,
autenticação **JWT** e testes unitários, integrado a um **Front-end** que consome tudo
via API (nada mais é lido de dados estáticos/mockados).

## 1. Estrutura do projeto

```

PROJETO_WIKI_DEMON_SLAYER/
├── backend/                     # API REST (Node.js + Express + SQLite)
│   ├── src/
│   │   ├── config/db.js         # Conexão SQLite + criação das tabelas
│   │   ├── models/               # Camada de acesso a dados (usuarios, personagens)
│   │   ├── controllers/          # Regras de negócio das rotas
│   │   ├── middlewares/          # Middleware de autenticação JWT
│   │   ├── routes/                # Definição das rotas da API
│   │   ├── database/              # Script de seed + dados extraídos do site original
│   │   ├── app.js                 # Configuração do Express (usado nos testes)
│   │   └── server.js              # Ponto de entrada (sobe o servidor)
│   ├── tests/                     # Suíte de testes unitários (Jest + Supertest)
│   ├── package.json
│   └── .env.example
└── frontend/                     # Front-end estático que consome a API
    ├── index.html                 # Lista de personagens (dinâmico)
    ├── personagem.html            # Página de detalhe (dinâmico, via ?id=)
    ├── login.html                 # Tela de login / criação de conta
    ├── admin.html                 # Painel CRUD (criar/editar/excluir personagens)
    ├── style.css
    ├── imagens/
    └── js/
        ├── api.js                 # Único ponto de comunicação com a API + sessão JWT
        ├── login.js
        ├── index.js
        ├── personagem.js
        └── admin.js
```

## 2. Modelo de dados

### Tabela `personagens`
| Campo         | Tipo    | Descrição                                                 |
|---------------|---------|-----------------------------------------------------------|
| id            | INTEGER | Identificador único (autoincremento)                      |
| titulo        | TEXT    | Título/nome do personagem                                 |
| conteudo      | TEXT    | Corpo da publicação (HTML: parágrafos, títulos, listas)   |
| imagem        | TEXT    | Caminho/URL da imagem associada                           |
| ordem         | INTEGER | Ordem de apresentação na listagem                         |
| criado_em     | TEXT    | Data de criação                                           |
| atualizado_em | TEXT    | Data da última atualização                                |

### Tabela `usuarios`
| Campo       | Tipo    | Descrição                           |
|-------------|---------|-------------------------------------|
| id          | INTEGER | Identificador único                 |
| username    | TEXT    | Nome de usuário (único)             |
| senha_hash  | TEXT    | Senha criptografada (bcrypt)        |
| criado_em   | TEXT    | Data de criação                     |

## 3. Instalação e configuração do ambiente

Pré-requisitos: **Node.js 18+** e **npm**.

```bash
cd backend
npm install
cp .env.example .env
```

O arquivo `.env` controla:

```
PORT=3000
JWT_SECRET=troque_por_um_valor_forte_e_secreto
JWT_EXPIRES_IN=2h
DB_PATH=./src/database/kimetsu.sqlite
```

### Popular o banco (seed)

Insere os 12 personagens (extraídos das páginas HTML originais do projeto) e um
usuário administrador padrão:

```bash
npm run seed
```

Credenciais criadas pelo seed:
- **username:** `admin`
- **password:** `demonslayer123`

### Rodar o servidor

```bash
npm start        # produção
npm run dev       # modo desenvolvimento, reinicia sozinho ao salvar arquivos
```

A API sobe em `http://localhost:3000`.

### Rodar o front-end

O front-end é HTML/CSS/JS puro (sem build step). Basta servi-lo estaticamente, por
exemplo com a extensão *Live Server* do VS Code, ou:

```bash
cd frontend
npx serve .
```

Abra a URL indicada, faça login (`admin` / `demonslayer123`) e navegue pela wiki.

> Se o back-end estiver em um endereço diferente de `http://localhost:3000`, ajuste
> a constante `API_BASE_URL` em `frontend/js/api.js`.

## 4. Testes unitários

A suíte cobre autenticação (registro/login, senhas erradas, validações) e o CRUD de
personagens (criação, leitura, atualização, remoção e bloqueio de rotas sem token).
Os testes rodam contra um banco **SQLite em memória**, isolado do banco real.

```bash
cd backend
npm test
```

## 5. Autenticação (JWT)

1. `POST /api/auth/registrar` cria um usuário nomeado (username + password).
2. `POST /api/auth/login` valida as credenciais e retorna um `token` JWT.
3. O front-end guarda esse token no `localStorage` e o envia em todas as chamadas
   seguintes no cabeçalho `Authorization: Bearer <token>`.
4. **Todas** as rotas de `/api/personagens` (GET, POST, PUT, DELETE) exigem esse
   token — sem ele, a API responde `401 Não autorizado`.

## 6. Mapeamento dos endpoints da API

| Método | Rota                       | Protegida | Descrição                                    |
|--------|----------------------------|:---------:|----------------------------------------------|
| GET    | `/api/health`              | não       | Verifica se a API está no ar                  |
| POST   | `/api/auth/registrar`      | não       | Cria um novo usuário `{ username, password }` |
| POST   | `/api/auth/login`          | não       | Autentica e retorna `{ token, usuario }`      |
| GET    | `/api/personagens`         | **sim**   | Lista todos os personagens (ordenados)        |
| GET    | `/api/personagens/:id`     | **sim**   | Busca um personagem pelo id                   |
| POST   | `/api/personagens`         | **sim**   | Cria um personagem `{ titulo, conteudo, imagem, ordem }` |
| PUT    | `/api/personagens/:id`     | **sim**   | Atualiza um personagem existente              |
| DELETE | `/api/personagens/:id`     | **sim**   | Remove um personagem                          |

Rotas protegidas exigem o cabeçalho:
```
Authorization: Bearer <token>
```

### Exemplo de uso (curl)

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"demonslayer123"}'

# Listar personagens (usando o token retornado acima)
curl http://localhost:3000/api/personagens \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 7. O que mudou em relação ao projeto estático original

- As 12 páginas HTML fixas de personagens (`tanjiro.html`, `nezuko.html`, ...) foram
  substituídas por **uma única página dinâmica** (`personagem.html?id=...`) que busca
  os dados na API.
- A home (`index.html`) não tem mais os cards de personagem escritos no HTML: eles são
  renderizados em JavaScript a partir do `GET /api/personagens`.
- Foi adicionado um **painel administrativo** (`admin.html`) para criar, editar e
  excluir personagens sem tocar no banco diretamente.
- Foi adicionada uma tela de **login/registro** (`login.html`), pré-requisito para
  acessar qualquer dado, já que todas as rotas de conteúdo exigem JWT.
