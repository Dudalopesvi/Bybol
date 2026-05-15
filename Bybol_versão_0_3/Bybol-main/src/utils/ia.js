// ============================================================
// BYBOL — ia.js  (v4 — multi-provedor: Anthropic, Groq, OpenAI, custom)
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

document.getElementById('toggleDark')
  .addEventListener('click', () => document.body.classList.toggle('dark'));

// ── Estado ────────────────────────────────────────────────
let chatHistory = [];
let iaDigitando = false;
let apiKey      = '';
let provedor    = 'groq'; // padrão

const SYSTEM_PROMPT = `Você é o assistente do Bybol, uma plataforma de leitura e descoberta de livros.
Seu nome é Bybol IA. Você é especialista em literatura: romances, ficção científica, filosofia, clássicos, livros técnicos e muito mais.
Responda sempre em português do Brasil, de forma calorosa, entusiasmada e útil.
Ao recomendar livros, sempre mencione: título em itálico (*título*), autor e por que vale a pena ler.
Pode usar listas, negrito (**texto**) e emojis com moderação para organizar bem as respostas.
Máximo de 400 palavras por resposta.`;

// ── Configurações de provedores ────────────────────────────
const PROVEDORES = {
  groq: {
    nome:        'Groq',
    url:         'https://api.groq.com/openai/v1/chat/completions',
    modelo:      'llama-3.3-70b-versatile',
    tipo:        'openai',
    placeholder: 'gsk_...',
    prefixo:     'gsk_',
    link:        'https://console.groq.com/keys',
    linkTexto:   'Obter key no Groq Console →'
  },
  anthropic: {
    nome:        'Anthropic (Claude)',
    url:         'https://api.anthropic.com/v1/messages',
    modelo:      'claude-sonnet-4-20250514',
    tipo:        'anthropic',
    placeholder: 'sk-ant-...',
    prefixo:     'sk-ant-',
    link:        'https://console.anthropic.com/settings/keys',
    linkTexto:   'Obter key na Anthropic →'
  },
  openai: {
    nome:        'OpenAI (ChatGPT)',
    url:         'https://api.openai.com/v1/chat/completions',
    modelo:      'gpt-4o-mini',
    tipo:        'openai',
    placeholder: 'sk-...',
    prefixo:     'sk-',
    link:        'https://platform.openai.com/api-keys',
    linkTexto:   'Obter key na OpenAI →'
  },
  custom: {
    nome:        'Outro (OpenAI-compatível)',
    url:         '',
    modelo:      '',
    tipo:        'openai',
    placeholder: 'sua-api-key',
    prefixo:     '',
    link:        '',
    linkTexto:   ''
  }
};

// ── Persistência ───────────────────────────────────────────
function carregarConfig() {
  apiKey   = localStorage.getItem('bybol_api_key')      || '';
  provedor = localStorage.getItem('bybol_provedor')     || 'groq';
}

function salvarConfig(key, prov) {
  localStorage.setItem('bybol_api_key',  key.trim());
  localStorage.setItem('bybol_provedor', prov);
  apiKey   = key.trim();
  provedor = prov;
}

function limparConfig() {
  localStorage.removeItem('bybol_api_key');
  apiKey = '';
}

// ── Modal ──────────────────────────────────────────────────
function abrirModalApiKey(erro) {
  const modal    = document.getElementById('modalApiKey');
  const inputKey = document.getElementById('inputApiKey');
  const erroEl   = document.getElementById('apiKeyErro');
  const sel      = document.getElementById('seletorProvedor');

  erroEl.style.display = erro ? 'block' : 'none';
  if (erro) erroEl.textContent = erro;

  sel.value = provedor;
  atualizarModalUI(provedor);

  if (apiKey) inputKey.value = apiKey;
  modal.classList.remove('hidden');
  setTimeout(() => inputKey.focus(), 100);
}

function fecharModalApiKey() {
  document.getElementById('modalApiKey').classList.add('hidden');
}
window.fecharModalApiKey = fecharModalApiKey;

function atualizarModalUI(prov) {
  const cfg      = PROVEDORES[prov] || PROVEDORES.custom;
  const inputKey = document.getElementById('inputApiKey');
  const linkEl   = document.getElementById('modalLink');
  const urlWrap  = document.getElementById('customUrlWrap');
  const modeloWrap = document.getElementById('customModeloWrap');

  inputKey.placeholder = cfg.placeholder;

  if (cfg.link) {
    linkEl.href        = cfg.link;
    linkEl.textContent = cfg.linkTexto;
    linkEl.style.display = '';
  } else {
    linkEl.style.display = 'none';
  }

  // Campos extras para provedor custom
  const isCustom = prov === 'custom';
  urlWrap.style.display    = isCustom ? 'block' : 'none';
  modeloWrap.style.display = isCustom ? 'block' : 'none';

  if (!isCustom) {
    // preenche modelo/url ocultos com o do provedor
    document.getElementById('inputCustomUrl').value    = cfg.url;
    document.getElementById('inputCustomModelo').value = cfg.modelo;
  }
}

// Listener do seletor
document.getElementById('seletorProvedor').addEventListener('change', function () {
  atualizarModalUI(this.value);
  document.getElementById('inputApiKey').value = '';
  document.getElementById('apiKeyErro').style.display = 'none';
});

function confirmarApiKey() {
  const key    = document.getElementById('inputApiKey').value.trim();
  const prov   = document.getElementById('seletorProvedor').value;
  const erroEl = document.getElementById('apiKeyErro');
  const cfg    = PROVEDORES[prov];

  erroEl.style.display = 'none';

  if (!key) {
    erroEl.textContent   = '⚠️ Cole sua API key aqui.';
    erroEl.style.display = 'block';
    return;
  }

  // Valida prefixo apenas para provedores conhecidos (não custom)
  if (prov !== 'custom' && cfg.prefixo && !key.startsWith(cfg.prefixo)) {
    erroEl.textContent   = `⚠️ A key do ${cfg.nome} deve começar com ${cfg.prefixo}...`;
    erroEl.style.display = 'block';
    return;
  }

  if (prov === 'custom') {
    const url    = document.getElementById('inputCustomUrl').value.trim();
    const modelo = document.getElementById('inputCustomModelo').value.trim();
    if (!url || !modelo) {
      erroEl.textContent   = '⚠️ Preencha a URL e o modelo do provedor.';
      erroEl.style.display = 'block';
      return;
    }
    localStorage.setItem('bybol_custom_url',    url);
    localStorage.setItem('bybol_custom_modelo', modelo);
  }

  salvarConfig(key, prov);
  fecharModalApiKey();

  document.getElementById('chatBox').innerHTML = '';
  addMsg('bot', `Conectado via **${cfg.nome}** ✅\n\nOlá! Sou o assistente do Bybol 📖✨\n\nPosso te ajudar a descobrir novos livros, falar sobre autores, gêneros literários ou dar recomendações personalizadas.\n\nO que você quer explorar hoje?`);
  document.getElementById('chatInput').disabled = false;
  document.getElementById('btnEnviar').disabled  = false;
  atualizarBadge();
  document.getElementById('chatInput').focus();
}
window.confirmarApiKey = confirmarApiKey;

function atualizarBadge() {
  const badge = document.getElementById('apiStatusBadge');
  if (!badge) return;
  if (apiKey) {
    const nome = PROVEDORES[provedor]?.nome || provedor;
    badge.textContent = `✅ ${nome} ativa`;
    badge.className   = 'api-badge ativa';
  } else {
    badge.textContent = '🔑 API não configurada';
    badge.className   = 'api-badge inativa';
  }
}

document.getElementById('btnConfigurarApi').addEventListener('click', () => abrirModalApiKey());

// ── Inicialização ──────────────────────────────────────────
function iniciarIA() {
  carregarConfig();
  const chatInput = document.getElementById('chatInput');
  const btnEnviar = document.getElementById('btnEnviar');

  if (apiKey) {
    chatInput.disabled = false;
    btnEnviar.disabled  = false;
  } else {
    chatInput.disabled    = true;
    chatInput.placeholder = 'Configure sua API key para começar...';
    btnEnviar.disabled    = true;
    setTimeout(() => abrirModalApiKey(), 400);
  }
  atualizarBadge();
}

// ── Chamada à API (multi-provedor) ─────────────────────────
async function chamarAPI(mensagens) {
  const cfg = { ...PROVEDORES[provedor] };

  // Sobrescreve com custom se necessário
  if (provedor === 'custom') {
    cfg.url    = localStorage.getItem('bybol_custom_url')    || '';
    cfg.modelo = localStorage.getItem('bybol_custom_modelo') || '';
  }

  if (cfg.tipo === 'anthropic') {
    // ── Anthropic Messages API ──────────────────────────────
    const res = await fetch(cfg.url, {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model:      cfg.modelo,
        max_tokens: 1024,
        system:     SYSTEM_PROMPT,
        messages:   mensagens
      })
    });

    if (res.status === 401) { limparConfig(); throw new Error('__401__'); }
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || '';

  } else {
    // ── OpenAI-compatible (Groq, OpenAI, custom) ────────────
    const res = await fetch(cfg.url, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model:      cfg.modelo,
        max_tokens: 1024,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...mensagens
        ]
      })
    });

    if (res.status === 401) { limparConfig(); throw new Error('__401__'); }
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

// ── Markdown simples ───────────────────────────────────────
function renderMarkdown(texto) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    .replace(/^#{1,3} (.+)$/gm,'<strong>$1</strong>')
    .replace(/^[-•] (.+)$/gm,  '• $1')
    .replace(/\n/g, '<br>');
}

function criarMsg(role) {
  const box    = document.getElementById('chatBox');
  const div    = document.createElement('div');
  div.className = `msg ${role === 'user' ? 'user' : 'bot'}`;
  const avatar  = document.createElement('div');
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
  bubble.innerHTML = role === 'bot' ? renderMarkdown(texto) : '';
  if (role !== 'bot') bubble.textContent = texto;
  document.getElementById('chatBox').scrollTop = 99999;
}

function showTyping() {
  const box = document.getElementById('chatBox');
  const div = document.createElement('div');
  div.className = 'msg bot'; div.id = 'typing-msg';
  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar'; avatar.textContent = 'B';
  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
  div.append(avatar, bubble); box.appendChild(div); box.scrollTop = 99999;
}

function removeTyping() {
  const el = document.getElementById('typing-msg');
  if (el) el.remove();
}

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
  if (!apiKey) { abrirModalApiKey('Configure sua API key para conversar com a IA.'); return; }

  const input  = document.getElementById('chatInput');
  const btnEnv = document.getElementById('btnEnviar');
  const texto  = input.value.trim();
  if (!texto) return;

  input.value = ''; input.style.height = 'auto';
  addMsg('user', texto);
  chatHistory.push({ role: 'user', content: texto });

  iaDigitando = true; btnEnv.disabled = true; showTyping();

  try {
    const resposta = await chamarAPI(chatHistory);
    removeTyping();

    const textoResposta = resposta || 'Desculpe, não consegui gerar uma resposta. Tente novamente.';
    chatHistory.push({ role: 'assistant', content: textoResposta });
    const bubble = criarMsg('bot');
    await streamText(bubble, textoResposta);

  } catch (err) {
    removeTyping();
    if (err.message === '__401__') {
      abrirModalApiKey('❌ API key inválida ou expirada. Insira uma nova.');
    } else {
      const msg = err.message?.includes('fetch')
        ? '❌ Sem conexão com a IA. Verifique sua internet.'
        : `❌ Erro: ${err.message}`;
      addMsg('bot', msg);
    }
    console.error('Erro API:', err);
  } finally {
    iaDigitando = false; btnEnv.disabled = !apiKey; input.focus();
  }
}

function enviarSugestao(texto) {
  if (iaDigitando) return;
  if (!apiKey) { abrirModalApiKey('Configure sua API key para conversar com a IA.'); return; }
  document.getElementById('chatInput').value = texto;
  enviarMensagem();
}
window.enviarSugestao = enviarSugestao;

document.getElementById('chatInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarMensagem(); }
});

document.getElementById('chatInput').addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 140) + 'px';
});

window.addEventListener('load', () => {
  document.getElementById('inputApiKey').addEventListener('keydown', e => {
    if (e.key === 'Enter')  confirmarApiKey();
    if (e.key === 'Escape') fecharModalApiKey();
  });
  document.getElementById('modalApiKey').addEventListener('click', function (e) {
    if (e.target === this && apiKey) fecharModalApiKey();
  });
});

window.enviarMensagem = enviarMensagem;
iniciarIA();
