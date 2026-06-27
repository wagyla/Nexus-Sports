import React from "react";
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
import Navbar from "@/src/componentes/Navbar";
import { faPencil } from "@fortawesome/free-solid-svg-icons";

const usuario = {
  nome: "Leonardo Pinheiro",
  cidade: "Almenara-MG",
  iniciais: "LP",
  eventos: 10,
  grupos: 2,
  conquistas: 8,
  esportesFavoritos: [
    { nome: "Corrida", cor: "#FF4444" },
    { nome: "Capoeira", cor: "#FF8800" },
    { nome: "Vôlei", cor: "#00FFD1" },
    { nome: "Natação", cor: "#FF4444" },
  ],
  atividadesRecentes: [
    {
      titulo: "Corrida Praia",
      data: "12 Abr",
      distancia: "5km",
      status: "Concluído",
    },
    {
      titulo: "Pedalada Matinal",
      data: "12 Abr",
      distancia: "20km",
      status: "Concluído",
    },
    {
      titulo: "Corrida Porto",
      data: "12 Abr",
      distancia: "5km",
      status: "Concluído",
    },
    {
      titulo: "Pilates fisocore",
      data: "12 Abr",
      distancia: "",
      status: "Concluído",
    },
  ],
};

export default function Perfil() {
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
          onPress={() => router.push("/EditarPerfil")}
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
            <Text style={styles.avatarTexto}>{usuario.iniciais}</Text>
          </View>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <Text style={styles.cidade}>{usuario.cidade}</Text>
        </View>

        <View style={styles.estatistica}>
          <View style={styles.cartaoEstat}>
            <Text style={styles.estatNumero}>{usuario.eventos}</Text>
            <Text style={styles.estatRotulo}>Eventos</Text>
          </View>
          <View style={styles.cartaoEstat}>
            <Text style={[styles.estatNumero, { color: "#FF8800" }]}>
              {usuario.grupos}
            </Text>
            <Text style={styles.estatRotulo}>Grupos</Text>
          </View>
          <View style={styles.cartaoEstat}>
            <Text style={[styles.estatNumero, { color: "#00FFD1" }]}>
              {usuario.conquistas}
            </Text>
            <Text style={styles.estatRotulo}>Conquistas</Text>
          </View>
        </View>

        <Text style={styles.secaoTitulo}>Esportes Favoritos</Text>
        <View style={styles.esportes}>
          {usuario.esportesFavoritos.map((esporte, index) => (
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

        <Text style={styles.secaoTitulo}>Atividades Recentes</Text>
        {usuario.atividadesRecentes.map((atividade, index) => (
          <View key={index} style={styles.card}>
            <View>
              <Text style={styles.cardTitulo}>{atividade.titulo}</Text>
              <Text style={styles.cardDetalhe}>
                {atividade.data}
                {atividade.distancia ? ` · ${atividade.distancia}` : ""}
              </Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagTexto}>{atividade.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Navbar itemAtivo="perfil" />
    </View>
  );
}

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
});
