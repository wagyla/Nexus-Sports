import { supabase } from "@/utils/supabase";
import type { EventoSupabase, EventoForm, ParticipanteDisplay } from "@/src/types";
import { iniciaisDoNome, gerarCorAvatar } from "@/src/components/helpers";

const TABELA = "eventos";

type ApiResult<T> = Promise<{ data: T; error: undefined } | { data: undefined; error: string }>;

export const getFeedEventos = async (userId: string): ApiResult<EventoSupabase[]> => {
  const { data: grupos, error: erroGrupos } = await supabase
    .from("grupos")
    .select("id")
    .or(`privado.eq.false,criado_por.eq.${userId}`);

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

export const getIsParticipante = async (eventoId: string, userId: string): Promise<boolean> => {
  const { data } = await supabase
    .from("participantes_evento")
    .select("user_id")
    .eq("evento_id", eventoId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
};

export const postParticiparEvento = async (eventoId: string, userId: string): ApiResult<null> => {
  const { error } = await supabase
    .from("participantes_evento")
    .insert({ evento_id: eventoId, user_id: userId });
  if (error) return { data: undefined, error: error.message };
  return { data: null, error: undefined };
};

export const deleteCancelarParticipacao = async (eventoId: string, userId: string): ApiResult<null> => {
  const { error } = await supabase
    .from("participantes_evento")
    .delete()
    .eq("evento_id", eventoId)
    .eq("user_id", userId);
  if (error) return { data: undefined, error: error.message };
  return { data: null, error: undefined };
};

export const getContagemParticipantes = async (
  eventoIds: string[],
): Promise<Record<string, number>> => {
  if (eventoIds.length === 0) return {};
  const { data, error } = await supabase
    .from("participantes_evento")
    .select("evento_id")
    .in("evento_id", eventoIds);

  if (error) return {};

  const contagem: Record<string, number> = {};
  for (const row of data ?? []) {
    contagem[row.evento_id] = (contagem[row.evento_id] ?? 0) + 1;
  }
  return contagem;
};

export const getParticipantesEvento = async (eventoId: string): ApiResult<ParticipanteDisplay[]> => {
  const { data, error } = await supabase
    .from("participantes_evento")
    .select("user_id")
    .eq("evento_id", eventoId)
    .order("criado_em", { ascending: true });

  if (error) return { data: undefined, error: error.message };

  const userIds = (data ?? []).map((p: any) => p.user_id as string);

  // tenta buscar nomes da tabela profiles (pode não existir)
  let nomesPorId: Record<string, string> = {};
  const { data: perfis } = await supabase
    .from("profiles")
    .select("id, nome")
    .in("id", userIds);
  if (perfis) {
    for (const p of perfis) nomesPorId[p.id] = p.nome ?? "Participante";
  }

  const participantes: ParticipanteDisplay[] = userIds.map((uid) => {
    const nome = nomesPorId[uid] ?? "Participante";
    return {
      userId: uid,
      nome,
      iniciais: iniciaisDoNome(nome),
      corAvatar: gerarCorAvatar(uid),
    };
  });

  return { data: participantes, error: undefined };
};

export const countMeusEventos = async (userId: string): ApiResult<number> => {
  const { count, error } = await supabase
    .from(TABELA)
    .select("id", { count: "exact", head: true })
    .eq("criado_por", userId);

  if (error) return { data: undefined, error: error.message };
  return { data: count ?? 0, error: undefined };
};
