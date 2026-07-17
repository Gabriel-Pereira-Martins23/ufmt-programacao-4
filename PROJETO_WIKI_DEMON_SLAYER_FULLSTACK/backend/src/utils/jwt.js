const jwt = require("jsonwebtoken");

function getSecret() {
  return process.env.JWT_SECRET || "kimetsu_zone_super_secreto_troque_isso";
}

function gerarToken(payload) {
  return jwt.sign(payload, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
}

function verificarToken(token) {
  return jwt.verify(token, getSecret());
}

module.exports = { gerarToken, verificarToken };
