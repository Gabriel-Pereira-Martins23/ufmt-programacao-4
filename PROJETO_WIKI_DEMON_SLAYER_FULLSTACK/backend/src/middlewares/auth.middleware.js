const { verificarToken } = require("../utils/jwt");

/**
 * Middleware de autenticação.
 * Espera o cabeçalho:  Authorization: Bearer <token>
 * Se o token for válido, anexa os dados do usuário em req.usuario
 * e libera o acesso à rota. Caso contrário, responde 401.
 */
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      erro: "Token não fornecido. Envie o cabeçalho Authorization: Bearer <token>.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verificarToken(token);
    req.usuario = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ erro: "Token inválido ou expirado." });
  }
}

module.exports = autenticar;
