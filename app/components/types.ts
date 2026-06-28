export type EventoSupabase = {
  id: string;
  nome: string;
  esporte: string;
  data_hora: string;
  endereco: string | null;
  cidade: string | null;
  descricao: string | null;
  grupo_id: string | null;
  criador_id: string;
  vagas: number | null;
  grupos: { nome: string } | null;
  criador: { id: string; nome: string } | null;
};

export type Evento = {
  id: string;
  esporte: string;
  cor: string;
  nome: string;
  dataISO: string;
  hora: string;
  endereco: string;
  cidade: string;
  participantes: string[];
  coresAvatar: string[];
  total: number;
  grupo: string;
  criador: { iniciais: string; nome: string; corAvatar: string };
  descricao: string;
};

export type Grupo = {
  id: string;
  nome: string;
  esporte: string | null;
  emoji?: string | null;
};

export type GrupoSupabase = {
  id: string;
  nome?: string;
  descricao?: string;
  esporte?: string;
  cidade?: string;
  privado?: boolean;
  criador_id?: string;
  criado_em?: string;
};

export type GrupoDisplay = {
  id: string;
  nome: string;
  esporte: string;
  local: string;
  descricao: string;
  membros: number;
  eventos: number;
  isAdmin: boolean;
  participantes: string[];
  coresAvatar: string[];
};
