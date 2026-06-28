import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Navbar from "@/src/components/Navbar";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import ModalEventosPerfil from "@/src/components/ModalEventosPerfil";
import ModalGruposPerfil from "@/src/components/ModalGruposPerfil";

import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { corDoEsporte, iniciaisDoNome } from "@/src/components/helpers";

type AtividadeEvento = {
  titulo: string;
  data: string;
  distancia: string;
  status: string;
};

type GrupoPerfil = {
  nome: string;
  esporte: string;
  membros: number;
};

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];


const Profile = () => {
  const { user } = useAuth();
  const [eventos, setEventos] = useState<AtividadeEvento[]>([]);
  const [grupos, setGrupos] = useState<GrupoPerfil[]>([]);
  const [modalEventosVisivel, setModalEventosVisivel] = useState(false);
  const [modalGruposVisivel, setModalGruposVisivel] = useState(false);


  const nome: string = user?.user_metadata?.nome ?? "";
  const cidade: string = user?.user_metadata?.cidade ?? "";
  const iniciais = iniciaisDoNome(nome);
  const esportesRaw: string[] = user?.user_metadata?.esportes ?? [];
  const esportesFavoritos = esportesRaw.map((e) => ({
    nome: e.charAt(0).toUpperCase() + e.slice(1),
    cor: corDoEsporte(e),
  }));

  useEffect(() => {
    if (!user) return;

    const carregarEventos = async () => {
      const { data } = await supabase
        .from("eventos")
        .select("nome, data_hora")
        .eq("criador_id", user.id)
        .order("data_hora", { ascending: false });

      if (data) {
        setEventos(
          data.map((e) => {
            const iso = (e.data_hora ?? "").split("T")[0];
            const [, mes, dia] = iso.split("-");
            const dataFormatada =
              dia && mes ? `${dia} ${MESES[Number(mes) - 1]}` : "";
            const passado = new Date(e.data_hora) < new Date();
            return {
              titulo: e.nome ?? "",
              data: dataFormatada,
              distancia: "",
              status: passado ? "Concluído" : "Agendado",
            };
          })
        );
      }
    };

    const carregarGrupos = async () => {
      const { data } = await supabase
        .from("grupos")
        .select("nome, esporte")
        .eq("criador_id", user.id);

      if (data) {
        setGrupos(
          data.map((g) => ({
            nome: g.nome ?? "",
            esporte: g.esporte ?? "outro",
            membros: 0,
          }))
        );
      }
    };

    carregarEventos();
    carregarGrupos();
  }, [user]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />
      <View style={styles.cabecalho}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          onPress={() => router.back()}
        >
          <Text style={styles.botaoVoltarTexto}>‹</Text>
          <Text style={styles.titulo}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.botaoEditar}
          onPress={() => router.push("/(app)/profile/edit")}
        >
          <FontAwesomeIcon icon={faPencil} size={14} color="#00FFD1" />
          <Text style={styles.botaoEditarTexto}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTexto}>{iniciais}</Text>
          </View>
          <Text style={styles.nome}>{nome}</Text>
          {!!cidade && <Text style={styles.cidade}>{cidade}</Text>}
        </View>

        <View style={styles.estatistica}>
          <TouchableOpacity
            style={styles.cartaoEstat}
            onPress={() => setModalEventosVisivel(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.estatNumero}>{eventos.length}</Text>
            <Text style={styles.estatRotulo}>Eventos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartaoEstat}
            onPress={() => setModalGruposVisivel(true)}
            activeOpacity={0.7}
          >
            <Text style={[styles.estatNumero, { color: "#FF8800" }]}>
              {grupos.length}
            </Text>
            <Text style={styles.estatRotulo}>Grupos</Text>
          </TouchableOpacity>
        </View>

        {esportesFavoritos.length > 0 && (
          <>
            <Text style={styles.secaoTitulo}>Esportes Favoritos</Text>
            <View style={styles.esportes}>
              {esportesFavoritos.map((esporte, index) => (
                <View
                  key={index}
                  style={[
                    styles.esporteTag,
                    { backgroundColor: esporte.cor + "33" },
                  ]}
                >
                  <Text style={[styles.esporteTexto, { color: esporte.cor }]}>
                    {esporte.nome}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        {eventos.length > 0 && (
          <>
            <Text style={styles.secaoTitulo}>Atividades Recentes</Text>
            {eventos.slice(0, 4).map((evento, index) => (
              <View key={index} style={styles.card}>
                <View>
                  <Text style={styles.cardTitulo}>{evento.titulo}</Text>
                  <Text style={styles.cardDetalhe}>
                    {evento.data}
                    {evento.distancia ? ` · ${evento.distancia}` : ""}
                  </Text>
                </View>
                <View
                  style={[
                    styles.tag,
                    evento.status === "Agendado" && styles.tagAgendado,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagTexto,
                      evento.status === "Agendado" && styles.tagTextoAgendado,
                    ]}
                  >
                    {evento.status}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Navbar itemAtivo="perfil" />

      <ModalEventosPerfil
        visivel={modalEventosVisivel}
        onFechar={() => setModalEventosVisivel(false)}
        eventos={eventos}
      />
      <ModalGruposPerfil
        visivel={modalGruposVisivel}
        onFechar={() => setModalGruposVisivel(false)}
        grupos={grupos}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: 60,
    paddingHorizontal: 10,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  botaoVoltarTexto: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -4,
  },
  titulo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  botaoEditar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  botaoEditarTexto: {
    color: "#00FFD1",
    fontSize: 14,
    fontWeight: "600",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#00FFD133",
    borderWidth: 1.5,
    borderColor: "#00FFD1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarTexto: {
    color: "#00FFD1",
    fontSize: 26,
    fontWeight: "bold",
  },
  nome: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cidade: {
    color: "#888888",
    fontSize: 13,
    marginTop: 4,
  },
  estatistica: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  cartaoEstat: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  estatNumero: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  estatRotulo: {
    color: "#888888",
    fontSize: 12,
    marginTop: 4,
  },
  secaoTitulo: {
    color: "#888888",
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },
  esportes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  esporteTag: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  esporteTexto: {
    fontSize: 13,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitulo: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardDetalhe: {
    color: "#888888",
    fontSize: 13,
    marginTop: 4,
  },
  tag: {
    backgroundColor: "#00FFD133",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  tagTexto: {
    color: "#00FFD1",
    fontSize: 12,
    fontWeight: "bold",
  },
  tagAgendado: {
    backgroundColor: "#FF880033",
  },
  tagTextoAgendado: {
    color: "#FF8800",
  },
});
