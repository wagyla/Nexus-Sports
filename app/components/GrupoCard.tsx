import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { GrupoDisplay } from "@/src/types";

type Props = {
  grupo: GrupoDisplay;
  tipo: "meu" | "publico";
  onPress: () => void;
};

const INICIAL = (nome: string) => nome.charAt(0).toUpperCase();

const GrupoCard = ({ grupo, tipo, onPress }: Props) => (
  <TouchableOpacity style={estilos.card} onPress={onPress} activeOpacity={0.7}>
    <View style={estilos.icone}>
      <Text style={estilos.inicial}>{INICIAL(grupo.nome)}</Text>
    </View>

    <View style={estilos.info}>
      <Text style={estilos.nome}>{grupo.nome}</Text>
      <Text style={estilos.detalhe}>
        {tipo === "meu"
          ? `${grupo.membros} membros · ${grupo.eventos} evento${grupo.eventos !== 1 ? "s" : ""}`
          : grupo.esporte}
      </Text>
      {tipo === "meu" && (
        <View style={estilos.badge}>
          <Text style={estilos.badgeTexto}>Admin</Text>
        </View>
      )}
    </View>

    {tipo === "publico" && (
      <View style={estilos.botaoVer}>
        <Text style={estilos.botaoVerTexto}>Ver</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default GrupoCard;

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  icone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  inicial: { fontSize: 18, fontWeight: "700", color: "#00FFD1" },
  info: { flex: 1 },
  nome: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  detalhe: { color: "#888888", fontSize: 13, marginTop: 2 },
  badge: {
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  badgeTexto: { color: "#00FFD1", fontSize: 12, fontWeight: "600" },
  botaoVer: {
    borderWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  botaoVerTexto: { color: "#ffffff", fontSize: 14 },
});
