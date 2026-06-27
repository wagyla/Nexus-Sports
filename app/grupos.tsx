import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  Animated,
  Pressable,
} from "react-native";
import Navbar from "@/src/componentes/Navbar";
import { router } from "expo-router";

const meusGrupos = [
  {
    id: 1,
    nome: "Corredores Almenara",
    membros: 48,
    eventos: 5,
    isAdmin: true,
    emoji: "🏃",
    esporte: "Corrida",
    nivel: "Todos os níveis",
    local: "Almenara, MG",
    descricao:
      "Grupo de corrida da cidade de Almenara. Saídas toda semana, percursos variados para todos os níveis.",
    participantes: ["LP", "LC", "WM"],
    coresAvatar: ["#6c63ff", "#ff6b6b", "#ffa94d"],
  },
  {
    id: 2,
    nome: "Vôlei em Jequi",
    membros: 15,
    eventos: 1,
    isAdmin: true,
    emoji: "🏐",
    esporte: "Vôlei",
    nivel: "Recreação",
    local: "Jequitinhonha, MG",
    descricao:
      "Grupo de vôlei recreativo em Jequitinhonha. Jogamos aos finais de semana na quadra do centro.",
    participantes: ["LP", "WM"],
    coresAvatar: ["#6c63ff", "#ffa94d"],
  },
];

const descobrirGrupos = [
  {
    id: 3,
    nome: "Ciclistas Jequi",
    membros: 23,
    emoji: "🚴",
    esporte: "Ciclismo",
    nivel: "Intermediário",
    local: "Jequitinhonha, MG",
    descricao:
      "Pedaladas toda manhã de sábado pela região. Bem-vindos ciclistas de todos os níveis!",
    participantes: ["LC", "WM", "AA"],
    coresAvatar: ["#ff6b6b", "#ffa94d", "#4ecdc4"],
  },
  {
    id: 4,
    nome: "Futsal",
    membros: 15,
    emoji: "⚽",
    esporte: "Futebol",
    nivel: "Recreação",
    local: "Almenara, MG",
    descricao: "Pelada toda sexta à noite no ginásio municipal. Venha jogar!",
    participantes: ["AA", "LP"],
    coresAvatar: ["#4ecdc4", "#6c63ff"],
  },
  {
    id: 5,
    nome: "Natação Livre",
    membros: 12,
    emoji: "🏊",
    esporte: "Natação",
    nivel: "Iniciante",
    local: "Almenara, MG",
    descricao:
      "Grupo de natação para iniciantes. Aulas e treinos livres na piscina municipal.",
    participantes: ["WM", "LC"],
    coresAvatar: ["#ffa94d", "#ff6b6b"],
  },
];

function ModalGrupo({ grupo, visivel, onFechar, isMembro }) {
  const slideAnim = useRef(new Animated.Value(600)).current;

  React.useEffect(() => {
    if (visivel) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visivel]);

  if (!grupo) return null;

  return (
    <Modal
      transparent
      visible={visivel}
      animationType="none"
      onRequestClose={onFechar}
    >
      <Pressable style={estilosModal.overlay} onPress={onFechar}>
        <Animated.View
          style={[
            estilosModal.sheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Pressable onPress={() => {}}>
            <View style={estilosModal.handle} />

            <View style={estilosModal.cabecalho}>
              <View style={estilosModal.tagEsporte}>
                <Text style={estilosModal.tagEsporteTexto}>
                  {grupo.esporte}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onFechar}
                style={estilosModal.botaoFechar}
              >
                <Text style={estilosModal.botaoFecharTexto}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={estilosModal.tituloRow}>
                <Text style={estilosModal.emoji}>{grupo.emoji}</Text>
                <Text style={estilosModal.titulo}>{grupo.nome}</Text>
              </View>

              <View style={estilosModal.divisor} />

              <Text style={estilosModal.rotulo}>NÍVEL</Text>
              <Text style={estilosModal.valor}>{grupo.nivel}</Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                LOCAL
              </Text>
              <Text style={estilosModal.valor}>{grupo.local}</Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                MEMBROS
              </Text>
              <Text style={estilosModal.valor}>
                {grupo.membros} participantes
              </Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                EVENTOS ATIVOS
              </Text>
              <Text style={estilosModal.valor}>
                {grupo.eventos ?? 0} evento
                {(grupo.eventos ?? 0) !== 1 ? "s" : ""}
              </Text>

              <View style={estilosModal.divisor} />

              <Text style={estilosModal.rotulo}>DESCRIÇÃO</Text>
              <Text style={estilosModal.descricao}>{grupo.descricao}</Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                ALGUNS MEMBROS
              </Text>
              <View style={estilosModal.participantesRow}>
                {grupo.participantes.map((p, i) => (
                  <View
                    key={i}
                    style={[
                      estilosModal.miniAvatar,
                      {
                        backgroundColor: grupo.coresAvatar[i],
                        marginLeft: i === 0 ? 0 : -8,
                      },
                    ]}
                  >
                    <Text style={estilosModal.miniAvatarTexto}>{p}</Text>
                  </View>
                ))}
                <Text style={estilosModal.maisTexto}>
                  +{grupo.membros - grupo.participantes.length} outros
                </Text>
              </View>

              {isMembro ? (
                <TouchableOpacity
                  style={estilosModal.botaoSair}
                  onPress={() => {
                    onFechar();
                    Alert.alert(
                      "Saiu do grupo",
                      `Você saiu de "${grupo.nome}".`,
                    );
                  }}
                >
                  <Text style={estilosModal.botaoSairTexto}>Sair do Grupo</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={estilosModal.botaoEntrar}
                  onPress={() => {
                    onFechar();
                    Alert.alert(
                      "Solicitação enviada",
                      `Você pediu para entrar em "${grupo.nome}".`,
                    );
                  }}
                >
                  <Text style={estilosModal.botaoEntrarTexto}>
                    Entrar no Grupo
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default function GruposScreen() {
  const [grupoSelecionado, setGrupoSelecionado] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [isMembro, setIsMembro] = useState(false);

  const abrirModal = (grupo, membro) => {
    setGrupoSelecionado(grupo);
    setIsMembro(membro);
    setModalVisivel(true);
  };

  const fecharModal = () => setModalVisivel(false);

  return (
    <View style={estilos.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={estilos.cabecalho}>
          <Text style={estilos.titulo}>Grupos</Text>
          <TouchableOpacity
            style={estilos.botaoNovo}
            onPress={() => router.push("/CriarGrupoScreen")}
          >
            <Text style={estilos.botaoNovoTexto}>+ Novo</Text>
          </TouchableOpacity>
        </View>

        <Text style={estilos.secaoTitulo}>Meus Grupos</Text>

        {meusGrupos.map((grupo) => (
          <TouchableOpacity
            key={grupo.id}
            style={estilos.card}
            onPress={() => abrirModal(grupo, true)}
          >
            <View style={estilos.cardIcone}>
              <Text style={estilos.cardIconeEmoji}>{grupo.emoji}</Text>
            </View>
            <View style={estilos.cardInfo}>
              <Text style={estilos.cardNome}>{grupo.nome}</Text>
              <Text style={estilos.cardDetalhe}>
                {grupo.membros} membros · {grupo.eventos} evento
                {grupo.eventos > 1 ? "s" : ""}
              </Text>
              {grupo.isAdmin && (
                <View style={estilos.badgeAdmin}>
                  <Text style={estilos.badgeAdminTexto}>Admin</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={estilos.secaoTitulo}>Descobrir Grupos</Text>

        {descobrirGrupos.map((grupo) => (
          <TouchableOpacity
            key={grupo.id}
            style={estilos.card}
            onPress={() => abrirModal(grupo, false)}
          >
            <View style={estilos.cardIcone}>
              <Text style={estilos.cardIconeEmoji}>{grupo.emoji}</Text>
            </View>
            <View style={estilos.cardInfo}>
              <Text style={estilos.cardNome}>{grupo.nome}</Text>
              <Text style={estilos.cardDetalhe}>{grupo.membros} membros</Text>
            </View>
            <View style={estilos.botaoVer}>
              <Text style={estilos.botaoVerTexto}>Ver</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>

      <Navbar itemAtivo="grupos" />

      <ModalGrupo
        grupo={grupoSelecionado}
        visivel={modalVisivel}
        onFechar={fecharModal}
        isMembro={isMembro}
      />
    </View>
  );
}

export const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", paddingTop: 40 },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  botaoNovo: {
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#444",
  },
  botaoNovoTexto: { color: "#ffffff", fontSize: 14 },
  secaoTitulo: {
    fontSize: 14,
    color: "#888888",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  card: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcone: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardIconeEmoji: { fontSize: 22 },
  cardInfo: { flex: 1 },
  cardNome: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  cardDetalhe: { color: "#888888", fontSize: 13, marginTop: 2 },
  badgeAdmin: {
    backgroundColor: "#1a6b5a",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  badgeAdminTexto: { color: "#00FFD1", fontSize: 12, fontWeight: "600" },
  botaoVer: {
    borderWidth: 1,
    borderColor: "#555",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  botaoVerTexto: { color: "#ffffff", fontSize: 14 },
});

const estilosModal = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    maxHeight: "90%",
  },
  handle: {
    width: 48,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tagEsporte: {
    backgroundColor: "#00FFD133",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagEsporteTexto: {
    color: "#00FFD1",
    fontSize: 12,
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
  tituloRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  emoji: { fontSize: 28 },
  titulo: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  divisor: {
    height: 1,
    backgroundColor: "#1A1A1A",
    marginVertical: 16,
  },
  rotulo: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  valor: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  descricao: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  participantesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#1A1A1A",
  },
  miniAvatarTexto: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  maisTexto: {
    color: "#555",
    fontSize: 13,
    marginLeft: 10,
  },
  botaoEntrar: {
    backgroundColor: "#00FFD1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  botaoEntrarTexto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoSair: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  botaoSairTexto: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
};
