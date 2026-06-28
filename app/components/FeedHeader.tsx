import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import styles from "../feedStyle";

type Props = {
  saudacao: string;
  subtitulo: string;
  iniciais: string;
};

const FeedHeader = ({ saudacao, subtitulo, iniciais }: Props) => (
  <View style={styles.cabecalho}>
    <View>
      <Text style={styles.saudacao}>{saudacao}</Text>
      <Text style={styles.subtitulo}>{subtitulo}</Text>
    </View>
    <TouchableOpacity style={styles.avatar} onPress={() => router.push("/Perfil")}>
      <Text style={styles.avatarTexto}>{iniciais}</Text>
    </TouchableOpacity>
  </View>
);

export default FeedHeader;
