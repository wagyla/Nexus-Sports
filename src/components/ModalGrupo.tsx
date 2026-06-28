import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/src/contexts/AuthContext";
import { deleteGrupo, postEntrarGrupo, deleteSairDoGrupo } from "@/src/api/grupos";
import type { GrupoDisplay } from "@/src/types";

type Props = {
  grupo: GrupoDisplay | undefined;
  visivel: boolean;
  isMembro: boolean;
  onFechar: () => void;
  onDeletado?: () => void;
  onEntrou?: () => void;
};

const InfoLinha = ({ rotulo, valor }: { rotulo: string; valor: string }) => (
  <>
    <Text style={estilos.rotulo}>{rotulo}</Text>
    <Text style={estilos.valor}>{valor}</Text>
  </>
);

const ModalGrupo = ({ grupo, visivel, isMembro, onFechar, onDeletado, onEntrou }: Props) => {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const { user } = useAuth();
  const [excluindo, setExcluindo] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | undefined>(undefined);
  const [entrando, setEntrando] = useState(false);
  const [entrou, setEntrou] = useState(false);
  const [erroEntrada, setErroEntrada] = useState<string | undefined>(undefined);
  const [confirmandoSaida, setConfirmandoSaida] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [erroSaida, setErroSaida] = useState<string | undefined>(undefined);

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
      setConfirmando(false);
      setErro(undefined);
      setEntrou(false);
      setErroEntrada(undefined);
      setConfirmandoSaida(false);
      setErroSaida(undefined);
    }
  }, [visivel]);

  if (!grupo) return null;

  const confirmarSaida = async () => {
    if (!user) return;
    setSaindo(true);
    setErroSaida(undefined);
    const { error } = await deleteSairDoGrupo(grupo.id, user.id);
    setSaindo(false);
    if (error) {
      setErroSaida("Não foi possível sair do grupo. Tente novamente.");
      return;
    }
    onFechar();
    onDeletado?.();
  };

  const handleEntrar = async () => {
    if (!user) return;
    setEntrando(true);
    setErroEntrada(undefined);
    const { error } = await postEntrarGrupo(grupo.id, user.id);
    setEntrando(false);
    if (error) {
      setErroEntrada("Não foi possível entrar no grupo. Tente novamente.");
      return;
    }
    setEntrou(true);
    onEntrou?.();
  };

  const confirmarExclusao = async () => {
    if (!user) return;
    setExcluindo(true);
    setErro(undefined);
    const { error } = await deleteGrupo(grupo.id, user.id);
    setExcluindo(false);
    if (error) {
      setErro("Não foi possível excluir o grupo. Tente novamente.");
      return;
    }
    onFechar();
    onDeletado?.();
  };

  return (
    <Modal transparent visible={visivel} animationType="none" onRequestClose={onFechar}>
      <Pressable style={estilos.overlay} onPress={onFechar}>
        <Animated.View style={[estilos.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <Pressable>
            <View style={estilos.handle} />

            <View style={estilos.cabecalho}>
              <TouchableOpacity onPress={onFechar} style={estilos.botaoFechar}>
                <FontAwesomeIcon icon={faXmark} size={14} color="#888" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={estilos.titulo}>{grupo.nome}</Text>

              <View style={estilos.divisor} />

              <InfoLinha rotulo="ESPORTE" valor={grupo.esporte} />
              <View style={{ height: 20 }} />
              <InfoLinha rotulo="LOCAL" valor={grupo.local} />
              <View style={{ height: 20 }} />
              <InfoLinha rotulo="MEMBROS" valor={`${grupo.membros} participantes`} />
              <View style={{ height: 20 }} />
              <InfoLinha
                rotulo="EVENTOS ATIVOS"
                valor={`${grupo.eventos} evento${grupo.eventos !== 1 ? "s" : ""}`}
              />

              <View style={estilos.divisor} />

              <Text style={estilos.rotulo}>DESCRIÇÃO</Text>
              <Text style={estilos.descricao}>{grupo.descricao || "Sem descrição."}</Text>

              {grupo.participantes.length > 0 && (
                <>
                  <Text style={[estilos.rotulo, { marginTop: 20 }]}>ALGUNS MEMBROS</Text>
                  <View style={estilos.participantesRow}>
                    {grupo.participantes.map((p, i) => (
                      <View
                        key={i}
                        style={[
                          estilos.miniAvatar,
                          { backgroundColor: grupo.coresAvatar[i], marginLeft: i === 0 ? 0 : -8 },
                        ]}
                      >
                        <Text style={estilos.miniAvatarTexto}>{p}</Text>
                      </View>
                    ))}
                    <Text style={estilos.maisTexto}>
                      +{grupo.membros - grupo.participantes.length} outros
                    </Text>
                  </View>
                </>
              )}

              {grupo.isAdmin ? (
                confirmando ? (
                  <View style={estilos.confirmacaoContainer}>
                    <Text style={estilos.confirmacaoTexto}>
                      Excluir "{grupo.nome}"? Esta ação remove o grupo e todos os seus eventos e não pode ser desfeita.
                    </Text>
                    {erro && <Text style={estilos.erroTexto}>{erro}</Text>}
                    <TouchableOpacity
                      style={estilos.botaoConfirmar}
                      onPress={confirmarExclusao}
                      disabled={excluindo}
                      activeOpacity={0.7}
                    >
                      <Text style={estilos.botaoConfirmarTexto}>
                        {excluindo ? "Excluindo..." : "Confirmar exclusão"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={estilos.botaoCancelarConfirmacao}
                      onPress={() => { setConfirmando(false); setErro(undefined); }}
                      disabled={excluindo}
                      activeOpacity={0.7}
                    >
                      <Text style={estilos.botaoCancelarConfirmacaoTexto}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={estilos.botaoExcluir}
                    onPress={() => setConfirmando(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={estilos.botaoExcluirTexto}>Excluir Grupo</Text>
                  </TouchableOpacity>
                )
              ) : isMembro ? (
                confirmandoSaida ? (
                  <View style={estilos.confirmacaoSaidaContainer}>
                    <Text style={estilos.confirmacaoTexto}>
                      Sair de "{grupo.nome}"? Você poderá entrar novamente depois.
                    </Text>
                    {erroSaida && <Text style={estilos.erroTexto}>{erroSaida}</Text>}
                    <TouchableOpacity
                      style={estilos.botaoConfirmarSaida}
                      onPress={confirmarSaida}
                      disabled={saindo}
                      activeOpacity={0.7}
                    >
                      <Text style={estilos.botaoSairTexto}>
                        {saindo ? "Saindo..." : "Confirmar saída"}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={estilos.botaoCancelarConfirmacao}
                      onPress={() => { setConfirmandoSaida(false); setErroSaida(undefined); }}
                      disabled={saindo}
                      activeOpacity={0.7}
                    >
                      <Text style={estilos.botaoCancelarConfirmacaoTexto}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={estilos.botaoSair}
                    onPress={() => setConfirmandoSaida(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={estilos.botaoSairTexto}>Sair do Grupo</Text>
                  </TouchableOpacity>
                )
              ) : entrou ? (
                <View style={estilos.sucessoContainer}>
                  <Text style={estilos.sucessoTexto}>Você entrou em "{grupo.nome}"!</Text>
                </View>
              ) : (
                <View style={{ marginTop: 24 }}>
                  {erroEntrada && <Text style={estilos.erroEntradaTexto}>{erroEntrada}</Text>}
                  <TouchableOpacity
                    style={[estilos.botaoEntrar, entrando && { opacity: 0.6 }]}
                    onPress={handleEntrar}
                    disabled={entrando}
                    activeOpacity={0.7}
                  >
                    <Text style={estilos.botaoEntrarTexto}>
                      {entrando ? "Entrando..." : "Entrar no Grupo"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

export default ModalGrupo;

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
  cabecalho: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  botaoFechar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: { color: "#ffffff", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  divisor: { height: 1, backgroundColor: "#222", marginVertical: 16 },
  rotulo: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  valor: { color: "#ffffff", fontSize: 14, fontWeight: "500" },
  descricao: { color: "#ccc", fontSize: 13, lineHeight: 20, marginTop: 4 },
  participantesRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  miniAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#111",
  },
  miniAvatarTexto: { color: "#fff", fontSize: 10, fontWeight: "700" },
  maisTexto: { color: "#555", fontSize: 13, marginLeft: 10 },
  botaoEntrar: {
    backgroundColor: "#00FFD1",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  botaoEntrarTexto: { color: "#000", fontSize: 16, fontWeight: "700" },
  botaoSair: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  botaoSairTexto: { color: "#888", fontSize: 16, fontWeight: "600" },
  botaoExcluir: {
    backgroundColor: "#FF000015",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  botaoExcluirTexto: { color: "#FF4444", fontSize: 16, fontWeight: "600" },
  confirmacaoSaidaContainer: {
    marginTop: 24,
    backgroundColor: "#0a0a1a",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#444",
    gap: 10,
  },
  botaoConfirmarSaida: {
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555",
  },
  confirmacaoContainer: {
    marginTop: 24,
    backgroundColor: "#1a0a0a",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FF4444",
    gap: 10,
  },
  confirmacaoTexto: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  erroTexto: {
    color: "#FF4444",
    fontSize: 12,
  },
  botaoConfirmar: {
    backgroundColor: "#FF4444",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  botaoConfirmarTexto: { color: "#fff", fontSize: 15, fontWeight: "700" },
  botaoCancelarConfirmacao: {
    backgroundColor: "#222",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  botaoCancelarConfirmacaoTexto: { color: "#888", fontSize: 15, fontWeight: "600" },
  sucessoContainer: {
    marginTop: 24,
    backgroundColor: "#00FFD115",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#00FFD1",
  },
  sucessoTexto: { color: "#00FFD1", fontSize: 15, fontWeight: "600" },
  erroEntradaTexto: {
    color: "#FF4444",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 2,
  },
});
