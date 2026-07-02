-- Preguntas frecuentes editables por propiedad.
-- Columna aditiva y nullable con default '[]' (mismo patrón que documents):
-- no afecta filas existentes ni las políticas RLS row-level vigentes.
ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS faqs jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.properties.faqs IS
  'FAQ específicas de la propiedad: array de objetos {q, a}. Vacío = se usan las preguntas genéricas del sitio.';
