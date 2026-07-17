const db = require("../config/db");

const UsuarioModel = {
  criar({ username, senhaHash }) {
    const stmt = db.prepare(
      "INSERT INTO usuarios (username, senha_hash) VALUES (?, ?)"
    );
    const info = stmt.run(username, senhaHash);
    return this.buscarPorId(info.lastInsertRowid);
  },

  buscarPorUsername(username) {
    return db
      .prepare("SELECT * FROM usuarios WHERE username = ?")
      .get(username);
  },

  buscarPorId(id) {
    return db
      .prepare("SELECT id, username, criado_em FROM usuarios WHERE id = ?")
      .get(id);
  },
};

module.exports = UsuarioModel;
