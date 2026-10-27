# MT FLIX

Plataforma de streaming gratuita com catálogo de domínio público, inspirada no formato de
navegação da Netflix mas com identidade visual própria (roxo/violeta + dourado sobre fundo
quase preto, logo "MT FLIX" em Archivo Black).

```
mtflix/
├── server/   → API (Node + Express + TypeScript + banco em JSON via lowdb)
├── web/      → Site (React + TypeScript + Vite)
└── android/  → Instruções para gerar o app Android (Capacitor), reaproveitando o site
```

## Por que vale a pena ler isto antes de rodar

- **Nenhuma dependência foi instalada aqui.** Eu escrevi todo o código-fonte, mas este ambiente
  não tem acesso à internet para baixar pacotes. Você precisa rodar `npm install` na sua própria
  máquina (passo a passo abaixo).
- **Conteúdo do catálogo**: comecei com filmes clássicos amplamente citados como de domínio
  público (ex.: *A Noite dos Mortos-Vivos*, 1968; *Nosferatu*, 1922), com links do Archive.org.
  **Confira cada link e a licença antes de publicar de verdade** — nomes de arquivo no
  Archive.org mudam com o tempo, e "domínio público" pode variar conforme o país. Use o painel
  `/admin` para corrigir ou trocar qualquer título.
- Não existe um bom catálogo de animes em domínio público — a categoria "Animes" já está
  pronta no sistema, mas comece vazia até você ter conteúdo com licença Creative Commons ou
  autorização por escrito.

## Como rodar na sua máquina

### 1. API (servidor)

```bash
cd server
npm install
cp .env.example .env
npm run seed    # cria o catálogo inicial e o usuário administrador
npm run dev     # roda em http://localhost:4000
```

O comando `seed` imprime no terminal o e-mail e a senha do administrador (vem do `.env`,
padrão `admin@mtflix.com` / `admin123` — troque antes de publicar de verdade).

### 2. Site

Em outro terminal:

```bash
cd web
npm install
npm run dev     # roda em http://localhost:5173
```

Abra `http://localhost:5173`. O Vite já encaminha as chamadas `/api` para o servidor na porta
4000 (veja `web/vite.config.ts`).

### 3. Login

- Crie uma conta normal pela tela de cadastro, ou
- Entre com a conta de administrador criada pelo `seed` para acessar `/admin`.

## Funcionalidades incluídas

- Cadastro e login com senha criptografada (bcrypt) e sessão por token (JWT).
- Página inicial com banner grande, fileira "Continuar assistindo" e fileiras por categoria.
- 8 categorias: ação, aventura, comédia, terror, romance, ficção científica, animes, desenhos.
- Busca por título e sinopse.
- Página de cada filme/série com sinopse, nota, duração e botão de favoritar.
- Player de vídeo em HTML5 que salva o progresso e retoma de onde parou.
- Histórico de reprodução.
- Painel administrativo (`/admin`, só para usuários com `isAdmin: true`) para criar, editar e
  remover títulos — capa, banner, sinopse, categoria, vídeo e nota de licença/fonte.

## O que falta para ser um produto "de verdade"

Para ir além de um projeto funcional local:
- Trocar o banco em JSON (lowdb) por um banco de produção (Postgres, MySQL) se o catálogo
  crescer muito — a estrutura em `server/src/types.ts` já está pronta para migrar.
- Hospedar os vídeos em um serviço de streaming adaptativo (ex.: Cloudflare Stream, Mux) em vez
  de servir `.mp4` direto, para carregar melhor em conexões ruins.
- Hospedar a API e o site (ex.: Render/Railway para a API, Vercel/Netlify para o site).
- Seguir o passo a passo em `android/README.md` para gerar o APK.

## Tecnologia

React, TypeScript, Vite, React Router no site. Node, Express, TypeScript, JWT e bcrypt na API.
Banco em arquivo JSON via lowdb (simples de ler e já estruturado para trocar por SQL depois).
