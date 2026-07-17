require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 KIMETSU_ZONE API rodando em http://localhost:${PORT}`);
});
