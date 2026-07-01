import { supabase } from "@/utils/supabase";
import type { GrupoSupabase, GrupoForm, Grupo } from "@/src/types";

const TABELA = "grupos";
const COLUNAS = "id, nome, descricao, esporte, cidade, privado, criado_por, criado_em, membros_grupos(count), eventos(count)";

type ApiResult<T> = Promise<{ data: T; error: undefined } | { data: undefined; error: string }>;

export const getMeusGrupos = async (userId: string): ApiResult<GrupoSupabase[]> => {
  const { data, error } = await supabase
    .from(TABELA)
    .select(COLUNAS)
    .eq("criado_por", userId);

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as GrupoSupabase[], error: undefined };
};

export const getGruposPublicos = async (): ApiResult<GrupoSupabase[]> => {
  const { data, error } = await supabase
    .from(TABELA)
    .select(COLUNAS)
    .eq("privado", false);

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

export const getGruposParticipando = async (userId: string): ApiResult<GrupoSupabase[]> => {
  const { data: membros, error: erroMembros } = await supabase
    .from("membros_grupos")
    .select("grupo_id")
    .eq("user_id", userId);

  if (erroMembros) return { data: undefined, error: erroMembros.message };

  const grupoIds = (membros ?? []).map((m: { grupo_id: string }) => m.grupo_id);
  if (grupoIds.length === 0) return { data: [], error: undefined };

  const { data, error } = await supabase
    .from(TABELA)
    .select(COLUNAS)
    .in("id", grupoIds);

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as GrupoSupabase[], error: undefined };
};

export const deleteSairDoGrupo = async (grupoId: string, userId: string): ApiResult<null> => {
  const { error } = await supabase
    .from("membros_grupos")
    .delete()
    .eq("grupo_id", grupoId)
    .eq("user_id", userId);

  if (error) return { data: undefined, error: error.message };
  return { data: null, error: undefined };
};

export const postEntrarGrupo = async (grupoId: string, userId: string): ApiResult<null> => {
  const { error } = await supabase
    .from("membros_grupos")
    .insert({ grupo_id: grupoId, user_id: userId });

  if (error) return { data: undefined, error: error.message };
  return { data: null, error: undefined };
};

export const deleteGrupo = async (grupoId: string, userId: string): ApiResult<null> => {
  // 1. Busca IDs dos eventos do grupo para deletar participantes
  const { data: eventosDogGrupo } = await supabase
    .from("eventos")
    .select("id")
    .eq("grupo_id", grupoId);

  const eventoIds = (eventosDogGrupo ?? []).map((e: { id: string }) => e.id);

  // 2. Deleta participantes dos eventos
  if (eventoIds.length > 0) {
    const { error: erroParticipantes } = await supabase
      .from("participantes_evento")
      .delete()
      .in("evento_id", eventoIds);
    if (erroParticipantes) return { data: undefined, error: erroParticipantes.message };
  }

  // 3. Deleta os eventos
  const { error: erroEventos } = await supabase
    .from("eventos")
    .delete()
    .eq("grupo_id", grupoId);
  if (erroEventos) return { data: undefined, error: erroEventos.message };

  // 4. Deleta membros do grupo
  const { error: erroMembros } = await supabase
    .from("membros_grupos")
    .delete()
    .eq("grupo_id", grupoId);
  if (erroMembros) return { data: undefined, error: erroMembros.message };

  // 5. Deleta o grupo
  const { error } = await supabase
    .from(TABELA)
    .delete()
    .eq("id", grupoId)
    .eq("criado_por", userId);
  if (error) return { data: undefined, error: error.message };

  return { data: null, error: undefined };
};
