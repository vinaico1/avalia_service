-- ====================================================
-- NINHO VERDE 1 - Avaliação de Prestadores
-- Execute este script no SQL Editor do Supabase
-- ====================================================

-- 1. TABELA DE PERFIS DE MORADORES
-- Vinculada ao auth.users via id (UUID)
CREATE TABLE IF NOT EXISTS public.perfis_moradores (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome            TEXT,
  telefone        TEXT,
  quadra          TEXT,
  lote            TEXT,
  cadastro_completo BOOLEAN NOT NULL DEFAULT FALSE,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_quadra_lote UNIQUE (quadra, lote)
);

-- RLS: moradores só veem/editam o próprio perfil
ALTER TABLE public.perfis_moradores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Morador vê seu próprio perfil"      ON public.perfis_moradores;
DROP POLICY IF EXISTS "Morador edita seu próprio perfil"   ON public.perfis_moradores;
DROP POLICY IF EXISTS "Inserção via trigger ou próprio usuário" ON public.perfis_moradores;

CREATE POLICY "Morador vê seu próprio perfil"
  ON public.perfis_moradores FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Morador edita seu próprio perfil"
  ON public.perfis_moradores FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Inserção via trigger ou próprio usuário"
  ON public.perfis_moradores FOR INSERT
  WITH CHECK (auth.uid() = id);


-- 2. TRIGGER: Criar linha em perfis_moradores ao registrar via Google/Apple
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.perfis_moradores (id, nome, cadastro_completo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    FALSE
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. TABELA DE PRESTADORES
CREATE TABLE IF NOT EXISTS public.prestadores (
  id              SERIAL PRIMARY KEY,
  nome            TEXT NOT NULL,
  telefone        TEXT NOT NULL,
  telefone_limpo  TEXT GENERATED ALWAYS AS (regexp_replace(telefone, '[^0-9]', '', 'g')) STORED,
  area_atuacao    TEXT NOT NULL,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_prestador_telefone UNIQUE (telefone_limpo)
);

-- Índice para busca de texto
CREATE INDEX IF NOT EXISTS idx_prestadores_nome ON public.prestadores USING gin(to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_prestadores_area ON public.prestadores (area_atuacao);

-- RLS: qualquer autenticado pode ler, apenas cadastrar (não alterar)
ALTER TABLE public.prestadores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ver prestadores"    ON public.prestadores;
DROP POLICY IF EXISTS "Autenticados podem cadastrar prestadores" ON public.prestadores;

CREATE POLICY "Autenticados podem ver prestadores"
  ON public.prestadores FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Autenticados podem cadastrar prestadores"
  ON public.prestadores FOR INSERT
  TO authenticated WITH CHECK (true);


-- 4. TABELA DE AVALIAÇÕES
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id            SERIAL PRIMARY KEY,
  morador_id    UUID NOT NULL REFERENCES public.perfis_moradores(id) ON DELETE CASCADE,
  prestador_id  INT  NOT NULL REFERENCES public.prestadores(id) ON DELETE CASCADE,
  nota          INT  NOT NULL CHECK (nota >= 0 AND nota <= 5),
  observacao    TEXT,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_avaliacao_por_morador UNIQUE (morador_id, prestador_id)
);

CREATE INDEX IF NOT EXISTS idx_avaliacoes_prestador ON public.avaliacoes (prestador_id);

-- RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados veem todas avaliações"      ON public.avaliacoes;
DROP POLICY IF EXISTS "Morador cria ou atualiza sua avaliação"  ON public.avaliacoes;
DROP POLICY IF EXISTS "Morador atualiza sua avaliação"          ON public.avaliacoes;

CREATE POLICY "Autenticados veem todas avaliações"
  ON public.avaliacoes FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Morador cria ou atualiza sua avaliação"
  ON public.avaliacoes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = morador_id);

CREATE POLICY "Morador atualiza sua avaliação"
  ON public.avaliacoes FOR UPDATE
  TO authenticated USING (auth.uid() = morador_id);


-- 5. VIEW: Prestadores com média e comentários reais das avaliações
CREATE OR REPLACE VIEW public.prestadores_com_media AS
SELECT
  p.id,
  p.nome,
  p.telefone,
  p.telefone_limpo,
  p.area_atuacao,
  p.criado_em,
  COALESCE(ROUND(AVG(a.nota)::NUMERIC, 1), NULL)      AS nota_media,
  COUNT(a.id)                                          AS total_avaliacoes,
  -- Últimos comentários positivos (nota >= 4)
  (SELECT STRING_AGG(obs.observacao, ' | ' ORDER BY obs.criado_em DESC)
   FROM (SELECT observacao, criado_em FROM public.avaliacoes
         WHERE prestador_id = p.id AND nota >= 4 AND observacao IS NOT NULL
         ORDER BY criado_em DESC LIMIT 3) obs)         AS obs_positiva,
  -- Últimos comentários negativos (nota <= 2)
  (SELECT STRING_AGG(obs.observacao, ' | ' ORDER BY obs.criado_em DESC)
   FROM (SELECT observacao, criado_em FROM public.avaliacoes
         WHERE prestador_id = p.id AND nota <= 2 AND observacao IS NOT NULL
         ORDER BY criado_em DESC LIMIT 3) obs)         AS obs_negativa
FROM public.prestadores p
LEFT JOIN public.avaliacoes a ON a.prestador_id = p.id
GROUP BY p.id;

-- Permissão na view
GRANT SELECT ON public.prestadores_com_media TO authenticated;

-- HABILITAR RLS NA VIEW (Supabase requer isso para views com join)
-- A view herda as policies das tabelas base, então não precisa de policy própria.
-- Mas precisamos garantir que a view seja acessível via REST:
GRANT SELECT ON public.prestadores TO anon;
GRANT SELECT ON public.prestadores_com_media TO anon;
