# 🛡️ API de Usuários com Autenticação JWT & TypeORM

Este repositório contém o desenvolvimento prático das **Aulas 09 & 10** da disciplina de Desenvolvimento Web do curso de **Bacharelado em Ciência da Computação** da **Universidade Federal de Mato Grosso (UFMT), Campus Araguaia**.

O objetivo desta etapa foi evoluir a arquitetura da API RESTful estruturada em **NestJS**, integrando persistência em banco de dados relacional (**SQLite/TypeORM**), criptografia de dados sensíveis com **bcrypt** e controle de acesso baseado em tokens **JWT (JSON Web Tokens)**.

---

## ⚙️ Como o Programa Funciona (Por Baixo dos Panos)

A aplicação segue a arquitetura modular do NestJS, dividindo as responsabilidades em camadas bem definidas. O funcionamento lógico do sistema baseia-se em três pilares principais:

### 1. O Fluxo de uma Requisição Protegida
Quando uma requisição (como um `GET /users`) chega à API, ela não acessa os dados imediatamente. O ciclo funciona assim:
* **Interceptação pelo Guard:** A rota é blindada pelo `@UseGuards(AuthGuard('jwt'))`. Esse componente intercepta o cabeçalho HTTP antes que ele chegue à lógica do controlador.
* **Validação da Assinatura:** A estratégia do Passport-JWT extrai o token do formato `Bearer <TOKEN>` e valida a assinatura digital utilizando uma chave secreta e checando se o tempo de expiração de 60 segundos não expirou.
* **Consumo do Serviço:** Caso o token seja válido, a requisição é encaminhada para o `UsersService`, que por sua vez utiliza o repositório do **TypeORM** para buscar as informações diretamente no arquivo `database.sqlite`.

### 2. Criptografia de Senhas com Bcrypt
Para garantir a segurança dos dados, as senhas dos usuários nunca são armazenadas em texto limpo no banco de dados. 
* Ao cadastrar um usuário (`POST /users`), o `UsersService` utiliza a biblioteca **bcrypt** para gerar um *Salt* (sequência aleatória de caracteres) e fundi-lo com a senha digitada, transformando-a em um *Hash* irreversível.
* Durante a autenticação (`POST /auth/login`), o sistema pega a senha enviada no corpo da requisição, gera o hash temporário e o compara com o hash guardado no banco. Se forem compatíveis, o acesso é validado.

### 3. Emissão e Estrutura do Token JWT
Uma vez validado o login, o `AuthService` gera um JSON Web Token contendo:
* **Payload:** Dados não confidenciais de identificação, como o ID do usuário (`sub`) e o nome (`username`).
* **Assinatura:** Um código gerado a partir do payload combinado com a chave secreta da API, garantindo que o token não possa ser adulterado pelo cliente.

---

## 🛠️ Dependências Usadas nas Aulas 09 & 10

Para implementar esse ecossistema de segurança, foram adicionadas as seguintes bibliotecas ao núcleo do NestJS:

```bash
# Instalação dos módulos de autenticação e criptografia
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt

# Instalação das tipagens de desenvolvimento para TypeScript
npm install --save-dev @types/passport-jwt @types/bcrypt

### 🧪 Roteiro de Testes e Comandos Executados

Com o servidor ativo na porta `3000`, o fluxo completo de testes consiste nos seguintes comandos sequenciais via terminal:

#### Passo 1: Teste de Bloqueio Anônimo (Guard Ativo)
Tente ler dados da rota protegida sem enviar credenciais para atestar que o sistema está seguro:
```bash
curl -X GET http://localhost:3000/users