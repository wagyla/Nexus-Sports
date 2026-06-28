import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  Pressable,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark, faUsers } from "@fortawesome/free-solid-svg-icons";
import { corDoEsporte, iconeDoEsporte } from "./helpers";

type GrupoPerfil = {
  nome: string;
  esporte: string;
  membros: number;
};

type Props = {
  visivel: boolean;
  onFechar: () => void;
  grupos: GrupoPerfil[];
};

const ModalGruposPerfil = ({ visivel, onFechar, grupos }: Props) => {
  const slideAnim = useRef(new Animated.Value(700)).current;

  useEffect(() => {
    if (visivel) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 700,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visivel]);

  return (
    <Modal
      transparent
      visible={visivel}
      animationType="none"
      onRequestClose={onFechar}
    >
      <Pressable style={estilos.overlay} onPress={onFechar}>
        <Animated.View
          style={[estilos.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <Pressable onPress={() => {}}>
            <View style={estilos.handle} />

            <View style={estilos.cabecalho}>
              <Text style={estilos.titulo}>Grupos</Text>
              <TouchableOpacity onPress={onFechar} style={estilos.botaoFechar}>
                <FontAwesomeIcon icon={faXmark} size={14} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={estilos.subtitulo}>
              {grupos.length} grupo{grupos.length !== 1 ? "s" : ""} participando
            </Text>

            <ScrollView
              style={estilos.lista}
              showsVerticalScrollIndicator={false}
            >
              {grupos.length === 0 ? (
                <View style={estilos.vazioContainer}>
                  <FontAwesomeIcon icon={faUsers} size={36} color="#333" />
                  <Text style={estilos.vazioTexto}>
                    Você ainda não participa{"\n"}de nenhum grupo
                  </Text>
                </View>
              ) : (
                grupos.map((grupo, index) => {
                  const cor = corDoEsporte(grupo.esporte);
                  const icone = iconeDoEsporte(grupo.esporte);
                  return (
                    <View key={index} style={estilos.card}>
                      <View
                        style={[
                          estilos.cardIcone,
                          { backgroundColor: cor + "22" },
                        ]}
                      >
                        <FontAwesomeIcon icon={icone} size={20} color={cor} />
                      </View>
                      <View style={estilos.cardInfo}>
                        <Text style={estilos.cardTitulo}>{grupo.nome}</Text>
                        <Text style={estilos.cardDetalhe}>
                          {grupo.membros} membro{grupo.membros !== 1 ? "s" : ""}
                        </Text>
                      </View>
                      <View
                        style={[
                          estilos.badge,
                          { backgroundColor: cor + "22" },
                        ]}
                      >
                        <Text style={[estilos.badgeTexto, { color: cor }]}>
                          {grupo.esporte}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
              <View style={{ height: 12 }} />
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ModalGruposPerfil;

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: "85%",
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titulo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  botaoFechar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  subtitulo: {
    color: "#666",
    fontSize: 13,
    marginBottom: 16,
  },
  lista: {
    maxHeight: 400,
  },
  vazioContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  vazioTexto: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  cardTitulo: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  cardDetalhe: {
    color: "#666",
    fontSize: 13,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTexto: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
