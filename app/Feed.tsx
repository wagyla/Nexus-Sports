import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import WheelTimePicker from "@/src/componentes/WheelTimePicker";
import { supabase } from "@/utils/supabase";
import styles from "./feedStyle";
import Navbar from "@/src/componentes/Navbar";
import { router } from "expo-router";
import React, { useState, useRef, useEffect, useCallback } from "react";

// ─── Localização PT-BR do calendário ─────────────────────────────────────────

LocaleConfig.locales["pt"] = {
  monthNames: ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"],
  monthNamesShort: ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"],
  dayNames: ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"],
  dayNamesShort: ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"],
};
LocaleConfig.defaultLocale = "pt";

// ─── Usuário logado (substituir por contexto de auth real) ────────────────────

const USUARIO_ATUAL = { iniciais: "LP", nome: "Léo Prado" };

// ─── Helpers de data ──────────────────────────────────────────────────────────

function formatarDataCurta(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}`;
}

function formatarDataCompleta(dataISO: string) {
  const [ano, mes, dia] = dataISO.split("-");
  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const d = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return `${diasSemana[d.getDay()]}, ${dia}/${mes}/${ano}`;
}

// ─── Dados iniciais (mock) ────────────────────────────────────────────────────

const eventosIniciais = [
  {
    id: "1",
    esporte: "Corrida",
    cor: "#FF4444",
    nome: "Corrida na Praia",
    dataISO: "2026-07-04",
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
    dataISO: "2026-07-05",
    hora: "07:00",
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

// ─── Data mínima = hoje ───────────────────────────────────────────────────────

const hojeISO = new Date().toISOString().split("T")[0];

// ─── Modal de detalhe / edição do evento ─────────────────────────────────────

type Evento = (typeof eventosIniciais)[0];

type ModalEventoProps = {
  evento: Evento | null;
  visivel: boolean;
  onFechar: () => void;
  onSalvar: (id: string, dados: Partial<Evento>) => void;
};

function ModalEvento({ evento, visivel, onFechar, onSalvar }: ModalEventoProps) {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const [modoEdicao, setModoEdicao] = useState(false);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    dataISO: "",
    hora: "",
    endereco: "",
    cidade: "",
    descricao: "",
  });

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
        toValue: 600,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setModoEdicao(false);
      setCalendarioVisivel(false);
    }
  }, [visivel]);

  useEffect(() => {
    if (evento) {
      setForm({
        nome: evento.nome,
        dataISO: evento.dataISO,
        hora: evento.hora,
        endereco: evento.endereco,
        cidade: evento.cidade,
        descricao: evento.descricao,
      });
    }
  }, [evento]);

  if (!evento) return null;

  const isOrganizador = evento.criador.iniciais === USUARIO_ATUAL.iniciais;
  const vagasRestantes = evento.total - evento.participantes.length;

  const handleSalvar = () => {
    onSalvar(evento.id, form);
    setModoEdicao(false);
  };

  const handleCancelar = () => {
    setForm({
      nome: evento.nome,
      dataISO: evento.dataISO,
      hora: evento.hora,
      endereco: evento.endereco,
      cidade: evento.cidade,
      descricao: evento.descricao,
    });
    setModoEdicao(false);
  };

  return (
    <Modal
      transparent
      visible={visivel}
      animationType="none"
      onRequestClose={onFechar}
    >
      <Pressable
        style={estilosModal.overlay}
        onPress={modoEdicao ? undefined : onFechar}
      >
        <Animated.View
          style={[estilosModal.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <Pressable onPress={() => {}}>
            <View style={estilosModal.handle} />

            {/* Cabeçalho */}
            <View style={estilosModal.cabecalhoModal}>
              <View style={[estilosModal.tagEsporte, { backgroundColor: evento.cor + "33" }]}>
                <Text style={[estilosModal.tagEsporteTexto, { color: evento.cor }]}>
                  {evento.esporte}
                </Text>
              </View>
              <View style={estilosModal.cabecalhoBotoes}>
                {isOrganizador && !modoEdicao && (
                  <TouchableOpacity
                    onPress={() => setModoEdicao(true)}
                    style={[estilosModal.botaoFechar, { backgroundColor: "#1a1a2e", marginRight: 8 }]}
                  >
                    <Text style={{ color: "#00FFD1", fontSize: 14 }}>✎</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={modoEdicao ? handleCancelar : onFechar}
                  style={estilosModal.botaoFechar}
                >
                  <Text style={estilosModal.botaoFecharTexto}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>

            {modoEdicao && (
              <View style={estilosModal.bannerEdicao}>
                <Text style={estilosModal.bannerEdicaoTexto}>Modo de edição</Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Nome */}
              {modoEdicao ? (
                <TextInput
                  style={estilosModal.inputTitulo}
                  value={form.nome}
                  onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
                  placeholderTextColor="#555"
                />
              ) : (
                <Text style={estilosModal.titulo}>{evento.nome}</Text>
              )}

              <View style={estilosModal.divisor} />

              {/* Data e hora */}
              <Text style={estilosModal.rotulo}>DATA E HORA</Text>
              {modoEdicao ? (
                <>
                  <Text style={[estilosModal.rotulo, { marginBottom: 6 }]}>DATA</Text>
                  <TouchableOpacity
                    style={[estilosModal.input, { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }]}
                    onPress={() => setCalendarioVisivel(true)}
                  >
                    <Text style={{ color: form.dataISO ? "#fff" : "#555", fontSize: 14 }}>
                      {form.dataISO
                        ? (() => { const [a, m, d] = form.dataISO.split("-"); return `${d}/${m}/${a}`; })()
                        : "DD/MM/AAAA"}
                    </Text>
                    <Text style={{ color: "#00FFD1", fontSize: 16 }}>📅</Text>
                  </TouchableOpacity>

                  <Text style={[estilosModal.rotulo, { marginBottom: 0 }]}>HORÁRIO</Text>
                  <WheelTimePicker
                    value={form.hora}
                    onChange={(t) => setForm((f) => ({ ...f, hora: t }))}
                  />
                </>
              ) : (
                <Text style={estilosModal.valor}>
                  {formatarDataCompleta(evento.dataISO)} · {evento.hora}
                </Text>
              )}

              {/* Modal do calendário */}
              <Modal
                transparent
                visible={calendarioVisivel}
                animationType="fade"
                onRequestClose={() => setCalendarioVisivel(false)}
              >
                <Pressable
                  style={estilosModal.overlayCalendario}
                  onPress={() => setCalendarioVisivel(false)}
                >
                  <Pressable onPress={() => {}}>
                    <View style={estilosModal.containerCalendario}>
                      <Text style={estilosModal.tituloCalendario}>Selecione a data</Text>
                      <Calendar
                        current={form.dataISO || hojeISO}
                        minDate={hojeISO}
                        onDayPress={(day) => {
                          setForm((f) => ({ ...f, dataISO: day.dateString }));
                          setCalendarioVisivel(false);
                        }}
                        markedDates={{
                          [form.dataISO]: { selected: true, selectedColor: "#00FFD1" },
                        }}
                        theme={{
                          backgroundColor: "#1a1a1a",
                          calendarBackground: "#1a1a1a",
                          textSectionTitleColor: "#888",
                          selectedDayBackgroundColor: "#00FFD1",
                          selectedDayTextColor: "#000",
                          todayTextColor: "#00FFD1",
                          dayTextColor: "#ffffff",
                          textDisabledColor: "#333",
                          dotColor: "#00FFD1",
                          arrowColor: "#00FFD1",
                          monthTextColor: "#ffffff",
                          indicatorColor: "#00FFD1",
                          textMonthFontWeight: "700",
                          textDayFontSize: 14,
                          textMonthFontSize: 16,
                          textDayHeaderFontSize: 12,
                        }}
                      />
                      <TouchableOpacity
                        style={estilosModal.botaoCancelarCalendario}
                        onPress={() => setCalendarioVisivel(false)}
                      >
                        <Text style={{ color: "#888", fontWeight: "600" }}>Cancelar</Text>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>

              {/* Localização */}
              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>LOCALIZAÇÃO</Text>
              {modoEdicao ? (
                <>
                  <TextInput
                    style={[estilosModal.input, { marginBottom: 8 }]}
                    value={form.endereco}
                    onChangeText={(v) => setForm((f) => ({ ...f, endereco: v }))}
                    placeholder="Endereço"
                    placeholderTextColor="#555"
                  />
                  <TextInput
                    style={estilosModal.input}
                    value={form.cidade}
                    onChangeText={(v) => setForm((f) => ({ ...f, cidade: v }))}
                    placeholder="Cidade"
                    placeholderTextColor="#555"
                  />
                </>
              ) : (
                <>
                  <Text style={estilosModal.valor}>{evento.endereco}</Text>
                  <Text style={estilosModal.subvalor}>{evento.cidade}</Text>
                </>
              )}

              {/* Grupo */}
              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>GRUPO</Text>
              <Text style={[estilosModal.valor, { color: "#00FFD1" }]}>{evento.grupo}</Text>

              {/* Criador */}
              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>CRIADO POR</Text>
              <View style={estilosModal.criadorRow}>
                <View style={[estilosModal.avatarCriador, { backgroundColor: evento.criador.corAvatar }]}>
                  <Text style={estilosModal.avatarCriadorTexto}>{evento.criador.iniciais}</Text>
                </View>
                <View>
                  <Text style={estilosModal.criadorNome}>{evento.criador.nome}</Text>
                  <Text style={estilosModal.criadorRole}>Organizador</Text>
                </View>
              </View>

              <View style={estilosModal.divisor} />

              {/* Descrição */}
              <Text style={estilosModal.rotulo}>DESCRIÇÃO</Text>
              {modoEdicao ? (
                <TextInput
                  style={[estilosModal.input, { minHeight: 80, textAlignVertical: "top" }]}
                  value={form.descricao}
                  onChangeText={(v) => setForm((f) => ({ ...f, descricao: v }))}
                  placeholder="Descrição do evento"
                  placeholderTextColor="#555"
                  multiline
                />
              ) : (
                <Text style={estilosModal.descricao}>{evento.descricao}</Text>
              )}

              {/* Participantes */}
              <Text style={[estilosModal.rotulo, { marginTop: 20 }]}>
                PARTICIPANTES ({evento.participantes.length}/{evento.total})
              </Text>
              <View style={estilosModal.participantesRow}>
                {evento.participantes.map((p, i) => (
                  <View
                    key={i}
                    style={[
                      estilosModal.miniAvatar,
                      { backgroundColor: evento.coresAvatar[i], marginLeft: i === 0 ? 0 : -8 },
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

              {/* Botão principal */}
              {modoEdicao ? (
                <TouchableOpacity style={estilosModal.botaoSalvar} onPress={handleSalvar}>
                  <Text style={estilosModal.botaoParticiparTexto}>Salvar Alterações</Text>
                </TouchableOpacity>
              ) : isOrganizador ? (
                <TouchableOpacity style={estilosModal.botaoEditar} onPress={() => setModoEdicao(true)}>
                  <Text style={estilosModal.botaoEditarTexto}>Editar Evento</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={estilosModal.botaoParticipar} onPress={onFechar}>
                  <Text style={estilosModal.botaoParticiparTexto}>Participar do Evento</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

// ─── Tela principal do Feed ───────────────────────────────────────────────────

export default function Feed() {
  const [eventos, setEventos] = useState<Evento[]>(eventosIniciais);
  const [eventoSelecionado, setEventoSelecionado] = useState<Evento | null>(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  // Busca eventos do Supabase — dentro de useEffect para poder usar await
  useEffect(() => {
    async function carregarEventos() {
      const { data, error } = await supabase.from("eventos").select("*");
      if (error) {
        console.error("Erro ao carregar eventos:", error.message);
        return;
      }
      if (data && data.length > 0) setEventos(data);
    }
    carregarEventos();
  }, []);

  const abrirModal = (evento: Evento) => {
    setEventoSelecionado(evento);
    setModalVisivel(true);
  };

  const fecharModal = () => setModalVisivel(false);

  const salvarEvento = (id: string, dadosAtualizados: Partial<Evento>) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...dadosAtualizados } : e))
    );
    setEventoSelecionado((prev) =>
      prev?.id === id ? { ...prev, ...dadosAtualizados } : prev
    );
  };

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
        <TouchableOpacity style={styles.avatar} onPress={() => router.push("/Perfil")}>
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
            <Text style={filtroAtivo === f ? styles.tagTextoAtivo : styles.tagTexto}>{f}</Text>
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
                <View style={[styles.esporteTag, { backgroundColor: evento.cor + "33" }]}>
                  <Text style={[styles.esporteTexto, { color: evento.cor }]}>{evento.esporte}</Text>
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
                    <View key={i} style={[styles.miniAvatar, { marginLeft: i === 0 ? 0 : -8 }]}>
                      <Text style={styles.miniAvatarTexto}>{p}</Text>
                    </View>
                  ))}
                  <Text style={styles.totalParticipantes}>+{evento.total}</Text>
                </View>
                <TouchableOpacity style={styles.botaoVer} onPress={() => abrirModal(evento)}>
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
        onSalvar={salvarEvento}
      />
    </View>
  );
}

// ─── Estilos do modal ─────────────────────────────────────────────────────────

const estilosModal = StyleSheet.create({
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
  cabecalhoBotoes: {
    flexDirection: "row",
    alignItems: "center",
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
  bannerEdicao: {
    backgroundColor: "#00FFD122",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00FFD144",
  },
  bannerEdicaoTexto: {
    color: "#00FFD1",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
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
  botaoEditar: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#00FFD1",
  },
  botaoEditarTexto: {
    color: "#00FFD1",
    fontSize: 16,
    fontWeight: "700",
  },
  botaoSalvar: {
    backgroundColor: "#00FFD1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputTitulo: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  overlayCalendario: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  containerCalendario: {
    backgroundColor: "#1a1a1a",
    borderRadius: 20,
    overflow: "hidden",
    width: 340,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tituloCalendario: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  botaoCancelarCalendario: {
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
});
