require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const db = require("../config/db");
const UsuarioModel = require("../models/usuario.model");
const PersonagemModel = require("../models/personagem.model");

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpa as tabelas antes de popular (idempotente)
  db.exec("DELETE FROM personagens;");
  db.exec("DELETE FROM usuarios;");

  // --- Usuário admin padrão ---
  const senhaHash = await bcrypt.hash("demonslayer123", 10);
  UsuarioModel.criar({ username: "admin", senhaHash });
  console.log('👤 Usuário criado -> username: "admin" | password: "demonslayer123"');

  // --- Personagens (extraídos do front-end estático original) ---
  const seedPath = path.resolve(__dirname, "seed_data.json");
  const personagens = JSON.parse(fs.readFileSync(seedPath, "utf-8"));

  for (const p of personagens) {
    PersonagemModel.criar({
      titulo: p.titulo,
      conteudo: p.conteudo,
      imagem: p.imagem,
      ordem: p.ordem,
    });
  }
  console.log(`📚 ${personagens.length} personagens inseridos.`);

  console.log("✅ Seed concluído com sucesso!");
}

seed()
  .catch((err) => {
    console.error("❌ Erro ao executar o seed:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    db.close();
  });
