import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../feedStyle";
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
    <Text style={styles.endereco}>{evento.endereco}</Text>

    <View style={styles.cardRodape}>
      <View style={styles.participantes}>
        {evento.participantes.map((p, i) => (
          <View
            key={i}
            style={[styles.miniAvatar, { marginLeft: i === 0 ? 0 : -8 }]}
          >
            <Text style={styles.miniAvatarTexto}>{p}</Text>
          </View>
        ))}
        <Text style={styles.totalParticipantes}>+{evento.total}</Text>
      </View>
      <TouchableOpacity style={styles.botaoVer} onPress={() => onPress(evento)}>
        <Text style={styles.botaoVerTexto}>Ver</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default EventoCard;
