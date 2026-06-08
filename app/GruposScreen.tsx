import React from "react";
import { View, Text, ScrollView, StatusBar } from "react-native";

const meusGrupos = [
  {
    id: 1,
    nome: "Corredores Almenara",
    membros: 48,
    eventos: 5,
    isAdmin: true,
  },
  { id: 2, nome: "Vôlei em Jequi", membros: 15, eventos: 1, isAdmin: true },
];

const descobrirGrupos = [
  { id: 3, nome: "Ciclistas jequi", membros: 23 },
  { id: 4, nome: "Futsal", membros: 19 },
];

export default function GruposScreen() {
  return (
    <View>
      <StatusBar />
    </View>
  );
}
