// ============================================================
// BYBOL — server.js
// Back-end Node.js + Express
// ============================================================

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares ────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Servir arquivos estáticos do projeto ───────────────────
app.use(express.static(path.join(__dirname)));

// ── Rota raiz → redireciona para o login ──────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/public/login/login.html'));
});

// ── Rota da IA (proxy seguro para Anthropic) ──────────────
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Chave da API não configurada no servidor.' });
  }

  const { model, max_tokens, system, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Campo "messages" inválido ou ausente.' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':        'application/json',
        'x-api-key':           apiKey,
        'anthropic-version':   '2023-06-01'
      },
      body: JSON.stringify({
        model:      model      || 'claude-haiku-4-5-20251001',
        max_tokens: max_tokens || 1024,
        system:     system     || '',
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error?.message || 'Erro na API da Anthropic.' });
    }

    return res.json(data);

  } catch (err) {
    console.error('Erro ao chamar Anthropic:', err);
    return res.status(500).json({ error: 'Erro interno ao contatar a API.' });
  }
});

// ── Iniciar servidor ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Bybol rodando em http://localhost:${PORT}`);
});
