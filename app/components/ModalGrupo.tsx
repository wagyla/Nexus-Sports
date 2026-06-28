import { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import type { GrupoDisplay } from "./types";

type Props = {
  grupo: GrupoDisplay | null;
  visivel: boolean;
  isMembro: boolean;
  onFechar: () => void;
};

const InfoLinha = ({ rotulo, valor }: { rotulo: string; valor: string }) => (
  <>
    <Text style={estilos.rotulo}>{rotulo}</Text>
    <Text style={estilos.valor}>{valor}</Text>
  </>
);

const ModalGrupo = ({ grupo, visivel, isMembro, onFechar }: Props) => {
  const slideAnim = useRef(new Animated.Value(600)).current;

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
    }
  }, [visivel]);

  if (!grupo) return null;

  const onSair = () => {
    onFechar();
    Alert.alert("Saiu do grupo", `Você saiu de "${grupo.nome}".`);
  };

  const onEntrar = () => {
    onFechar();
    Alert.alert("Solicitação enviada", `Você pediu para entrar em "${grupo.nome}".`);
  };

  return (
    <Modal transparent visible={visivel} animationType="none" onRequestClose={onFechar}>
      <Pressable style={estilos.overlay} onPress={onFechar}>
        <Animated.View style={[estilos.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <Pressable>
            <View style={estilos.handle} />

            <View style={estilos.cabecalho}>
              <TouchableOpacity onPress={onFechar} style={estilos.botaoFechar}>
                <Text style={estilos.botaoFecharTexto}>✕</Text>
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

              {isMembro ? (
                <TouchableOpacity style={estilos.botaoSair} onPress={onSair}>
                  <Text style={estilos.botaoSairTexto}>Sair do Grupo</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={estilos.botaoEntrar} onPress={onEntrar}>
                  <Text style={estilos.botaoEntrarTexto}>Entrar no Grupo</Text>
                </TouchableOpacity>
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
  botaoFecharTexto: { color: "#888", fontSize: 14, fontWeight: "600" },
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
});
