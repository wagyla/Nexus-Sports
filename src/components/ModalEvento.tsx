import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Animated,
  Pressable,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faXmark,
  faPen,
  faCalendarDays,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import WheelTimePicker from "@/src/components/WheelTimePicker";
import { formatarDataCompleta, hojeISO } from "./helpers";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  getParticipantesEvento,
  getIsParticipante,
  postParticiparEvento,
  deleteCancelarParticipacao,
} from "@/src/api/eventos";
import type { Evento, ParticipanteDisplay } from "@/src/types";

type Props = {
  evento?: Evento;
  visivel: boolean;
  onFechar: () => void;
  onSalvar: (id: string, dados: Partial<Evento>) => void;
};

const ModalEvento = ({ evento, visivel, onFechar, onSalvar }: Props) => {
  const { user } = useAuth();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const [modoEdicao, setModoEdicao] = useState(false);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);
  const [listaParticipantesVisivel, setListaParticipantesVisivel] =
    useState(false);
  const [participantes, setParticipantes] = useState<ParticipanteDisplay[]>([]);
  const [carregandoParticipantes, setCarregandoParticipantes] = useState(false);
  const [isParticipante, setIsParticipante] = useState(false);
  const [inscrevendo, setInscrevendo] = useState(false);
  const [erroParticipacao, setErroParticipacao] = useState<
    string | undefined
  >();
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
      setIsParticipante(false);
      setErroParticipacao(undefined);
      setParticipantes([]);
    }
  }, [visivel, slideAnim]);

  const eventoId = evento?.id;
  const userId = user?.id;
  useEffect(() => {
    if (visivel && eventoId && userId) {
      getIsParticipante(eventoId, userId).then(setIsParticipante);
    }
  }, [visivel, eventoId, userId]);

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

  const isOrganizador = !!user && evento.criadorId === user.id;
  const vagasRestantes = evento.total - evento.participantesCount;

  const handleParticipar = async () => {
    if (!user) return;
    setInscrevendo(true);
    setErroParticipacao(undefined);
    const { error } = await postParticiparEvento(evento.id, user.id);
    if (error) {
      setErroParticipacao("Não foi possível participar. Tente novamente.");
    } else {
      setIsParticipante(true);
      onSalvar(evento.id, {
        participantesCount: evento.participantesCount + 1,
      });
      setParticipantes([]);
    }
    setInscrevendo(false);
  };

  const handleCancelarParticipacao = async () => {
    if (!user) return;
    setInscrevendo(true);
    setErroParticipacao(undefined);
    const { error } = await deleteCancelarParticipacao(evento.id, user.id);
    if (error) {
      setErroParticipacao("Não foi possível cancelar. Tente novamente.");
    } else {
      setIsParticipante(false);
      onSalvar(evento.id, {
        participantesCount: Math.max(0, evento.participantesCount - 1),
      });
      setParticipantes([]);
    }
    setInscrevendo(false);
  };

  const abrirListaParticipantes = async () => {
    setListaParticipantesVisivel(true);
    if (participantes.length > 0) return;
    setCarregandoParticipantes(true);
    const { data } = await getParticipantesEvento(evento.id);
    setParticipantes(data ?? []);
    setCarregandoParticipantes(false);
  };

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
        style={estilos.overlay}
        onPress={modoEdicao ? undefined : onFechar}
      >
        <Animated.View
          style={[estilos.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <Pressable onPress={() => {}}>
            <View style={estilos.handle} />

            <View style={estilos.cabecalhoModal}>
              <View
                style={[
                  estilos.tagEsporte,
                  { backgroundColor: evento.cor + "33" },
                ]}
              >
                <Text style={[estilos.tagEsporteTexto, { color: evento.cor }]}>
                  {evento.esporte}
                </Text>
              </View>
              <View style={estilos.cabecalhoBotoes}>
                {isOrganizador && !modoEdicao && (
                  <TouchableOpacity
                    onPress={() => setModoEdicao(true)}
                    style={[
                      estilos.botaoFechar,
                      { backgroundColor: "#1a1a2e", marginRight: 8 },
                    ]}
                  >
                    <FontAwesomeIcon icon={faPen} size={13} color="#00FFD1" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={modoEdicao ? handleCancelar : onFechar}
                  style={estilos.botaoFechar}
                >
                  <FontAwesomeIcon icon={faXmark} size={14} color="#888" />
                </TouchableOpacity>
              </View>
            </View>

            {modoEdicao && (
              <View style={estilos.bannerEdicao}>
                <Text style={estilos.bannerEdicaoTexto}>Modo de edição</Text>
              </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
              {modoEdicao ? (
                <TextInput
                  style={estilos.inputTitulo}
                  value={form.nome}
                  onChangeText={(v) => setForm((f) => ({ ...f, nome: v }))}
                  placeholderTextColor="#555"
                />
              ) : (
                <Text style={estilos.titulo}>{evento.nome}</Text>
              )}

              <View style={estilos.divisor} />

              <Text style={estilos.rotulo}>DATA E HORA</Text>
              {modoEdicao ? (
                <>
                  <Text style={[estilos.rotulo, { marginBottom: 6 }]}>
                    DATA
                  </Text>
                  <TouchableOpacity
                    style={[
                      estilos.input,
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                      },
                    ]}
                    onPress={() => setCalendarioVisivel(true)}
                  >
                    <Text
                      style={{
                        color: form.dataISO ? "#fff" : "#555",
                        fontSize: 14,
                      }}
                    >
                      {form.dataISO
                        ? (() => {
                            const [a, m, d] = form.dataISO.split("-");
                            return `${d}/${m}/${a}`;
                          })()
                        : "DD/MM/AAAA"}
                    </Text>
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      size={16}
                      color="#00FFD1"
                    />
                  </TouchableOpacity>

                  <Text style={[estilos.rotulo, { marginBottom: 0 }]}>
                    HORÁRIO
                  </Text>
                  <WheelTimePicker
                    value={form.hora}
                    onChange={(t) => setForm((f) => ({ ...f, hora: t }))}
                  />
                </>
              ) : (
                <Text style={estilos.valor}>
                  {formatarDataCompleta(evento.dataISO)} · {evento.hora}
                </Text>
              )}

              <Modal
                transparent
                visible={calendarioVisivel}
                animationType="fade"
                onRequestClose={() => setCalendarioVisivel(false)}
              >
                <Pressable
                  style={estilos.overlayCalendario}
                  onPress={() => setCalendarioVisivel(false)}
                >
                  <Pressable onPress={() => {}}>
                    <View style={estilos.containerCalendario}>
                      <Text style={estilos.tituloCalendario}>
                        Selecione a data
                      </Text>
                      <Calendar
                        current={form.dataISO || hojeISO}
                        minDate={hojeISO}
                        onDayPress={(day) => {
                          setForm((f) => ({ ...f, dataISO: day.dateString }));
                          setCalendarioVisivel(false);
                        }}
                        markedDates={{
                          [form.dataISO]: {
                            selected: true,
                            selectedColor: "#00FFD1",
                          },
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
                        style={estilos.botaoCancelarCalendario}
                        onPress={() => setCalendarioVisivel(false)}
                      >
                        <Text style={{ color: "#888", fontWeight: "600" }}>
                          Cancelar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>

              <Text style={[estilos.rotulo, { marginTop: 20 }]}>
                LOCALIZAÇÃO
              </Text>
              {modoEdicao ? (
                <>
                  <TextInput
                    style={[estilos.input, { marginBottom: 8 }]}
                    value={form.endereco}
                    onChangeText={(v) =>
                      setForm((f) => ({ ...f, endereco: v }))
                    }
                    placeholder="Endereço"
                    placeholderTextColor="#555"
                  />
                  <TextInput
                    style={estilos.input}
                    value={form.cidade}
                    onChangeText={(v) => setForm((f) => ({ ...f, cidade: v }))}
                    placeholder="Cidade"
                    placeholderTextColor="#555"
                  />
                </>
              ) : (
                <>
                  <Text style={estilos.valor}>{evento.endereco}</Text>
                  <Text style={estilos.subvalor}>{evento.cidade}</Text>
                </>
              )}

              <Text style={[estilos.rotulo, { marginTop: 20 }]}>
                ORGANIZADO POR
              </Text>
              <View style={estilos.criadorRow}>
                <View style={[estilos.avatarCriador, { backgroundColor: "#00FFD122" }]}>
                  <MaterialCommunityIcons name="account-group" size={18} color="#00FFD1" />
                </View>
                <View>
                  <Text style={estilos.criadorNome}>{evento.grupo}</Text>
                  <Text style={estilos.criadorRole}>Grupo organizador</Text>
                </View>
              </View>

              <View style={estilos.divisor} />

              <Text style={estilos.rotulo}>DESCRIÇÃO</Text>
              {modoEdicao ? (
                <TextInput
                  style={[
                    estilos.input,
                    { minHeight: 80, textAlignVertical: "top" },
                  ]}
                  value={form.descricao}
                  onChangeText={(v) => setForm((f) => ({ ...f, descricao: v }))}
                  placeholder="Descrição do evento"
                  placeholderTextColor="#555"
                  multiline
                />
              ) : (
                <Text style={estilos.descricao}>{evento.descricao}</Text>
              )}

              <TouchableOpacity
                onPress={abrirListaParticipantes}
                style={estilos.participantesHeader}
              >
                <Text
                  style={[estilos.rotulo, { marginTop: 20, marginBottom: 0 }]}
                >
                  PARTICIPANTES ({evento.participantesCount}/{evento.total})
                </Text>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  size={11}
                  color="#555"
                  style={{ marginTop: 20 }}
                />
              </TouchableOpacity>
              <View style={estilos.participantesRow}>
                <Text style={estilos.vagasTexto}>
                  {vagasRestantes > 0
                    ? `${vagasRestantes} vaga${vagasRestantes !== 1 ? "s" : ""} restante${vagasRestantes !== 1 ? "s" : ""}`
                    : "Evento lotado"}
                </Text>
              </View>

              <Modal
                transparent
                visible={listaParticipantesVisivel}
                animationType="slide"
                onRequestClose={() => setListaParticipantesVisivel(false)}
              >
                <Pressable
                  style={estilos.overlay}
                  onPress={() => setListaParticipantesVisivel(false)}
                >
                  <Pressable onPress={() => {}}>
                    <View style={estilos.listaSheet}>
                      <View style={estilos.handle} />
                      <View style={estilos.listaHeader}>
                        <Text style={estilos.listaTitulo}>
                          Participantes ({evento.participantesCount})
                        </Text>
                        <TouchableOpacity
                          onPress={() => setListaParticipantesVisivel(false)}
                          style={estilos.botaoFechar}
                        >
                          <FontAwesomeIcon
                            icon={faXmark}
                            size={14}
                            color="#888"
                          />
                        </TouchableOpacity>
                      </View>
                      {carregandoParticipantes ? (
                        <ActivityIndicator
                          color="#00FFD1"
                          style={{ marginTop: 24 }}
                        />
                      ) : participantes.length === 0 ? (
                        <Text style={estilos.semParticipantes}>
                          Nenhum participante ainda.
                        </Text>
                      ) : (
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          style={{ maxHeight: 400 }}
                        >
                          {participantes.map((p) => (
                            <View
                              key={p.userId}
                              style={estilos.participanteItem}
                            >
                              <View
                                style={[
                                  estilos.avatarCriador,
                                  { backgroundColor: p.corAvatar },
                                ]}
                              >
                                <Text style={estilos.avatarCriadorTexto}>
                                  {p.iniciais}
                                </Text>
                              </View>
                              <Text style={estilos.participanteNome}>
                                {p.nome}
                              </Text>
                            </View>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>

              {erroParticipacao && (
                <Text style={estilos.erroTexto}>{erroParticipacao}</Text>
              )}

              {modoEdicao ? (
                <TouchableOpacity
                  style={estilos.botaoSalvar}
                  onPress={handleSalvar}
                >
                  <Text style={estilos.botaoParticiparTexto}>
                    Salvar Alterações
                  </Text>
                </TouchableOpacity>
              ) : isOrganizador ? (
                <TouchableOpacity
                  style={estilos.botaoEditar}
                  onPress={() => setModoEdicao(true)}
                >
                  <Text style={estilos.botaoEditarTexto}>Editar Evento</Text>
                </TouchableOpacity>
              ) : isParticipante ? (
                <>
                  <View style={estilos.bannerInscrito}>
                    <Text style={estilos.bannerInscritoTexto}>
                      Você está inscrito neste evento
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={estilos.botaoCancelarParticipacao}
                    onPress={handleCancelarParticipacao}
                    disabled={inscrevendo}
                  >
                    <Text style={estilos.botaoCancelarParticipacaoTexto}>
                      {inscrevendo ? "Cancelando..." : "Cancelar Participação"}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[
                    estilos.botaoParticipar,
                    inscrevendo && { opacity: 0.6 },
                  ]}
                  onPress={handleParticipar}
                  disabled={inscrevendo}
                >
                  <Text style={estilos.botaoParticiparTexto}>
                    {inscrevendo ? "Inscrevendo..." : "Participar do Evento"}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ModalEvento;

const estilos = StyleSheet.create({
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
  participantesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  listaSheet: {
    backgroundColor: "#111",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  listaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listaTitulo: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  semParticipantes: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  participanteItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  participanteNome: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  bannerInscrito: {
    backgroundColor: "#00FFD122",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 24,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#00FFD144",
    alignItems: "center",
  },
  bannerInscritoTexto: {
    color: "#00FFD1",
    fontSize: 13,
    fontWeight: "600",
  },
  botaoCancelarParticipacao: {
    backgroundColor: "#1a1a2e",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff444466",
  },
  botaoCancelarParticipacaoTexto: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "700",
  },
  erroTexto: {
    color: "#ff4444",
    fontSize: 13,
    textAlign: "center",
    marginTop: 16,
  },
});
