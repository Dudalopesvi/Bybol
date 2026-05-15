# 📚 Bybol

Plataforma de leitura e descoberta de livros com assistente IA.

---

## 🚀 Como rodar o projeto

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure a chave da API
Abra o arquivo `.env` na raiz do projeto e cole sua chave da Anthropic:

```
ANTHROPIC_API_KEY=sk-ant-api03-SUA-CHAVE-AQUI
```

> Obtenha sua chave em: https://console.anthropic.com

### 3. Inicie o servidor
```bash
npm start
```
Ou com reinício automático (recomendado para desenvolvimento):
```bash
npm run dev
```

### 4. Abra no navegador
```
http://localhost:3000
```

---

## 📁 Estrutura do projeto

```
Bybol/
├── server.js              ← Back-end Express (novo)
├── .env                   ← Chave da API (não vai para o Git!)
├── .gitignore
├── package.json
└── src/
    ├── public/login/      ← Tela de login/cadastro
    ├── private/home/      ← Página principal
    ├── components/        ← Explorar livros
    └── utils/
        ├── ia.html        ← Página da IA
        ├── ia.js          ← Chat (chama /api/chat)
        ├── ia.css
        └── routga.js
```

---

## 🔒 Segurança

- A chave da API **nunca** fica exposta no front-end
- O `.env` está no `.gitignore` e nunca vai para o GitHub
- O front-end chama `/api/chat` → servidor local → Anthropic
