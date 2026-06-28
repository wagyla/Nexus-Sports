import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "@/src/styles/feed.styles";
import { formatarDataCurta } from "./helpers";
import type { Evento } from "@/src/types";

type Props = {
  evento: Evento;
  onPress: (evento: Evento) => void;
};

const EventoCard = ({ evento, onPress }: Props) => (
  <View style={styles.card}>
    <View style={styles.cardTopo}>
      <View style={[styles.esporteTag, { backgroundColor: evento.cor + "33" }]}>
        <Text style={[styles.esporteTexto, { color: evento.cor }]}>
          {evento.esporte}
        </Text>
      </View>
      <View style={styles.dataHora}>
        <Text style={styles.data}>{formatarDataCurta(evento.dataISO)}</Text>
        <Text style={styles.separador}>·</Text>
        <Text style={styles.hora}>{evento.hora}</Text>
      </View>
    </View>

    <Text style={styles.nomeEvento}>{evento.nome}</Text>
    {!!evento.grupo && (
      <View style={styles.grupoRow}>
        <MaterialCommunityIcons name="account-group" size={12} color="#555" />
        <Text style={styles.grupoTexto}>{evento.grupo}</Text>
      </View>
    )}
    <Text style={styles.endereco}>{evento.endereco}</Text>

    <View style={styles.cardRodape}>
      <View style={styles.participantes}>
        <Text style={styles.totalParticipantes}>
          {evento.participantesCount}/{evento.total} participantes
        </Text>
      </View>
      <TouchableOpacity style={styles.botaoVer} onPress={() => onPress(evento)}>
        <Text style={styles.botaoVerTexto}>Ver</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default EventoCard;
