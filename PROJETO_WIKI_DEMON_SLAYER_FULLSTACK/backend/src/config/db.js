const path = require("path");
const Database = require("better-sqlite3");

// Em ambiente de teste usamos um banco 100% em memória, para não sujar
// o arquivo .sqlite real e para que cada execução da suíte comece "limpa".
const dbPath =
  process.env.NODE_ENV === "test"
    ? ":memory:"
    : path.resolve(__dirname, "..", "..", process.env.DB_PATH || "./src/database/kimetsu.sqlite");

const db = new Database(dbPath);
if (dbPath !== ":memory:") {
  db.pragma("journal_mode = WAL");
}
db.pragma("foreign_keys = ON");

function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL,
      criado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS personagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      conteudo TEXT NOT NULL,
      imagem TEXT,
      ordem INTEGER NOT NULL DEFAULT 0,
      criado_em TEXT NOT NULL DEFAULT (datetime('now')),
      atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

migrate();

module.exports = db;
