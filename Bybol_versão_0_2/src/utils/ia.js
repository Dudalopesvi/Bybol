// ============================================================
// BYBOL — ia.js  (v2 — API funcional com streaming)
// ============================================================

// ── Navbar dinâmica ────────────────────────────────────────
const usuario = localStorage.getItem('bybol_usuario');
if (usuario) {
  document.getElementById('nomeUsuario').textContent = `Olá, ${usuario}`;
  document.getElementById('btnLogout').style.display = '';
}

function logout() {
  localStorage.removeItem('bybol_usuario');
  window.location.href = '/src/public/login/login.html';
}
window.logout = logout;

// ── Dark mode ──────────────────────────────────────────────
document.getElementById('toggleDark')
  .addEventListener('click', () => document.body.classList.toggle('dark'));

// ── Estado ────────────────────────────────────────────────
let chatHistory = [];
let iaDigitando = false;

const SYSTEM_PROMPT = `Você é o assistente do Bybol, uma plataforma de leitura e descoberta de livros.
Seu nome é Bybol IA. Você é especialista em literatura: romances, ficção científica, filosofia, clássicos, livros técnicos e muito mais.
Responda sempre em português do Brasil, de forma calorosa, entusiasmada e útil.
Ao recomendar livros, sempre mencione: título em itálico (*título*), autor e por que vale a pena ler.
Pode usar listas, negrito (**texto**) e emojis com moderação para organizar bem as respostas.
Máximo de 400 palavras por resposta.`;

// ── Markdown simples ───────────────────────────────────────
function renderMarkdown(texto) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<strong>$1</strong>')
    .replace(/^## (.+)$/gm, '<strong>$1</strong>')
    .replace(/^# (.+)$/gm,  '<strong>$1</strong>')
    .replace(/^[-•] (.+)$/gm, '• $1')
    .replace(/\n/g, '<br>');
}

// ── Criar elemento de mensagem ─────────────────────────────
function criarMsg(role) {
  const box = document.getElementById('chatBox');

  const div = document.createElement('div');
  div.className = `msg ${role === 'user' ? 'user' : 'bot'}`;

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = role === 'user' ? '👤' : 'B';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';

  div.append(avatar, bubble);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;

  return bubble;
}

function addMsg(role, texto) {
  const bubble = criarMsg(role);
  if (role === 'bot') {
    bubble.innerHTML = renderMarkdown(texto);
  } else {
    bubble.textContent = texto;
  }
  document.getElementById('chatBox').scrollTop = 99999;
}

// ── Typing indicator ───────────────────────────────────────
function showTyping() {
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = 'msg bot';
  div.id = 'typing-msg';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar';
  avatar.textContent = 'B';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';

  div.append(avatar, bubble);
  box.appendChild(div);
  box.scrollTop = 99999;
}

function removeTyping() {
  const el = document.getElementById('typing-msg');
  if (el) el.remove();
}

// ── Streaming de texto (efeito digitando) ─────────────────
async function streamText(bubble, fullText) {
  bubble.innerHTML = '';
  const words = fullText.split(' ');
  let current = '';

  for (let i = 0; i < words.length; i++) {
    current += (i === 0 ? '' : ' ') + words[i];
    bubble.innerHTML = renderMarkdown(current);
    document.getElementById('chatBox').scrollTop = 99999;
    await new Promise(r => setTimeout(r, 18));
  }
}

// ── Enviar mensagem ────────────────────────────────────────
async function enviarMensagem() {
  if (iaDigitando) return;

  const input  = document.getElementById('chatInput');
  const btnEnv = document.getElementById('btnEnviar');
  const texto  = input.value.trim();
  if (!texto) return;

  input.value = '';
  input.style.height = 'auto';
  addMsg('user', texto);
  chatHistory.push({ role: 'user', content: texto });

  iaDigitando = true;
  btnEnv.disabled = true;
  showTyping();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: chatHistory
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    removeTyping();

    const resposta =
      data.content?.[0]?.text ||
      'Desculpe, não consegui gerar uma resposta. Tente novamente.';

    chatHistory.push({ role: 'assistant', content: resposta });

    // Efeito de digitação
    const bubble = criarMsg('bot');
    await streamText(bubble, resposta);

  } catch (err) {
    removeTyping();
    const msg = err.message?.includes('fetch')
      ? '❌ Sem conexão com a IA. Verifique sua internet e tente novamente.'
      : `❌ Erro: ${err.message}`;
    addMsg('bot', msg);
    console.error('Erro API Anthropic:', err);
  } finally {
    iaDigitando = false;
    btnEnv.disabled = false;
    input.focus();
  }
}

// ── Sugestões rápidas ──────────────────────────────────────
function enviarSugestao(texto) {
  if (iaDigitando) return;
  document.getElementById('chatInput').value = texto;
  enviarMensagem();
}
window.enviarSugestao = enviarSugestao;

// ── Enter para enviar / Shift+Enter nova linha ─────────────
document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

// ── Auto-resize do textarea ────────────────────────────────
document.getElementById('chatInput').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 140) + 'px';
});

window.enviarMensagem = enviarMensagem;
