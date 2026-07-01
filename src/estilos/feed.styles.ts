import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingTop: 60,
    paddingHorizontal: 20,
    overflow: "hidden",
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  saudacao: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#888888",
    fontSize: 13,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#00FFD133",
    borderWidth: 1,
    borderColor: "#00FFD1",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: {
    color: "#00FFD1",
    fontWeight: "bold",
    fontSize: 13,
  },
  filtros: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 2,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
  },
  tagAtiva: {
    backgroundColor: "#00FFD1",
  },
  tagTexto: {
    color: "#888888",
    fontSize: 13,
  },
  tagTextoAtivo: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 13,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  cardTopo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  esporteTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  esporteTexto: {
    fontSize: 12,
    fontWeight: "bold",
  },
  dataHora: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  data: {
    color: "#888888",
    fontSize: 12,
  },
  separador: {
    color: "#555555",
    fontSize: 12,
  },
  hora: {
    color: "#00FFD1",
    fontSize: 12,
    fontWeight: "bold",
  },
  nomeEvento: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  grupoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  grupoTexto: {
    color: "#555555",
    fontSize: 12,
  },
  endereco: {
    color: "#888888",
    fontSize: 13,
    marginBottom: 14,
  },
  cardRodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantes: {
    flexDirection: "row",
    alignItems: "center",
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#00FFD133",
    borderWidth: 1,
    borderColor: "#0D0D0D",
    alignItems: "center",
    justifyContent: "center",
  },
  miniAvatarTexto: {
    color: "#00FFD1",
    fontSize: 8,
    fontWeight: "bold",
  },
  totalParticipantes: {
    color: "#888888",
    fontSize: 12,
    marginLeft: 6,
  },
  botaoVer: {
    borderWidth: 1,
    borderColor: "#00FFD1",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  botaoVerTexto: {
    color: "#00FFD1",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default styles;
