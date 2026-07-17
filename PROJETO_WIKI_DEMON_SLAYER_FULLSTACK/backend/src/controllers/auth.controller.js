const bcrypt = require("bcryptjs");
const UsuarioModel = require("../models/usuario.model");
const { gerarToken } = require("../utils/jwt");

const SALT_ROUNDS = 10;

async function registrar(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ erro: "username e password são obrigatórios." });
  }
  if (password.length < 6) {
    return res.status(400).json({ erro: "A senha deve ter no mínimo 6 caracteres." });
  }

  const existente = UsuarioModel.buscarPorUsername(username);
  if (existente) {
    return res.status(409).json({ erro: "Este username já está em uso." });
  }

  const senhaHash = await bcrypt.hash(password, SALT_ROUNDS);
  const usuario = UsuarioModel.criar({ username, senhaHash });

  return res.status(201).json({ usuario });
}

async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ erro: "username e password são obrigatórios." });
  }

  const usuario = UsuarioModel.buscarPorUsername(username);
  if (!usuario) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const senhaValida = await bcrypt.compare(password, usuario.senha_hash);
  if (!senhaValida) {
    return res.status(401).json({ erro: "Credenciais inválidas." });
  }

  const token = gerarToken({ id: usuario.id, username: usuario.username });

  return res.status(200).json({
    token,
    usuario: { id: usuario.id, username: usuario.username },
  });
}

module.exports = { registrar, login };
