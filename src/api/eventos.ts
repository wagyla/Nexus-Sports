import { supabase } from "@/utils/supabase";
import type { EventoSupabase, EventoForm } from "@/src/types";

const TABELA = "eventos";

type ApiResult<T> = Promise<{ data: T; error: undefined } | { data: undefined; error: string }>;

export const getFeedEventos = async (userId: string): ApiResult<EventoSupabase[]> => {
  const { data: grupos, error: erroGrupos } = await supabase
    .from("grupos")
    .select("id")
    .eq("criado_por", userId);

  if (erroGrupos) return { data: undefined, error: erroGrupos.message };

  const grupoIds = (grupos ?? []).map((g: { id: string }) => g.id);

  if (grupoIds.length === 0) return { data: [], error: undefined };

  const { data, error } = await supabase
    .from(TABELA)
    .select("*, grupos(nome)")
    .in("grupo_id", grupoIds)
    .order("criado_em", { ascending: false });

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as EventoSupabase[], error: undefined };
};

export const postCreateEvento = async (
  form: EventoForm,
  grupoId: string,
  userId: string,
): ApiResult<null> => {
  const { error } = await supabase.from(TABELA).insert({
    grupo_id: grupoId,
    criado_por: userId,
    nome: form.nome.trim(),
    descricao: form.descricao.trim() || undefined,
    esporte: form.esporte || undefined,
    endereco: form.endereco.trim() || undefined,
    cidade: form.cidade.trim() || undefined,
    data_hora: form.data && form.hora ? `${form.data}T${form.hora}:00` : undefined,
    vagas: form.vagas ? parseInt(form.vagas, 10) : undefined,
    status: "ativo",
  });

  if (error) return { data: undefined, error: error.message };
  return { data: null, error: undefined };
};

export const getMeusEventosPaginados = async (
  userId: string,
  pagina: number,
  porPagina = 10,
): ApiResult<EventoSupabase[]> => {
  const { data, error } = await supabase
    .from(TABELA)
    .select("*")
    .eq("criado_por", userId)
    .order("data_hora", { ascending: false })
    .range(pagina * porPagina, (pagina + 1) * porPagina - 1);

  if (error) return { data: undefined, error: error.message };
  return { data: (data ?? []) as EventoSupabase[], error: undefined };
};

export const countMeusEventos = async (userId: string): ApiResult<number> => {
  const { count, error } = await supabase
    .from(TABELA)
    .select("id", { count: "exact", head: true })
    .eq("criado_por", userId);

  if (error) return { data: undefined, error: error.message };
  return { data: count ?? 0, error: undefined };
};
