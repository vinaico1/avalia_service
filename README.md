# 🌿 Avaliação de Prestadores — Ninho Verde 1

Aplicativo PWA para moradores do condomínio Ninho Verde 1 avaliarem e descobrirem prestadores de serviço da região.

🔗 **Acesso:** [avalia-service.vercel.app](https://avalia-service.vercel.app)

---

## Sobre o Projeto

Projeto independente criado por morador do condomínio, sem vínculo com a administração. Permite que moradores compartilhem experiências com prestadores de serviço, ajudando a comunidade a fazer melhores escolhas na contratação.

---

## Funcionalidades

- **Autenticação** via e-mail/senha com recuperação de senha
- **Cadastro de morador** com Quadra + Lote (único por residência) e aceite de Termo de Uso
- **Lista de prestadores** ordenada por melhor avaliação, com busca (sem acento) e filtro por área
- **Avaliação 0–5 estrelas** com alertas visuais por faixa de nota
- **Uma avaliação por prestador por morador** — badge "Avaliado ✓" após registrar
- **Cadastro de novo prestador** direto pelo modal de avaliação, com campo livre ao selecionar "Outros"
- **Contato rápido** via WhatsApp e ligação (número revelado ao clicar)
- **PWA instalável** na tela inicial do iPhone e Android

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite 6 |
| Estilização | Tailwind CSS v3 |
| Ícones | Lucide React |
| Roteamento | React Router v6 |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| Deploy | Vercel |
| PWA | vite-plugin-pwa + Workbox |

---

## Estrutura do Banco de Dados

```sql
perfis_moradores   -- perfil do morador (quadra, lote, nome, telefone)
prestadores        -- cadastro de prestadores (telefone_limpo GENERATED)
avaliacoes         -- notas 0–5 por morador/prestador (UNIQUE morador+prestador)
prestadores_com_media  -- VIEW com média, contagem e últimos comentários
```

**RLS habilitado** em todas as tabelas. Apenas usuários autenticados leem e escrevem.

---

## Alertas Visuais por Nota

| Faixa | Cor | Badge |
|---|---|---|
| 0 | Vermelho | Não Recomendado |
| 1–3 | Âmbar | Atenção ao Contratar |
| 4–5 | Verde | Bem Recomendado |

---

## Rodando Localmente

### Pré-requisitos
- Node.js 18+
- Conta no [Supabase](https://supabase.com)

### Configuração

```bash
git clone https://github.com/vinaico1/avalia_service.git
cd avalia_service
npm install
```

Crie o arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

Execute o schema SQL no Supabase SQL Editor:
```
supabase/schema.sql   ← tabelas, RLS, view, trigger
supabase/seed.sql     ← ~165 prestadores pré-cadastrados
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## Deploy (Vercel)

1. Conecte o repositório no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Adicione a URL de produção no Supabase → **Authentication → URL Configuration → Redirect URLs**:
   ```
   https://avalia-service.vercel.app/redefinir-senha
   ```
4. O `vercel.json` já inclui rewrite para SPA e security headers (CSP, X-Frame-Options, etc.)

---

## Instalar como App (PWA)

**iPhone (Safari):**
1. Abra o link no Safari
2. Toque em Compartilhar ↑ → "Adicionar à Tela de Início"

**Android (Chrome):**
1. Abra o link no Chrome
2. Menu ⋮ → "Adicionar à tela inicial"

---

## Segurança

- `.env` nunca versionado (`.gitignore`)
- `.claude/` excluído do repositório
- Security headers via `vercel.json`: CSP, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy
- RLS ativo no Supabase para todas as tabelas
- Chave `service_role` nunca exposta no client

---

## Aviso Legal

Este é um projeto independente criado por morador do condomínio, sem vínculo com a administração do Ninho Verde 1. As avaliações refletem exclusivamente a opinião dos usuários que contrataram os serviços. Prestadores que desejarem atualizar ou remover seus dados poderão solicitar diretamente pelo aplicativo.

---

## Licença

Uso interno — condomínio Ninho Verde 1.
