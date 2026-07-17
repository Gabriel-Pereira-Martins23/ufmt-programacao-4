const db = require("../config/db");

const PersonagemModel = {
  listarTodos() {
    return db
      .prepare("SELECT * FROM personagens ORDER BY ordem ASC, id ASC")
      .all();
  },

  buscarPorId(id) {
    return db.prepare("SELECT * FROM personagens WHERE id = ?").get(id);
  },

  criar({ titulo, conteudo, imagem, ordem }) {
    const stmt = db.prepare(`
      INSERT INTO personagens (titulo, conteudo, imagem, ordem)
      VALUES (@titulo, @conteudo, @imagem, @ordem)
    `);
    const info = stmt.run({
      titulo,
      conteudo,
      imagem: imagem || null,
      ordem: Number.isInteger(ordem) ? ordem : 0,
    });
    return this.buscarPorId(info.lastInsertRowid);
  },

  atualizar(id, { titulo, conteudo, imagem, ordem }) {
    const atual = this.buscarPorId(id);
    if (!atual) return null;

    const stmt = db.prepare(`
      UPDATE personagens
      SET titulo = @titulo,
          conteudo = @conteudo,
          imagem = @imagem,
          ordem = @ordem,
          atualizado_em = datetime('now')
      WHERE id = @id
    `);
    stmt.run({
      id,
      titulo: titulo ?? atual.titulo,
      conteudo: conteudo ?? atual.conteudo,
      imagem: imagem ?? atual.imagem,
      ordem: Number.isInteger(ordem) ? ordem : atual.ordem,
    });
    return this.buscarPorId(id);
  },

  remover(id) {
    const info = db.prepare("DELETE FROM personagens WHERE id = ?").run(id);
    return info.changes > 0;
  },
};

module.exports = PersonagemModel;
