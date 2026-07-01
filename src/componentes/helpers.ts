import { LocaleConfig } from "react-native-calendars";
import type { EventoSupabase, Evento } from "@/src/types";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faPersonRunning,
  faPersonBiking,
  faTableTennisPaddleBall,
  faVolleyball,
  faFutbol,
  faPersonSwimming,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

LocaleConfig.locales["pt"] = {
  monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
  monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  dayNames: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
};
LocaleConfig.defaultLocale = "pt";

export const COR_ESPORTE: Record<string, string> = {
  corrida: "#FF4444",
  ciclismo: "#FF8800",
  tenis: "#00CC88",
  volei: "#0088FF",
  futebol: "#22AA44",
  natacao: "#00AAFF",
  outro: "#8855FF",
};

export const EMOJI_ESPORTE: Record<string, string> = {
  corrida: "🏃",
  ciclismo: "🚴",
  tenis: "🎾",
  volei: "🏐",
  futebol: "⚽",
  natacao: "🏊",
  outro: "🏅",
};

export const USUARIO_ATUAL = { iniciais: "", nome: "" };

export const hojeISO = new Date().toISOString().split("T")[0];

export const ICONE_ESPORTE: Record<string, IconDefinition> = {
  corrida: faPersonRunning,
  ciclismo: faPersonBiking,
  tenis: faTableTennisPaddleBall,
  volei: faVolleyball,
  futebol: faFutbol,
  natacao: faPersonSwimming,
  outro: faMedal,
};

export const corDoEsporte = (esporte: string): string =>
  COR_ESPORTE[esporte?.toLowerCase()] ?? "#8855FF";

const CORES_AVATAR = [
  "#6c63ff", "#ff6584", "#43b89c", "#f7b731", "#e84393",
  "#00adb5", "#ff5722", "#3f51b5", "#009688", "#9c27b0",
];

export const gerarCorAvatar = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return CORES_AVATAR[Math.abs(hash) % CORES_AVATAR.length];
};

export const emojiDoEsporte = (esporte: string): string =>
  EMOJI_ESPORTE[esporte?.toLowerCase()] ?? "🏅";

export const iconeDoEsporte = (esporte: string): IconDefinition =>
  ICONE_ESPORTE[esporte?.toLowerCase()] ?? faMedal;

export const iniciaisDoNome = (nome: string): string =>
  (nome ?? "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

export const formatarDataCurta = (dataISO: string): string => {
  const [, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}`;
};

export const formatarDataCompleta = (dataISO: string): string => {
  const [ano, mes, dia] = dataISO.split("-");
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return `${diasSemana[d.getDay()]}, ${dia}/${mes}/${ano}`;
};

export const mapEvento = (e: EventoSupabase): Evento => {
  const dataISO = e.data_hora?.split("T")[0] ?? "";
  const hora = e.data_hora?.split("T")[1]?.slice(0, 5) ?? "00:00";
  const participantesCount = e.participantes_evento?.[0]?.count ?? 0;

  return {
    id: String(e.id),
    esporte: e.esporte ?? "",
    cor: corDoEsporte(e.esporte),
    nome: e.nome ?? "",
    dataISO,
    hora,
    endereco: e.endereco ?? "",
    cidade: e.cidade ?? "",
    participantes: [],
    coresAvatar: [],
    total: e.vagas ?? 0,
    participantesCount,
    grupo: e.grupos?.nome ?? "",
    criador: {
      iniciais: "",
      nome: "",
      corAvatar: "#6c63ff",
    },
    criadorId: e.criado_por ?? e.criador_id ?? "",
    descricao: e.descricao ?? "",
  };
};
