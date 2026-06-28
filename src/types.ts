
export type CreateSessionType = {
  email: string;
  password: string;
}

export type UserType = {
  id: number;
  email: string;
  role: string;
  phone: string;

}
export type EventoSupabase = {
  id: string;
  nome: string;
  esporte: string;
  data_hora: string;
  endereco: string | null;
  cidade: string | null;
  descricao: string | null;
  grupo_id: string | null;
  criador_id: string | null;
  criado_por: string | null;
  vagas: number | null;
  grupos: { nome: string } | null;
  participantes_evento?: { count: number }[];
};

export type ParticipanteDisplay = {
  userId: string;
  nome: string;
  iniciais: string;
  corAvatar: string;
};

export type GrupoSupabase = {
  id: string;
  nome?: string;
  descricao?: string;
  esporte?: string;
  cidade?: string;
  privado?: boolean;
  criado_por?: string;
  criado_em?: string;
  membros_grupos?: { count: number }[];
  eventos?: { count: number }[];
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
  participantesCount: number;
  grupo: string;
  criador: { iniciais: string; nome: string; corAvatar: string };
  criadorId: string;
  descricao: string;
};

export type Grupo = {
  id: string;
  nome: string;
  esporte?: string;
  emoji?: string;
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

export type GrupoForm = {
  nome: string;
  descricao: string;
  esporte: string;
  cidade: string;
  privado: boolean;
};

export type EventoForm = {
  nome: string;
  descricao: string;
  esporte: string;
  endereco: string;
  cidade: string;
  data: string;
  hora: string;
  vagas: string;
};
