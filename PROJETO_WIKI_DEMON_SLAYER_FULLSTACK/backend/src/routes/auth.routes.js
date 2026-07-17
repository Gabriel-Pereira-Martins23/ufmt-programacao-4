const { Router } = require("express");
const { registrar, login } = require("../controllers/auth.controller");

const router = Router();

// POST /api/auth/registrar -> cria um novo usuário
router.post("/registrar", registrar);

// POST /api/auth/login -> autentica e retorna um token JWT
router.post("/login", login);

module.exports = router;
