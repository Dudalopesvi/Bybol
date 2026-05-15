// ============================================================
// BYBOL — login.js  (v2 — melhorado)
// ============================================================

// ── Helpers de UI ──────────────────────────────────────────
function mostrarErro(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

function toggleSenha(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const mostrar = input.type === 'password';
  input.type = mostrar ? 'text' : 'password';
  btn.textContent = mostrar ? '🙈' : '👁';
}
window.toggleSenha = toggleSenha;

// ── Força da senha ──────────────────────────────────────────
function avaliarForca(senha) {
  let pontos = 0;
  if (senha.length >= 6)  pontos++;
  if (senha.length >= 10) pontos++;
  if (/[A-Z]/.test(senha)) pontos++;
  if (/[0-9]/.test(senha)) pontos++;
  if (/[^a-zA-Z0-9]/.test(senha)) pontos++;
  return pontos;
}

const senhaInput = document.getElementById('senhadocriarconta');
if (senhaInput) {
  senhaInput.addEventListener('input', function () {
    const wrap = document.getElementById('forcaSenhaWrap');
    const barra = document.getElementById('forcaBarra');
    const texto = document.getElementById('forcaTexto');
    const val = this.value;

    if (!val) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';

    const pontos = avaliarForca(val);
    const pct = Math.min(100, pontos * 20);
    barra.style.width = pct + '%';

    if (pontos <= 1) { barra.style.background = '#e05555'; texto.textContent = 'Fraca'; texto.style.color = '#e05555'; }
    else if (pontos <= 3) { barra.style.background = '#f0a030'; texto.textContent = 'Média'; texto.style.color = '#f0a030'; }
    else { barra.style.background = '#2aba6a'; texto.textContent = 'Forte'; texto.style.color = '#2aba6a'; }
  });
}

// ── Cadastro ───────────────────────────────────────────────
function cadastrar() {
  const login = document.getElementById('nomecriarconta')?.value.trim();
  const email = document.getElementById('emailaocriar')?.value.trim();
  const senha = document.getElementById('senhadocriarconta')?.value;
  const confirmar = document.getElementById('confirmarSenha')?.value;

  mostrarErro('erroCriarConta', '');

  if (!login) { mostrarErro('erroCriarConta', '⚠️ Informe seu nome de usuário.'); return; }
  if (login.length < 3) { mostrarErro('erroCriarConta', '⚠️ Nome deve ter ao menos 3 caracteres.'); return; }
  if (!email || !email.includes('@')) { mostrarErro('erroCriarConta', '⚠️ Informe um e-mail válido.'); return; }
  if (!senha || senha.length < 6) { mostrarErro('erroCriarConta', '⚠️ Senha deve ter ao menos 6 caracteres.'); return; }
  if (senha !== confirmar) { mostrarErro('erroCriarConta', '⚠️ As senhas não coincidem.'); return; }

  const usuarios = JSON.parse(localStorage.getItem('bybol_usuarios') || '[]');
  if (usuarios.find(u => u.login === login)) {
    mostrarErro('erroCriarConta', '⚠️ Este nome já está em uso. Escolha outro.');
    return;
  }
  if (usuarios.find(u => u.email === email)) {
    mostrarErro('erroCriarConta', '⚠️ Este e-mail já está cadastrado.');
    return;
  }

  usuarios.push({ login, email, senha });
  localStorage.setItem('bybol_usuarios', JSON.stringify(usuarios));

  // Login automático após cadastro
  localStorage.setItem('bybol_usuario', login);
  irPara('home');
}
window.cadastrar = cadastrar;

// ── Login ──────────────────────────────────────────────────
function fazerLogin() {
  const login = document.getElementById('nomelogin')?.value.trim();
  const senha = document.getElementById('senhalogin')?.value;

  mostrarErro('erroLogin', '');

  if (!login || !senha) { mostrarErro('erroLogin', '⚠️ Preencha login e senha.'); return; }

  const usuarios = JSON.parse(localStorage.getItem('bybol_usuarios') || '[]');
  const user = usuarios.find(u => u.login === login && u.senha === senha);

  if (!user) { mostrarErro('erroLogin', '❌ Login ou senha incorretos.'); return; }

  localStorage.setItem('bybol_usuario', login);
  irPara('home');
}
window.fazerLogin = fazerLogin;

// ── Enter nos campos ───────────────────────────────────────
function aoEnter(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('keyup', e => { if (e.key === 'Enter') fn(); });
}
aoEnter('nomelogin',         fazerLogin);
aoEnter('senhalogin',        fazerLogin);
aoEnter('nomecriarconta',    cadastrar);
aoEnter('senhadocriarconta', cadastrar);
aoEnter('confirmarSenha',    cadastrar);
aoEnter('emailaocriar',      cadastrar);

// ── Dark mode ──────────────────────────────────────────────
const toggleDarkBtn = document.getElementById('toggleDark');
if (toggleDarkBtn) {
  toggleDarkBtn.addEventListener('click', () => document.body.classList.toggle('dark'));
}

// ── Expõe para HTML inline ─────────────────────────────────
window.mostrarTela = mostrarTela;
window.cadastrar   = cadastrar;
window.fazerLogin  = fazerLogin;
window.irPara      = irPara;
