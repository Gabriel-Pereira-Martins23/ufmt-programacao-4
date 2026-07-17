const request = require("supertest");
const app = require("../src/app");

describe("API de Personagens", () => {
  let token;

  const usuario = { username: "shinobu_dev", password: "veneno123" };
  const novoPersonagem = {
    titulo: "Kanroji Mitsuri",
    conteudo: "<p>Hashira do Amor.</p>",
    imagem: "imagens/mitsuri.jpeg",
    ordem: 1,
  };

  beforeAll(async () => {
    await request(app).post("/api/auth/registrar").send(usuario);
    const loginRes = await request(app).post("/api/auth/login").send(usuario);
    token = loginRes.body.token;
  });

  describe("Proteção via JWT", () => {
    test("deve bloquear GET sem token com 401", async () => {
      const res = await request(app).get("/api/personagens");
      expect(res.status).toBe(401);
    });

    test("deve bloquear com token inválido", async () => {
      const res = await request(app)
        .get("/api/personagens")
        .set("Authorization", "Bearer token.invalido.aqui");
      expect(res.status).toBe(401);
    });
  });

  describe("CRUD", () => {
    let idCriado;

    test("deve listar personagens (array, mesmo que vazio) quando autenticado", async () => {
      const res = await request(app)
        .get("/api/personagens")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test("deve criar um novo personagem", async () => {
      const res = await request(app)
        .post("/api/personagens")
        .set("Authorization", `Bearer ${token}`)
        .send(novoPersonagem);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.titulo).toBe(novoPersonagem.titulo);
      idCriado = res.body.id;
    });

    test("não deve criar personagem sem titulo/conteudo", async () => {
      const res = await request(app)
        .post("/api/personagens")
        .set("Authorization", `Bearer ${token}`)
        .send({ imagem: "x.jpg" });

      expect(res.status).toBe(400);
    });

    test("deve buscar o personagem criado por id", async () => {
      const res = await request(app)
        .get(`/api/personagens/${idCriado}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(idCriado);
    });

    test("deve retornar 404 para personagem inexistente", async () => {
      const res = await request(app)
        .get("/api/personagens/999999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    test("deve atualizar o personagem", async () => {
      const res = await request(app)
        .put(`/api/personagens/${idCriado}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ titulo: "Mitsuri Kanroji Atualizada", ordem: 5 });

      expect(res.status).toBe(200);
      expect(res.body.titulo).toBe("Mitsuri Kanroji Atualizada");
      expect(res.body.ordem).toBe(5);
    });

    test("deve remover o personagem", async () => {
      const res = await request(app)
        .delete(`/api/personagens/${idCriado}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(204);
    });

    test("deve retornar 404 ao tentar buscar personagem removido", async () => {
      const res = await request(app)
        .get(`/api/personagens/${idCriado}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
