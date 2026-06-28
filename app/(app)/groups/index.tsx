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
import { supabase } from "@/utils/supabase";
import Navbar from "@/src/components/Navbar";
import GrupoCard from "@/src/components/GrupoCard";
import ModalGrupo from "@/src/components/ModalGrupo";
import type { GrupoSupabase, GrupoDisplay } from "@/src/types";
import { SupabaseTablesEnum } from "@/utils/Enums";

const COLUNAS_GRUPO =
  "id, nome, descricao, esporte, cidade, privado, criador_id, criado_em";

const mapGrupo = (g: GrupoSupabase, isAdmin: boolean): GrupoDisplay => ({
  id: g.id,
  nome: g.nome ?? "Sem nome",
  esporte: g.esporte ?? "Geral",
  local: g.cidade ?? "-",
  descricao: g.descricao ?? "",
  membros: 0,
  eventos: 0,
  isAdmin,
  participantes: [],
  coresAvatar: [],
});

const Groups = () => {
  const [meusGrupos, setMeusGrupos] = useState<GrupoDisplay[]>([]);
  const [descobrirGrupos, setDescobrirGrupos] = useState<GrupoDisplay[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoDisplay | null>(
    null,
  );
  const [modalVisivel, setModalVisivel] = useState(false);
  const [isMembro, setIsMembro] = useState(false);

  const carregarGrupos = async () => {
    setCarregando(true);

    const user = { id: 1 };

    if (!user) {
      setCarregando(false);
      return;
    }

    const [
      { data: meus, error: erroMeus },
      { data: publicos, error: erroPublicos },
    ] = await Promise.all([
      supabase.from(SupabaseTablesEnum.GRUPOS).select(COLUNAS_GRUPO),
      supabase
        .from("grupos")
        .select(COLUNAS_GRUPO)
        .eq("privado", false)
        .limit(5),
    ]);

    if (erroMeus) console.error("Erro nos meus grupos:", erroMeus.message);
    if (erroPublicos)
      console.error("Erro nos grupos públicos:", erroPublicos.message);

    setMeusGrupos((meus ?? []).map((g) => mapGrupo(g as GrupoSupabase, true)));
    setDescobrirGrupos(
      (publicos ?? []).map((g) => mapGrupo(g as GrupoSupabase, false)),
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
          <Text style={estilos.textoVazio}>
            Você ainda não criou nenhum grupo.
          </Text>
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

        {!carregando && descobrirGrupos.length === 0 ? (
          <Text style={estilos.textoVazio}>
            Nenhum grupo público disponível.
          </Text>
        ) : (
          descobrirGrupos.map((grupo) => (
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
