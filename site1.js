// ============================================================
// BYBOL — site1.js  (refatorado)
// ============================================================

const API = "http://localhost:3000";

// ── Cache de elementos ─────────────────────────────────────
const el = {
  // telas
  apresentacao: document.getElementById("apresentacao"),
  botoess:      document.getElementById("botoess"),
  login1:       document.getElementById("Login1"),
  criarconta1:  document.getElementById("CriarConta1"),
  explorar1:    document.getElementById("Explorar1"),
  anonimo1:     document.getElementById("ModoAnonimo1"),
  acessar1:     document.getElementById("acessar1"),

  // campos de login
  nomelogin:    document.getElementById("nomelogin"),
  senhalogin:   document.getElementById("senhalogin"),

  // campos de criar conta
  nomecriarconta:    document.getElementById("nomecriarconta"),
  senhadocriarconta: document.getElementById("senhadocriarconta"),
  emailaocriar:      document.getElementById("emailaocriar"),

  // carrossel / pesquisa
  pesquisar: document.getElementById("PesquisarDoExporar"),
  btnPesquisar: document.getElementById("btnPesquisar"),
  loading:   document.getElementById("loading"),
  track:     document.getElementById("carousel-track"),
};

// ── Navegação entre telas ──────────────────────────────────
const TODAS_TELAS = ["Login1", "CriarConta1", "Explorar1", "ModoAnonimo1"];
const SEMPRE_OCULTOS = ["botoess", "apresentacao"];

function mostrarTela(idAlvo) {
  TODAS_TELAS.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) elem.classList.toggle("hidden", id !== idAlvo);
  });
  SEMPRE_OCULTOS.forEach(id => {
    const elem = document.getElementById(id);
    if (elem) elem.classList.add("hidden");
  });
  if (el.acessar1) el.acessar1.classList.remove("hidden");
}

function mostrarareadeLogin()        { mostrarTela("Login1"); }
function mostrarareadecriarconta()   { mostrarTela("CriarConta1"); }
function mostrarareadeExplorar()     { mostrarTela("Explorar1"); }
function mostrarareadeModoAnonimo()  { mostrarTela("ModoAnonimo1"); }

function acessaraparecer() {
  mostrarTela("Explorar1");
}

// ── Autenticação ───────────────────────────────────────────
async function cadastrar() {
  const login = el.nomecriarconta.value.trim();
  const senha = el.senhadocriarconta.value;

  if (!login || !senha) { alert("Preencha todos os campos."); return; }

  try {
    const res  = await fetch(`${API}/cadastrar`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ login, senha }),
    });
    const data = await res.json();
    if (data.ok) {
      alert("Conta criada! Faça login.");
      mostrarareadeLogin();
    } else {
      alert(data.erro || "Erro ao cadastrar.");
    }
  } catch {
    alert("Não foi possível conectar ao servidor.");
  }
}

async function acessar() {
  const login = el.nomelogin.value.trim();
  const senha = el.senhalogin.value;

  if (!login || !senha) { alert("Preencha login e senha."); return; }

  try {
    const res  = await fetch(`${API}/login`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ login, senha }),
    });
    const data = await res.json();
    if (data.ok) {
      sessionStorage.setItem("token", data.token); // guarda apenas o token
      mostrarareadeExplorar();
    } else {
      alert(data.erro || "Login ou senha incorretos.");
    }
  } catch {
    alert("Não foi possível conectar ao servidor.");
  }
}

// ── Listeners de teclado (Enter) ───────────────────────────
function aoEnter(id, fn) {
  const elem = document.getElementById(id);
  if (elem) elem.addEventListener("keyup", e => { if (e.key === "Enter") fn(); });
}

aoEnter("nomelogin",          acessar);
aoEnter("senhalogin",         acessar);
aoEnter("nomecriarconta",     cadastrar);
aoEnter("senhadocriarconta",  cadastrar);
aoEnter("emailaocriar",       cadastrar);

// ── Dark mode ──────────────────────────────────────────────
const toggleDark = document.getElementById("toggleDark");
if (toggleDark) {
  toggleDark.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
}

// ── Carrossel: setas ───────────────────────────────────────
const arrowLeft  = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");
if (arrowLeft && el.track)  arrowLeft.addEventListener("click",  () => el.track.scrollBy({ left: -200, behavior: "smooth" }));
if (arrowRight && el.track) arrowRight.addEventListener("click", () => el.track.scrollBy({ left:  200, behavior: "smooth" }));

// ── Expõe funções usadas pelo HTML inline ──────────────────
window.mostrarareadeLogin       = mostrarareadeLogin;
window.mostrarareadecriarconta  = mostrarareadecriarconta;
window.mostrarareadeExplorar    = mostrarareadeExplorar;
window.mostrarareadeModoAnonimo = mostrarareadeModoAnonimo;
window.acessaraparecer          = acessaraparecer;
window.cadastrar                = cadastrar;
window.acessar                  = acessar;