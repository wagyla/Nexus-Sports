import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import Navbar from "@/src/components/Navbar";
import styles from "@/src/styles/feed.styles";

import { mapEvento, iniciaisDoNome } from "@/src/components/helpers";
import type { Evento } from "@/src/types";
import { useAuth } from "@/src/contexts/AuthContext";
import { getFeedEventos } from "@/src/api/eventos";

import FeedHeader from "@/src/components/FeedHeader";
import FeedFiltros from "@/src/components/FeedFiltros";
import EventoCard from "@/src/components/EventoCard";
import ModalEvento from "@/src/components/ModalEvento";

const NOME_ESPORTE: Record<string, string> = {
  corrida: "Corrida",
  ciclismo: "Ciclismo",
  tenis: "Tênis",
  volei: "Vôlei",
  futebol: "Futebol",
  natacao: "Natação",
  outro: "Outro",
};

const nomeFiltro = (esporte: string): string =>
  NOME_ESPORTE[esporte] ?? esporte.charAt(0).toUpperCase() + esporte.slice(1);

const Feed = () => {
  const { user } = useAuth();
  const nome: string = user?.user_metadata?.nome ?? "";
  const iniciais = iniciaisDoNome(nome);

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | undefined>(undefined);
  const [modalEventoVisivel, setModalEventoVisivel] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  
  const carregarEventos = async () => {
    if (!user) return;
    setCarregando(true);

    const { data, error } = await getFeedEventos(user.id);

    if (error) {
      console.error("Erro ao carregar eventos:", error);
    } else {
      setEventos((data ?? []).map(mapEvento));
      setFiltroAtivo("Todos");
    }

    setCarregando(false);
  };

  useEffect(() => {
    carregarEventos();
  }, []);

  const abrirModalEvento = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalEventoVisivel(true);
  };

  const fecharModalEvento = () => setModalEventoVisivel(false);

  const salvarEvento = (id: string, dadosAtualizados: Partial<Evento>) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...dadosAtualizados } : e)),
    );
    setEventoSelecionado((prev) =>
      prev?.id === id ? { ...prev, ...dadosAtualizados } : prev,
    );
  };

  const eventosOrdenados = [
    ...eventos.filter((e) => e.criadorId !== user?.id),
    ...eventos.filter((e) => e.criadorId === user?.id),
  ];

  const esportesUnicos = [...new Set(eventosOrdenados.map((e) => e.esporte).filter(Boolean))];
  const filtros = ["Todos", ...esportesUnicos.map(nomeFiltro), "Seus Eventos"];

  const eventosFiltrados =
    filtroAtivo === "Todos"
      ? eventosOrdenados
      : filtroAtivo === "Seus Eventos"
        ? eventosOrdenados.filter((e) => e.criadorId === user?.id)
        : eventosOrdenados.filter((e) => nomeFiltro(e.esporte) === filtroAtivo);

  return (
    <View style={styles.container}>
      <FeedHeader
        saudacao={nome ? `Olá, ${nome.split(" ")[0]}!` : "Olá!"}
        subtitulo="Eventos perto de você!"
        iniciais={iniciais}
      />

      <FeedFiltros
        filtros={filtros}
        filtroAtivo={filtroAtivo}
        onSelectFiltro={setFiltroAtivo}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {carregando ? (
          <Text style={{ color: "#555", textAlign: "center", marginTop: 40 }}>
            Carregando eventos...
          </Text>
        ) : eventosFiltrados.length === 0 ? (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            Nenhum evento encontrado para "{filtroAtivo}"
          </Text>
        ) : (
          eventosFiltrados.map((evento, index) => (
            <EventoCard
              key={`${evento.id}-${index}`}
              evento={evento}
              onPress={abrirModalEvento}
            />
          ))
        )}
      </ScrollView>

      <Navbar itemAtivo="feed" />

      <ModalEvento
        evento={eventoSelecionado}
        visivel={modalEventoVisivel}
        onFechar={fecharModalEvento}
        onSalvar={salvarEvento}
      />
    </View>
  );
};

export default Feed;
