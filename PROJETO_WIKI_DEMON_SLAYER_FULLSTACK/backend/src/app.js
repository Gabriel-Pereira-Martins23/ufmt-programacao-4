const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const personagensRoutes = require("./routes/personagens.routes");

const app = express();

app.use(cors());
app.use(express.json());

// Rota de verificação de saúde da API
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/personagens", personagensRoutes);

// Handler para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Handler de erros genéricos
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

module.exports = app;
