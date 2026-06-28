import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import Navbar from "@/src/components/Navbar";
import GrupoCard from "@/src/components/GrupoCard";
import ModalGrupo from "@/src/components/ModalGrupo";
import type { GrupoSupabase, GrupoDisplay } from "@/src/types";
import { useAuth } from "@/src/contexts/AuthContext";
import { getMeusGrupos, getGruposPublicos, getGruposParticipando } from "@/src/api/grupos";

const mapGrupo = (g: GrupoSupabase, isAdmin: boolean): GrupoDisplay => ({
  id: g.id,
  nome: g.nome ?? "Sem nome",
  esporte: g.esporte ?? "Geral",
  local: g.cidade ?? "-",
  descricao: g.descricao ?? "",
  membros: g.membros_grupos?.[0]?.count ?? 0,
  eventos: g.eventos?.[0]?.count ?? 0,
  isAdmin,
  participantes: [],
  coresAvatar: [],
});

const Groups = () => {
  const { user } = useAuth();
  const [meusGrupos, setMeusGrupos] = useState<GrupoDisplay[]>([]);
  const [gruposPublicos, setGruposPublicos] = useState<GrupoDisplay[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoDisplay | undefined>(undefined);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [isMembro, setIsMembro] = useState(false);

  const carregarGrupos = async () => {
    if (!user) return;
    setCarregando(true);

    const [
      { data: criados, error: erroCriados },
      { data: participando, error: erroParticipando },
      { data: publicos, error: erroPublicos },
    ] = await Promise.all([
      getMeusGrupos(user.id),
      getGruposParticipando(user.id),
      getGruposPublicos(),
    ]);

    if (erroCriados) console.error("Erro nos meus grupos:", erroCriados);
    if (erroParticipando) console.error("Erro nos grupos participando:", erroParticipando);
    if (erroPublicos) console.error("Erro nos grupos públicos:", erroPublicos);

    const criadosIds = new Set((criados ?? []).map((g) => g.id));
    const participandoSemDuplicatas = (participando ?? []).filter((g) => !criadosIds.has(g.id));

    const meusIds = new Set([
      ...(criados ?? []).map((g) => g.id),
      ...(participando ?? []).map((g) => g.id),
    ]);

    setMeusGrupos([
      ...(criados ?? []).map((g: GrupoSupabase) => mapGrupo(g, true)),
      ...participandoSemDuplicatas.map((g: GrupoSupabase) => mapGrupo(g, false)),
    ]);
    setGruposPublicos(
      (publicos ?? [])
        .filter((g) => !meusIds.has(g.id))
        .map((g: GrupoSupabase) => mapGrupo(g, false))
    );

    setCarregando(false);
  };

  useEffect(() => {
    carregarGrupos();
  }, []);

  const abrirModal = (grupo: GrupoDisplay, membro: boolean) => {
    setGrupoSelecionado(grupo);
    setIsMembro(membro);
    setModalVisivel(true);
  };

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Grupos</Text>
          <TouchableOpacity
            style={estilos.botaoNovo}
            onPress={() => router.push("/(app)/groups/new")}
            activeOpacity={0.7}
          >
            <Text style={estilos.botaoNovoTexto}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        <Text style={estilos.secaoTitulo}>Meus Grupos</Text>

        {carregando ? (
          <ActivityIndicator color="#00FFD1" style={{ marginTop: 24 }} />
        ) : meusGrupos.length === 0 ? (
          <Text style={estilos.textoVazio}>Você ainda não criou nenhum grupo.</Text>
        ) : (
          meusGrupos.map((grupo) => (
            <GrupoCard
              key={grupo.id}
              grupo={grupo}
              tipo="meu"
              onPress={() => abrirModal(grupo, true)}
            />
          ))
        )}

        <Text style={estilos.secaoTitulo}>Descobrir Grupos</Text>

        {!carregando && gruposPublicos.length === 0 ? (
          <Text style={estilos.textoVazio}>Nenhum grupo público disponível.</Text>
        ) : (
          gruposPublicos.map((grupo) => (
            <GrupoCard
              key={grupo.id}
              grupo={grupo}
              tipo="publico"
              onPress={() => abrirModal(grupo, false)}
            />
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Navbar itemAtivo="grupos" />

      <ModalGrupo
        grupo={grupoSelecionado}
        visivel={modalVisivel}
        isMembro={isMembro}
        onFechar={() => setModalVisivel(false)}
        onDeletado={carregarGrupos}
        onEntrou={carregarGrupos}
      />
    </View>
  );
};

export default Groups;

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 40 },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  botaoNovo: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  botaoNovoTexto: { color: "#ffffff", fontSize: 14 },
  secaoTitulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    letterSpacing: 0.5,
  },
  textoVazio: {
    color: "#555",
    fontSize: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
