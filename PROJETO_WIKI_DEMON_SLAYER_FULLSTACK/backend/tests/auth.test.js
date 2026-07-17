const request = require("supertest");
const app = require("../src/app");

describe("Autenticação (JWT)", () => {
  const usuarioValido = { username: "tanjiro_dev", password: "senha123" };

  test("deve registrar um novo usuário com sucesso", async () => {
    const res = await request(app).post("/api/auth/registrar").send(usuarioValido);

    expect(res.status).toBe(201);
    expect(res.body.usuario).toHaveProperty("id");
    expect(res.body.usuario.username).toBe(usuarioValido.username);
    expect(res.body.usuario).not.toHaveProperty("senha_hash");
  });

  test("não deve registrar usuário duplicado", async () => {
    await request(app).post("/api/auth/registrar").send(usuarioValido);
    const res = await request(app).post("/api/auth/registrar").send(usuarioValido);

    expect(res.status).toBe(409);
    expect(res.body).toHaveProperty("erro");
  });

  test("não deve registrar sem username ou password", async () => {
    const res = await request(app).post("/api/auth/registrar").send({ username: "sozinho" });
    expect(res.status).toBe(400);
  });

  test("não deve registrar com senha curta demais", async () => {
    const res = await request(app)
      .post("/api/auth/registrar")
      .send({ username: "novato", password: "123" });
    expect(res.status).toBe(400);
  });

  test("deve fazer login com credenciais corretas e retornar um token", async () => {
    await request(app).post("/api/auth/registrar").send(usuarioValido);

    const res = await request(app).post("/api/auth/login").send(usuarioValido);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.usuario.username).toBe(usuarioValido.username);
  });

  test("não deve logar com senha incorreta", async () => {
    await request(app).post("/api/auth/registrar").send(usuarioValido);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: usuarioValido.username, password: "senhaErrada" });

    expect(res.status).toBe(401);
  });

  test("não deve logar com usuário inexistente", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "fantasma", password: "qualquer123" });

    expect(res.status).toBe(401);
  });
});
