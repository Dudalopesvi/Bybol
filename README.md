# 📱 Senai Mobile

App mobile feito em **React Native + Expo**, usando navegação por arquivos (Expo Router).

Este é a carcaça/base do projeto, pronta para começar o desenvolvimento.

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) (LTS recomendado)
- npm (ou yarn/pnpm)
- [Expo Go](https://expo.dev/go) no celular, **ou** um emulador Android/iOS configurado

## 📦 Instalação

```bash
npm install
```

## ▶️ Executando o projeto

```bash
npx expo start
```

No terminal, escolha como abrir o app:

- 📱 [Expo Go](https://expo.dev/go) — testa rapidinho no próprio celular (escaneie o QR code)
- 🤖 emulador Android
- 🍎 simulador iOS
- 🌐 navegador web (pressione `w` no terminal)

## 📂 Estrutura do projeto

```
app/
├─ index.tsx     # Tela inicial
└─ _layout.tsx   # Layout raiz (Stack de navegação)

assets/images/   # Ícones e imagens estáticas
```

## 📜 Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento do Expo |
| `npm run android` | Abre o app no emulador/dispositivo Android |
| `npm run ios` | Abre o app no simulador iOS |
| `npm run web` | Abre o app no navegador |
| `npm run lint` | Executa o ESLint no projeto |

## 📚 Aprenda mais

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do Expo Router](https://docs.expo.dev/router/introduction)
