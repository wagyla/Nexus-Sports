import { ContatoType } from "@/src/tipos/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Avatar from "./Avatar";

type ContatoProps = {
  contato: ContatoType;
};

export default function Contato({ contato }: ContatoProps) {
  return (
    <View style={styles.container1}>
      <Avatar aoTocar={() => alert(contato.nome)}/>
      <View style={styles.container2}>
        <Text style={styles.nome}>{contato.nome}</Text>
        <Text style={styles.telefone}>
          {contato.telefone || "Telefone não informado"}
        </Text>
        <Text>{contato.online ? "Online" : "Offline"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container1: {
    flexDirection: "row",
    gap: 10,
    padding: 5,
  },
  container2: {
    justifyContent: "center",
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  telefone: {
    fontSize: 18,
    color: "#919191ff",
  },
});
