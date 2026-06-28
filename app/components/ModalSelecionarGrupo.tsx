import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { corDoEsporte, emojiDoEsporte } from "./helpers";
import type { Grupo } from "./types";
import { SupabaseTablesEnum } from "@/utils/Enums";

type Props = {
  visivel: boolean;
  onFechar: () => void;
};

const ModalSelecionarGrupo = ({ visivel, onFechar }: Props) => {
  const slideAnim = useRef(new Animated.Value(700)).current;
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (visivel) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
      carregarGrupos();
    } else {
      Animated.timing(slideAnim, {
        toValue: 700,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setBusca("");
    }
  }, [visivel]);

  const carregarGrupos = async () => {
    setCarregando(true);

    const { data, error } = await supabase.from(SupabaseTablesEnum.GRUPOS).select("*");
    if (!error && data) {
      setGrupos(data as Grupo[]);
    }
    setCarregando(false);
  };

  const gruposFiltrados = grupos.filter((g) =>
    g.nome.toLowerCase().includes(busca.toLowerCase()),
  );

  const handleSelecionarGrupo = (grupo: Grupo) => {
    onFechar();
    router.push({
      pathname: "/CriarEventoScreen",
      params: { grupoId: grupo.id, grupoNome: grupo.nome },
    });
  };

  const handleCriarGrupo = () => {
    onFechar();
    router.push("/CriarGrupoScreen");
  };

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
              <Text style={estilos.titulo}>Novo Evento</Text>
              <TouchableOpacity onPress={onFechar} style={estilos.botaoFechar}>
                <Text style={estilos.botaoFecharTexto}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={estilos.subtitulo}>
              Selecione o grupo que vai organizar o evento
            </Text>

            <View style={estilos.buscaContainer}>
              <Text style={estilos.buscaIcone}>🔍</Text>
              <TextInput
                style={estilos.buscaInput}
                placeholder="Buscar grupo..."
                placeholderTextColor="#555"
                value={busca}
                onChangeText={setBusca}
              />
              {busca.length > 0 && (
                <TouchableOpacity onPress={() => setBusca("")}>
                  <Text
                    style={{
                      color: "#555",
                      fontSize: 16,
                      paddingHorizontal: 8,
                    }}
                  >
                    ✕
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView
              style={estilos.lista}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {carregando ? (
                <ActivityIndicator
                  color="#00FFD1"
                  size="large"
                  style={{ marginVertical: 32 }}
                />
              ) : gruposFiltrados.length === 0 ? (
                <View style={estilos.vazioContainer}>
                  <Text style={estilos.vazioEmoji}>🏅</Text>
                  <Text style={estilos.vazioTexto}>
                    {busca
                      ? `Nenhum grupo encontrado\npara "${busca}"`
                      : "Você ainda não participa\nde nenhum grupo"}
                  </Text>
                </View>
              ) : (
                gruposFiltrados.map((grupo) => {
                  const cor = corDoEsporte(grupo.esporte ?? "outro");
                  const emoji =
                    grupo.emoji ?? emojiDoEsporte(grupo.esporte ?? "outro");
                  return (
                    <TouchableOpacity
                      key={grupo.id}
                      style={estilos.grupoCard}
                      onPress={() => handleSelecionarGrupo(grupo)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          estilos.grupoIcone,
                          { backgroundColor: cor + "22" },
                        ]}
                      >
                        <Text style={estilos.grupoIconeEmoji}>{emoji}</Text>
                      </View>
                      <View style={estilos.grupoInfo}>
                        <Text style={estilos.grupoNome}>{grupo.nome}</Text>
                        {grupo.esporte && (
                          <View
                            style={[
                              estilos.grupoBadge,
                              { backgroundColor: cor + "22" },
                            ]}
                          >
                            <Text
                              style={[estilos.grupoBadgeTexto, { color: cor }]}
                            >
                              {grupo.esporte}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={estilos.seta}>›</Text>
                    </TouchableOpacity>
                  );
                })
              )}
              <View style={{ height: 12 }} />
            </ScrollView>

            <View style={estilos.divisor} />

            <TouchableOpacity
              style={estilos.botaoCriarGrupo}
              onPress={handleCriarGrupo}
              activeOpacity={0.8}
            >
              <View style={estilos.botaoCriarIconeContainer}>
                <Text style={estilos.botaoCriarIcone}>+</Text>
              </View>
              <Text style={estilos.botaoCriarTexto}>Criar novo grupo</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ModalSelecionarGrupo;

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
  botaoFecharTexto: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  subtitulo: {
    color: "#666",
    fontSize: 13,
    marginBottom: 16,
  },
  buscaContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  buscaIcone: {
    fontSize: 16,
    marginRight: 8,
  },
  buscaInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    paddingVertical: 12,
  },
  lista: {
    maxHeight: 340,
  },
  vazioContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  vazioEmoji: {
    fontSize: 40,
  },
  vazioTexto: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  grupoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  grupoIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  grupoIconeEmoji: {
    fontSize: 22,
  },
  grupoInfo: {
    flex: 1,
    gap: 6,
  },
  grupoNome: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  grupoBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  grupoBadgeTexto: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  seta: {
    color: "#444",
    fontSize: 22,
    fontWeight: "300",
  },
  divisor: {
    height: 1,
    backgroundColor: "#1e1e1e",
    marginVertical: 16,
  },
  botaoCriarGrupo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  botaoCriarIconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#00FFD122",
    borderWidth: 1.5,
    borderColor: "#00FFD155",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  botaoCriarIcone: {
    color: "#00FFD1",
    fontSize: 22,
    fontWeight: "300",
    lineHeight: 24,
  },
  botaoCriarTexto: {
    color: "#00FFD1",
    fontSize: 15,
    fontWeight: "600",
  },
});
