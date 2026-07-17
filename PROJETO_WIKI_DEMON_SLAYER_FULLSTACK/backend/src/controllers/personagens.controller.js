const PersonagemModel = require("../models/personagem.model");

function listar(req, res) {
  const personagens = PersonagemModel.listarTodos();
  return res.status(200).json(personagens);
}

function buscarPorId(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ erro: "id inválido." });
  }

  const personagem = PersonagemModel.buscarPorId(id);

  if (!personagem) {
    return res.status(404).json({ erro: "Personagem não encontrado." });
  }
  return res.status(200).json(personagem);
}

function criar(req, res) {
  const { titulo, conteudo, imagem, ordem } = req.body;

  if (!titulo || !conteudo) {
    return res.status(400).json({ erro: "titulo e conteudo são obrigatórios." });
  }

  const personagem = PersonagemModel.criar({ titulo, conteudo, imagem, ordem });
  return res.status(201).json(personagem);
}

function atualizar(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ erro: "id inválido." });
  }
  const { titulo, conteudo, imagem, ordem } = req.body;

  const atualizado = PersonagemModel.atualizar(id, { titulo, conteudo, imagem, ordem });

  if (!atualizado) {
    return res.status(404).json({ erro: "Personagem não encontrado." });
  }
  return res.status(200).json(atualizado);
}

function remover(req, res) {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ erro: "id inválido." });
  }
  const removido = PersonagemModel.remover(id);

  if (!removido) {
    return res.status(404).json({ erro: "Personagem não encontrado." });
  }
  return res.status(204).send();
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
