const { Router } = require("express");
const autenticar = require("../middlewares/auth.middleware");
const {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover,
} = require("../controllers/personagens.controller");

const router = Router();

// Todas as rotas de personagens exigem autenticação (requisito D do projeto)
router.use(autenticar);

router.get("/", listar);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar);
router.delete("/:id", remover);

module.exports = router;
