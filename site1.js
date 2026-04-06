// ============================================================
// BYBOL — site1.js
// ============================================================

function irPara(pagina) {
  window.location.href = pagina;
}

function mostrarTela(id) {
  const telas = ["telaInicial", "telaCriarConta", "telaLogin", "telaAnonimo"];
  telas.forEach(t => {
    const el = document.getElementById(t);
    if (el) el.classList.toggle("hidden", t !== id);
  });
}

// ── Cadastro ───────────────────────────────────────────────
function cadastrar() {
  const login = document.getElementById("nomecriarconta").value.trim();
  const senha = document.getElementById("senhadocriarconta").value;

  if (!login || !senha) { alert("Preencha nome e senha."); return; }
  if (senha.length < 6) { alert("Senha deve ter ao menos 6 caracteres."); return; }

  const usuarios = JSON.parse(localStorage.getItem("bybol_usuarios") || "[]");
  if (usuarios.find(u => u.login === login)) {
    alert("Este nome já está em uso."); return;
  }

  usuarios.push({ login, senha });
  localStorage.setItem("bybol_usuarios", JSON.stringify(usuarios));
  alert("Conta criada! Faça login.");
  mostrarTela("telaLogin");
}

// ── Login ──────────────────────────────────────────────────
function fazerLogin() {
  const login = document.getElementById("nomelogin").value.trim();
  const senha = document.getElementById("senhalogin").value;

  if (!login || !senha) { alert("Preencha login e senha."); return; }

  const usuarios = JSON.parse(localStorage.getItem("bybol_usuarios") || "[]");
  const user = usuarios.find(u => u.login === login && u.senha === senha);

  if (!user) { alert("Login ou senha incorretos."); return; }

  localStorage.setItem("bybol_usuario", login);
  irPara("site2.html");
}

// ── Enter nos campos ───────────────────────────────────────
function aoEnter(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener("keyup", e => { if (e.key === "Enter") fn(); });
}
aoEnter("nomelogin",         fazerLogin);
aoEnter("senhalogin",        fazerLogin);
aoEnter("nomecriarconta",    cadastrar);
aoEnter("senhadocriarconta", cadastrar);
aoEnter("emailaocriar",      cadastrar);

// ── Dark mode ──────────────────────────────────────────────
document.getElementById("toggleDark")
  .addEventListener("click", () => document.body.classList.toggle("dark"));

// ── Expõe para HTML inline ─────────────────────────────────
window.mostrarTela = mostrarTela;
window.cadastrar   = cadastrar;
window.fazerLogin  = fazerLogin;
window.irPara      = irPara;