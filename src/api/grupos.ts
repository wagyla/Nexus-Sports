import { supabase } from "@/utils/supabase";
import type { GrupoSupabase, GrupoForm, Grupo } from "@/src/types";

const TABELA = "grupos";
const COLUNAS = "id, nome, descricao, esporte, cidade, privado, criado_por, criado_em";

type ApiResult<T> = Promise<{ data: T; error: undefined } | { data: undefined; error: string }>;

export const getMeusGrupos = async (userId: string): ApiResult<GrupoSupabase[]> => {
  const { data, error } = await supabase
    .from(TABELA)
    .select(COLUNAS)
    .eq("criado_por", userId);

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as GrupoSupabase[], error: undefined };
};

export const getGruposPublicos = async (limit = 5): ApiResult<GrupoSupabase[]> => {
  const { data, error } = await supabase
    .from(TABELA)
    .select(COLUNAS)
    .eq("privado", false)
    .limit(limit);

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as GrupoSupabase[], error: undefined };
};

export const getTodosGrupos = async (): ApiResult<Grupo[]> => {
  const { data, error } = await supabase.from(TABELA).select("*");

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as Grupo[], error: undefined };
};

export const postCreateGrupo = async (form: GrupoForm, userId: string): ApiResult<null> => {
  const { error } = await supabase.from(TABELA).insert({
    nome: form.nome,
    descricao: form.descricao || undefined,
    esporte: form.esporte || undefined,
    cidade: form.cidade || undefined,
    privado: form.privado,
    criado_por: userId,
  });

  if (error) return { data: undefined, error: error.message };
  return { data: null, error: undefined };
};

export const countMeusGrupos = async (userId: string): ApiResult<number> => {
  const { count, error } = await supabase
    .from(TABELA)
    .select("id", { count: "exact", head: true })
    .eq("criado_por", userId);

  if (error) return { data: undefined, error: error.message };
  return { data: count ?? 0, error: undefined };
};
