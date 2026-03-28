const express    = require("express");
const mysql      = require("mysql2/promise");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const cors       = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({ origin: "http://localhost:5500" })); // ajuste para seu domínio
app.use(express.json());

// ── Pool de conexões (mais eficiente que createConnection) ──────────────────
const db = mysql.createPool({
  host:     process.env.DB_HOST     || "localhost",
  user:     process.env.DB_USER     || "root",
  password: process.env.DB_PASS     || "",
  database: process.env.DB_NAME     || "bybol",
  waitForConnections: true,
  connectionLimit: 10,
});

// ── Middleware: verifica JWT em rotas protegidas ─────────────────────────────
function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ erro: "Token ausente" });
  const token = header.split(" ")[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || "chave_dev");
    next();
  } catch {
    res.status(401).json({ erro: "Token inválido" });
  }
}

// ── POST /cadastrar ──────────────────────────────────────────────────────────
app.post("/cadastrar", async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha)
    return res.status(400).json({ erro: "Login e senha são obrigatórios" });

  if (senha.length < 6)
    return res.status(400).json({ erro: "Senha deve ter ao menos 6 caracteres" });

  try {
    const hash = await bcrypt.hash(senha, 10);
    await db.execute(
      "INSERT INTO usuarios (login, senha_hash) VALUES (?, ?)",
      [login, hash]
    );
    res.json({ ok: true, mensagem: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(409).json({ erro: "Login já está em uso" });
    console.error(err);
    res.status(500).json({ erro: "Erro interno" });
  }
});

// ── POST /login ──────────────────────────────────────────────────────────────
app.post("/login", async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha)
    return res.status(400).json({ erro: "Login e senha são obrigatórios" });

  try {
    const [rows] = await db.execute(
      "SELECT id, login, senha_hash FROM usuarios WHERE login = ?",
      [login]
    );

    const user = rows[0];

    // Compara mesmo se user não existe (evita timing attack)
    const senhaValida = user
      ? await bcrypt.compare(senha, user.senha_hash)
      : false;

    if (!user || !senhaValida)
      return res.status(401).json({ erro: "Login ou senha incorretos" });

    const token = jwt.sign(
      { id: user.id, login: user.login },
      process.env.JWT_SECRET || "chave_dev",
      { expiresIn: "2h" }
    );

    res.json({ ok: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro interno" });
  }
});

// ── GET /perfil (rota protegida — exemplo) ───────────────────────────────────
app.get("/perfil", autenticar, (req, res) => {
  res.json({ login: req.usuario.login });
});

// ── Iniciar servidor ─────────────────────────────────────────────────────────
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Servidor rodando em http://localhost:${PORTA}`));