import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import styles from "./feedStyle";
import Navbar from "@/src/componentes/Navbar";
import { router } from "expo-router";
import React from "react";
const eventos = [
  {
    id: "1",
    esporte: "Corrida",
    cor: "#FF4444",
    nome: "Corrida na Praia",
    data: "Sex",
    hora: "06:30",
    endereco: "Praia da saudade",
    participantes: ["LP", "LC", "WM"],
    total: 10,
    descricao:
      "Corrida de 5 km saindo da Praia da Saudade e chegada no Aeroporto. Percurso plano, ideal para iniciantes e intermediários.",
  },
  {
    id: "2",
    esporte: "Ciclismo",
    cor: "#FF8800",
    nome: "Pedalada Matinal",
    data: "Sáb",
    hora: "06:30",
    endereco: "Av. Olindo de Miranda ",
    participantes: ["LP", "LC", "WM"],
    total: 10,
    descricao:
      "Pedalada leve de 20 km pela orla da cidade. Traga sua bike e boa disposição! Ponto de encontro na entrada da Av. Olindo de Miranda.",
  },
  {
    id: "1",
    esporte: "Corrida",
    cor: "#FF4444",
    nome: "Corrida na Praia",
    data: "Sex",
    hora: "06:30",
    endereco: "Praia da saudade",
    participantes: ["LP", "LC", "WM"],
    total: 10,
    descricao:
      "Corrida de 5 km saindo da Praia da Saudade e chegada no Aeroporto. Percurso plano, ideal para iniciantes e intermediários.",
  },
  {
    id: "2",
    esporte: "Ciclismo",
    cor: "#FF8800",
    nome: "Pedalada Matinal",
    data: "Sáb",
    hora: "06:30",
    endereco: "Av. Olindo de Miranda",
    participantes: ["LP", "LC", "WM"],
    total: 10,
    descricao:
      "Pedalada leve de 20 km pela orla da cidade. Traga sua bike e boa disposição! Ponto de encontro na entrada da Av. Olindo de Miranda.",
  },
];

export default function Feed() {
  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Olá, Léo!</Text>
          <Text style={styles.subtitulo}> Eventos perto de você!</Text>
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/Perfil")}
        >
          <Text style={styles.avatarTexto}>LP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.filtros}>
        <TouchableOpacity style={[styles.tag, styles.tagAtiva]}>
          <Text style={styles.tagTextoAtivo}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagTexto}>Corrida</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagTexto}>Tênis</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tag}>
          <Text style={styles.tagTexto}>Vôlei</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {eventos.map((evento) => (
          <View key={evento.id} style={styles.card}>
            <View style={styles.cardTopo}>
              <View
                style={[
                  styles.esporteTag,
                  { backgroundColor: evento.cor + "33" },
                ]}
              >
                <Text style={[styles.esporteTexto, { color: evento.cor }]}>
                  {evento.esporte}
                </Text>
              </View>
              <View style={styles.dataHora}>
                <Text style={styles.data}>{evento.data}</Text>
                <Text style={styles.separador}>*</Text>
                <Text style={styles.hora}>{evento.hora}</Text>
              </View>
            </View>
            <Text style={styles.nomeEvento}>{evento.nome}</Text>
            <Text style={styles.endereco}>{evento.endereco}</Text>
            <View style={styles.cardRodape}>
              <View style={styles.participantes}>
                {evento.participantes.map((p, i) => (
                  <View
                    key={i}
                    style={[
                      styles.miniAvatar,
                      { marginLeft: i === 0 ? 0 : -8 },
                    ]}
                  >
                    <Text style={styles.miniAvatarTexto}>{p}</Text>
                  </View>
                ))}
                <Text style={styles.totalParticipantes}>+{evento.total}</Text>
              </View>
              <TouchableOpacity style={styles.botaoVer}>
                <Text style={styles.botaoVerTexto}>Ver</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Navbar itemAtivo="feed" />
    </View>
  );
}
