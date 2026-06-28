import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FormField,
  ChipSelector,
  PrimaryButton,
  ChipOption,
} from "@/src/components/Formulario";
import { router } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { postCreateGrupo } from "@/src/api/grupos";
import type { GrupoForm } from "@/src/types";

const FORM_INICIAL: GrupoForm = {
  nome: "",
  descricao: "",
  esporte: "",
  cidade: "",
  privado: false,
};

const ESPORTES: ChipOption[] = [
  { label: "Corrida", value: "corrida" },
  { label: "Tênis", value: "tenis" },
  { label: "Vôlei", value: "volei" },
  { label: "Ciclismo", value: "ciclismo" },
  { label: "Futebol", value: "futebol" },
  { label: "Outro", value: "outro" },
];

const NewGroup = () => {
  const { user } = useAuth();
  const [grupo, setGrupo] = useState<GrupoForm>(FORM_INICIAL);

  const set =
    <K extends keyof GrupoForm>(campo: K) =>
    (valor: GrupoForm[K]) =>
      setGrupo((prev) => ({ ...prev, [campo]: valor }));

  const toggleEsporte = (value: string) =>
    setGrupo((prev) => ({
      ...prev,
      esporte: prev.esporte === value ? "" : value,
    }));

  const handleCriarGrupo = async () => {
    if (!user) return;
    const { error } = await postCreateGrupo(grupo, user.id);
    if (error) {
      console.error("Erro ao criar grupo:", error);
      return;
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Criar Grupo</Text>
          </View>

          <ChipSelector
            label="Esporte"
            options={ESPORTES}
            selected={grupo.esporte ? [grupo.esporte] : []}
            onToggle={toggleEsporte}
          />

          <FormField
            label="Nome do Grupo"
            placeholder="Ex: Futevôlei na Prainha"
            value={grupo.nome}
            onChangeText={set("nome")}
          />

          <FormField
            label="Cidade"
            placeholder="Ex: Almenara"
            value={grupo.cidade}
            onChangeText={set("cidade")}
          />

          <FormField
            label="Descrição"
            placeholder="Fale um pouco sobre o grupo..."
            value={grupo.descricao}
            onChangeText={set("descricao")}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
          />

          <View style={styles.privadoRow}>
            <View>
              <Text style={styles.privadoLabel}>Grupo privado</Text>
              <Text style={styles.privadoSub}>
                {grupo.privado
                  ? "Somente por convite"
                  : "Qualquer pessoa pode encontrar"}
              </Text>
            </View>
            <Switch
              value={grupo.privado}
              onValueChange={set("privado")}
              trackColor={{ false: "#333", true: "#00FFD155" }}
              thumbColor={grupo.privado ? "#00FFD1" : "#666"}
            />
          </View>

          <PrimaryButton
            title="Criar Grupo"
            onPress={handleCriarGrupo}
            style={{ marginTop: 24 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewGroup;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },
  scroll: { padding: 24, paddingTop: 40, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  backIcon: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -4,
  },
  headerTitle: { color: "#fff", fontSize: 26, fontWeight: "700" },
  privadoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#222",
  },
  privadoLabel: { color: "#fff", fontSize: 15, fontWeight: "600" },
  privadoSub: { color: "#666", fontSize: 12, marginTop: 2 },
});
