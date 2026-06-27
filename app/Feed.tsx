import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
} from "react-native";
import styles from "./feedStyle";
import Navbar from "@/src/componentes/Navbar";
import { router } from "expo-router";
import React, { useState, useRef } from "react";

const eventos = [
  {
    id: "1",
    esporte: "Corrida",
    cor: "#FF4444",
    nome: "Corrida na Praia",
    data: "Sex",
    dataCompleta: "Sexta-feira",
    hora: "06:30",
    endereco: "Praia da Saudade",
    cidade: "Fortaleza, CE",
    participantes: ["LP", "LC", "WM"],
    coresAvatar: ["#6c63ff", "#ff6b6b", "#ffa94d"],
    total: 10,
    grupo: "Corredores da Orla 🏃",
    criador: { iniciais: "LP", nome: "Léo Prado", corAvatar: "#6c63ff" },
    descricao:
      "Corrida de 5 km saindo da Praia da Saudade e chegada no Aeroporto. Percurso plano, ideal para iniciantes e intermediários.",
  },
  {
    id: "2",
    esporte: "Ciclismo",
    cor: "#FF8800",
    nome: "Pedalada Matinal",
    data: "Sáb",
    dataCompleta: "Sábado",
    hora: "06:30",
    endereco: "Av. Olindo de Miranda",
    cidade: "Fortaleza, CE",
    participantes: ["LP", "LC", "WM"],
    coresAvatar: ["#6c63ff", "#ff6b6b", "#ffa94d"],
    total: 10,
    grupo: "Ciclistas da Manhã 🚴",
    criador: { iniciais: "LC", nome: "Lucas Costa", corAvatar: "#ff6b6b" },
    descricao:
      "Pedalada leve de 20 km pela orla da cidade. Traga sua bike e boa disposição! Ponto de encontro na entrada da Av. Olindo de Miranda.",
  },
];

function ModalEvento({ evento, visivel, onFechar }) {
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

  if (!evento) return null;

  const vagasRestantes = evento.total - evento.participantes.length;

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

            <View style={estilosModal.cabecalhoModal}>
              <View
                style={[
                  estilosModal.tagEsporte,
                  { backgroundColor: evento.cor + "33" },
                ]}
              >
                <Text
                  style={[estilosModal.tagEsporteTexto, { color: evento.cor }]}
                >
                  {evento.esporte}
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
              <Text style={estilosModal.titulo}>{evento.nome}</Text>

              <View style={estilosModal.divisor} />

              <Text style={estilosModal.rotulo}>DATA E HORA</Text>
              <Text style={estilosModal.valor}>
                {evento.dataCompleta} · {evento.hora}
              </Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                LOCALIZAÇÃO
              </Text>
              <Text style={estilosModal.valor}>{evento.endereco}</Text>
              <Text style={estilosModal.subvalor}>{evento.cidade}</Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                GRUPO
              </Text>
              <Text style={[estilosModal.valor, { color: "#00FFD1" }]}>
                {evento.grupo}
              </Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                CRIADO POR
              </Text>
              <View style={estilosModal.criadorRow}>
                <View
                  style={[
                    estilosModal.avatarCriador,
                    { backgroundColor: evento.criador.corAvatar },
                  ]}
                >
                  <Text style={estilosModal.avatarCriadorTexto}>
                    {evento.criador.iniciais}
                  </Text>
                </View>
                <View>
                  <Text style={estilosModal.criadorNome}>
                    {evento.criador.nome}
                  </Text>
                  <Text style={estilosModal.criadorRole}>Organizador</Text>
                </View>
              </View>

              <View style={estilosModal.divisor} />

              <Text style={estilosModal.rotulo}>DESCRIÇÃO</Text>
              <Text style={estilosModal.descricao}>{evento.descricao}</Text>

              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                PARTICIPANTES ({evento.participantes.length}/{evento.total})
              </Text>
              <View style={estilosModal.participantesRow}>
                {evento.participantes.map((p, i) => (
                  <View
                    key={i}
                    style={[
                      estilosModal.miniAvatar,
                      {
                        backgroundColor: evento.coresAvatar[i],
                        marginLeft: i === 0 ? 0 : -8,
                      },
                    ]}
                  >
                    <Text style={estilosModal.miniAvatarTexto}>{p}</Text>
                  </View>
                ))}
                <Text style={estilosModal.vagasTexto}>
                  +{vagasRestantes} vaga{vagasRestantes !== 1 ? "s" : ""}{" "}
                  restante{vagasRestantes !== 1 ? "s" : ""}
                </Text>
              </View>

              <TouchableOpacity
                style={estilosModal.botaoParticipar}
                onPress={onFechar}
              >
                <Text style={estilosModal.botaoParticiparTexto}>
                  Participar do Evento
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default function Feed() {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  const abrirModal = (evento) => {
    setEventoSelecionado(evento);
    setModalVisivel(true);
  };

  const fecharModal = () => setModalVisivel(false);

  const filtros = ["Todos", "Corrida", "Ciclismo", "Tênis", "Vôlei"];

  const eventosFiltrados =
    filtroAtivo === "Todos"
      ? eventos
      : eventos.filter((e) => e.esporte === filtroAtivo);

  return (
    <View style={styles.container}>
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.saudacao}>Olá, Léo!</Text>
          <Text style={styles.subtitulo}>Eventos perto de você!</Text>
        </View>
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => router.push("/Perfil")}
        >
          <Text style={styles.avatarTexto}>LP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtros}>
        {filtros.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.tag, filtroAtivo === f && styles.tagAtiva]}
            onPress={() => setFiltroAtivo(f)}
          >
            <Text
              style={filtroAtivo === f ? styles.tagTextoAtivo : styles.tagTexto}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {eventosFiltrados.length === 0 ? (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            Nenhum evento encontrado para "{filtroAtivo}"
          </Text>
        ) : (
          eventosFiltrados.map((evento, index) => (
            <View key={`${evento.id}-${index}`} style={styles.card}>
              <View style={styles.cardTopo}>
                <View
                  style={[
                    styles.esporteTag,
                    { backgroundColor: evento.cor + "33" },
                  ]}
                >
                  <Text style={[styles.esporteTexto, { color: evento.cor }]}>
                    {evento.esporte}
                  </Text>
                </View>
                <View style={styles.dataHora}>
                  <Text style={styles.data}>{evento.data}</Text>
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
                      style={[
                        styles.miniAvatar,
                        { marginLeft: i === 0 ? 0 : -8 },
                      ]}
                    >
                      <Text style={styles.miniAvatarTexto}>{p}</Text>
                    </View>
                  ))}
                  <Text style={styles.totalParticipantes}>+{evento.total}</Text>
                </View>
                <TouchableOpacity
                  style={styles.botaoVer}
                  onPress={() => abrirModal(evento)}
                >
                  <Text style={styles.botaoVerTexto}>Ver</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <Navbar itemAtivo="feed" />

      <ModalEvento
        evento={eventoSelecionado}
        visivel={modalVisivel}
        onFechar={fecharModal}
      />
    </View>
  );
}

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
  cabecalhoModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  tagEsporte: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagEsporteTexto: {
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
  titulo: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
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
  subvalor: {
    color: "#555",
    fontSize: 12,
    marginTop: 2,
  },
  criadorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  avatarCriador: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCriadorTexto: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  criadorNome: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  criadorRole: {
    color: "#555",
    fontSize: 12,
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
  vagasTexto: {
    color: "#555",
    fontSize: 13,
    marginLeft: 10,
  },
  botaoParticipar: {
    backgroundColor: "#00FFD1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  botaoParticiparTexto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
};
