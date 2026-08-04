# Achados

App de links de afiliados com categorias/subcategorias personalizáveis, login por
e-mail/senha, busca automática de nome/foto do produto e verificação diária de
links quebrados.

## Backend (já configurado)

O projeto Supabase já está pronto e conectado neste código
(`src/lib/supabase.js`):

- **Login/cadastro** por e-mail e senha (Supabase Auth)
- **Banco de dados**: tabelas `profiles`, `categories`, `subcategories`,
  `products`, todas protegidas por Row Level Security — cada pessoa só
  enxerga os próprios dados
- **Busca automática de nome/foto**: função `fetch-metadata`, chamada ao
  tocar no botão da varinha mágica no formulário
- **Verificação diária de links**: função `check-links`, agendada via
  `pg_cron` para rodar todo dia às 09:00 UTC e desativar automaticamente
  links que estiverem quebrados

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (normalmente `http://localhost:5173`).

## Publicar (deixar online de verdade)

A forma mais simples é a Vercel ou a Netlify:

1. Suba esta pasta para um repositório no GitHub
2. Na Vercel (vercel.com) ou Netlify (netlify.com), clique em "importar
   projeto" e aponte para o repositório
3. Não precisa configurar nada além do padrão (é um projeto Vite) — o
   comando de build é `npm run build` e a pasta de saída é `dist`

Depois disso, o link fica valendo pra qualquer celular, sem precisar do seu
computador ligado.

## Confirmação de e-mail

Por padrão, o Supabase pode exigir confirmação por e-mail ao criar conta.
Se quiser que o cadastro libere o acesso na hora (sem confirmar e-mail),
isso pode ser desligado no painel do Supabase, em
Authentication → Providers → Email → "Confirm email".
