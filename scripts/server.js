const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// conexão com MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "sistema"
});

db.connect(err => {
    if (err) {
        console.log("Erro MySQL:", err);
    } else {
        console.log("MySQL conectado");
    }
});

// ================= CADASTRAR =================
app.post("/cadastrar", (req, res) => {
    const { login, senha } = req.body;

    const sql = "INSERT INTO usuarios (login, senha) VALUES (?, ?)";
    
    db.query(sql, [login, senha], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ mensagem: "Usuário cadastrado com sucesso!" });
    });
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
    const { login, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE login = ? AND senha = ?";

    db.query(sql, [login, senha], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
            res.json({ sucesso: true });
        } else {
            res.json({ sucesso: false });
        }
    });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));