# Express Prisma API

Esta API demonstra uma arquitetura **Node.js + Express + Prisma** organizada por features.

## Visão arquitetural

A estrutura separa código transversal em `src/core`, configuração em `src/config` e módulos de negócio em `src/features`. Cada feature concentra suas rotas, controllers, services, schemas e repositories, evitando uma organização puramente técnica que costuma dificultar manutenção conforme o domínio cresce.

| Camada | Responsabilidade |
| --- | --- |
| `src/config` | Validação de variáveis de ambiente com Zod. |
| `src/core/errors` | Erros de aplicação e middleware global de tratamento. |
| `src/core/prisma` | Instância singleton do Prisma Client. |
| `src/features/auth` | Registro, login e emissão de JWT com lista de organizações permitidas. |
| `src/features/users` | Consulta do usuário atual e membros. |
| `src/features/books` | CRUD de exemplo. |

## Como executar

Copie o arquivo de ambiente, gere o cliente Prisma, aplique a migração e execute o seed.

```bash
cp .env.example .env
npm install
npm prisma:generate
npm prisma:migrate --name init
npm seed
npm dev
```

A API ficará disponível em `http://localhost:3000`.

## Fluxo de uso

Primeiro, registre uma organização e um usuário proprietário.

```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Maria Silva",
    "email": "maria@example.com",
    "password": "password123",
  }'
```

Depois, faça login e use o token retornado como `Authorization: Bearer <token>`.

```bash
curl http://localhost:3000/books \
  -H 'Authorization: Bearer <token>' \
```

## Endpoints principais

| Método | Rota | Descrição | Autenticação |
| --- | --- | --- | --- | --- |
| GET | `/health` | Verifica disponibilidade da API. | Não | Não |
| POST | `/auth/register` | Cria usuário, organização e vínculo OWNER. | Não | Não |
| POST | `/auth/login` | Autentica usuário e retorna JWT. | Não | Não |
| GET | `/users/me` | Retorna o usuário autenticado. | Sim | Não |
| GET | `/books` | Lista books ativo. | Sim | Sim |
| POST | `books` | Cria book no ativo. | Sim | Sim |
| PATCH | `books/:id` | Atualiza book apenas dentro ativo. | Sim | Sim |
| DELETE | `books/:id` | Remove book apenas dentro ativo. | Sim | Sim |