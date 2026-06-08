import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faUsers, faPlus } from "@fortawesome/free-solid-svg-icons";
import Navbar from "@/src/componentes/Navbar";
import { router } from "expo-router";

const meusGrupos = [
  {
    id: 1,
    nome: "Corredores Almenara",
    membros: 48,
    eventos: 5,
    isAdmin: true,
    emoji: "🏃",
  },
  {
    id: 2,
    nome: "Vôlei em Jequi",
    membros: 15,
    eventos: 1,
    isAdmin: true,
    emoji: "🏐",
  },
  {
    id: 2,
    nome: "Vôlei em Jequi",
    membros: 15,
    eventos: 1,
    isAdmin: true,
    emoji: "🏐",
  },
];

const descobrirGrupos = [
  { id: 3, nome: "Ciclistas Jequi", membros: 23, emoji: "🚴" },
  { id: 4, nome: "Futsal", membros: 15, emoji: "⚽" },
  { id: 4, nome: "Futsal", membros: 15, emoji: "⚽" },
  { id: 4, nome: "Futsal", membros: 15, emoji: "⚽" },
  { id: 3, nome: "Ciclistas Jequi", membros: 23, emoji: "🚴" },
];

export default function GruposScreen() {
  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Grupos</Text>
          <TouchableOpacity
            style={estilos.botaoNovo}
            onPress={() => router.push("/CriarGrupoScreen")}
          >
            <Text style={estilos.botaoNovoTexto}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        <Text style={estilos.secaoTitulo}>Meus Grupos</Text>

        {meusGrupos.map((grupo) => (
          <TouchableOpacity key={grupo.id} style={estilos.card}>
            <View style={estilos.cardIcone}>
              <Text style={estilos.cardIconeEmoji}>{grupo.emoji}</Text>
            </View>

            <View style={estilos.cardInfo}>
              <Text style={estilos.cardNome}>{grupo.nome}</Text>
              <Text style={estilos.cardDetalhe}>
                {grupo.membros} membros · {grupo.eventos} evento
                {grupo.eventos > 1 ? "s" : ""}
              </Text>

              {grupo.isAdmin && (
                <View style={estilos.badgeAdmin}>
                  <Text style={estilos.badgeAdminTexto}>Admin</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={estilos.secaoTitulo}>Descobrir Grupos</Text>

        {descobrirGrupos.map((grupo) => (
          <TouchableOpacity key={grupo.id} style={estilos.card}>
            <View style={estilos.cardIcone}>
              <Text style={estilos.cardIconeEmoji}>{grupo.emoji}</Text>
            </View>

            <View style={estilos.cardInfo}>
              <Text style={estilos.cardNome}>{grupo.nome}</Text>
              <Text style={estilos.cardDetalhe}>{grupo.membros} membros</Text>
            </View>

            <TouchableOpacity style={estilos.botaoEntrar}>
              <Text style={estilos.botaoEntrarTexto}>Entrar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Navbar itemAtivo="grupos" />
    </View>
  );
}

export const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
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
    fontSize: 14,
    color: "#888888",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#252525",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIconeEmoji: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardNome: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  cardDetalhe: { color: "#888888", fontSize: 13, marginTop: 2 },
  badgeAdmin: {
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  badgeAdminTexto: { color: "#4ecca3", fontSize: 12, fontWeight: "600" },
  botaoEntrar: {
    borderWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  botaoEntrarTexto: { color: "#ffffff", fontSize: 14 },
});
