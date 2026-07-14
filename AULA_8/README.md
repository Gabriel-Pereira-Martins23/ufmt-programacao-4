# Exercício Aula 08 - Persistência de Dados com NestJS e SQLite

Este repositório contém a resolução do exercício prático da **Aula 08** de Programação IV da UFMT. O objetivo foi materializar a entidade de usuário desenvolvida na aula anterior em uma tabela real no banco de dados SQLite, realizar inserções de teste e listar os dados registrados para comprovar a persistência.

---

## 🛠️ Tecnologias Utilizadas
- **Framework:** NestJS
- **ORM:** TypeORM
- **Banco de Dados:** SQLite (driver `better-sqlite3`)
- **Linguagem:** TypeScript

---

## 📝 Resolução e Comprovação do Exercício

O exercício foi dividido em três etapas fundamentais, todas documentadas e comprovadas visualmente abaixo.

### 1. Inicialização do Ambiente e Sincronismo do Banco
A primeira etapa consistiu em iniciar o servidor NestJS. Graças à configuração do TypeORM (`synchronize: true`), a tabela de usuários foi criada automaticamente no banco de dados SQLite assim que o servidor subiu sem erros.

#### 📸 Comprovação 1: Logs de Inicialização do NestJS
![Logs do Servidor](./https://github.com/Gabriel-Pereira-Martins23/ufmt-programacao-4/blob/main/AULA_8/Captura%20de%20tela%20de%202026-07-14%2015-02-53.png?raw=true)
*A imagem acima mostra o terminal confirmando a compilação com 0 erros e o Nest application iniciado com sucesso.*

---

### 2. Inserções de Dados via Terminal (POST)
Com o servidor rodando, utilizamos uma segunda aba do terminal para enviar requisições do tipo POST para a API, inserindo utilizadores fictícios com o sobrenome "Pereira Martins" usando o comando `curl`.

#### 📸 Comprovação 2: Execução dos comandos CURL
![Requisições Terminal Lado a Lado](./https://github.com/Gabriel-Pereira-Martins23/ufmt-programacao-4/blob/main/AULA_8/Captura%20de%20tela%20de%202026-07-14%2015-08-17.png?raw=true)
*A imagem acima mostra o terminal dividido: do lado esquerdo os logs do servidor processando as requisições, e do lado direito os comandos `curl` sendo executados e recebendo o retorno de sucesso.*

---

### 3. Seleção e Persistência dos Dados (GET)
Por fim, para comprovar que os dados foram realmente salvos no banco de dados SQLite local, acessamos a rota `/users` através do navegador.

#### 📸 Comprovação 3: Resultado da Consulta no Navegador
![Resultado do Navegador](./AULA_8/Captura de tela de 2026-07-14 15-05-53.png)
*A imagem acima mostra o navegador exibindo o JSON com todos os usuários cadastrados, provando que os dados foram persistidos corretamente pelo SQLite.*

---

## 🚀 Como Executar este Projeto

1. Instale as dependências:
   ```bash
   npm install
