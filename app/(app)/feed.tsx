import { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { supabase } from "@/utils/supabase";
import Navbar from "@/src/components/Navbar";
import styles from "@/src/styles/feed.styles";

import { mapEvento } from "@/src/components/helpers";
import type { Evento, EventoSupabase } from "@/src/types";

import FeedHeader from "@/src/components/FeedHeader";
import FeedFiltros from "@/src/components/FeedFiltros";
import EventoCard from "@/src/components/EventoCard";
import ModalEvento from "@/src/components/ModalEvento";
import ModalSelecionarGrupo from "@/src/components/ModalSelecionarGrupo";

const FILTROS = ["Todos", "Corrida", "Ciclismo", "Tênis", "Vôlei"];

const Feed = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(
    null,
  );
  const [modalEventoVisivel, setModalEventoVisivel] = useState(false);
  const [modalGrupoVisivel, setModalGrupoVisivel] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");
  const [nomeUsuario, setNomeUsuario] = useState("");

  const carregarUsuario = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("usuarios")
      .select("nome")
      .eq("id", user.id)
      .single();
    if (data?.nome) setNomeUsuario(data.nome);
  };

  const carregarEventos = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from("eventos")
      .select("*, grupos(nome), criador:usuarios!criador_id(id, nome)")
      .order("data_hora", { ascending: true });

    if (error) {
      console.error("Erro ao carregar eventos:", error.message);
    } else if (data && data.length > 0) {
      setEventos((data as EventoSupabase[]).map(mapEvento));
    }
    setCarregando(false);
  };

  useEffect(() => {
    carregarUsuario();
    carregarEventos();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      carregarUsuario();
      carregarEventos();
    });

    return () => subscription.unsubscribe();
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

  const eventosFiltrados =
    filtroAtivo === "Todos"
      ? eventos
      : eventos.filter((e) => e.esporte === filtroAtivo);

  return (
    <View style={styles.container}>
      <FeedHeader
        saudacao={nomeUsuario ? `Olá, ${nomeUsuario.split(" ")[0]}!` : "Olá!"}
        subtitulo="Eventos perto de você!"
        iniciais={nomeUsuario
          .split(" ")
          .slice(0, 2)
          .map((p) => p[0])
          .join("")
          .toUpperCase()}
      />

      <FeedFiltros
        filtros={FILTROS}
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

      <Navbar
        itemAtivo="feed"
        onNovoEvento={() => setModalGrupoVisivel(true)}
      />

      <ModalEvento
        evento={eventoSelecionado}
        visivel={modalEventoVisivel}
        onFechar={fecharModalEvento}
        onSalvar={salvarEvento}
      />

      <ModalSelecionarGrupo
        visivel={modalGrupoVisivel}
        onFechar={() => setModalGrupoVisivel(false)}
      />
    </View>
  );
};

export default Feed;
