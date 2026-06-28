import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import WheelTimePicker from "@/src/components/WheelTimePicker";
import {
  FormField,
  ChipSelector,
  PrimaryButton,
  RowFields,
  ChipOption,
} from "@/src/components/Formulario";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";
import { postCreateEvento } from "@/src/api/eventos";
import { hojeISO } from "@/src/components/helpers";
import type { EventoForm } from "@/src/types";

const ESPORTES: ChipOption[] = [
  { label: "Corrida", value: "corrida" },
  { label: "Tênis", value: "tenis" },
  { label: "Vôlei", value: "volei" },
  { label: "Ciclismo", value: "ciclismo" },
  { label: "Futebol", value: "futebol" },
  { label: "+Outro", value: "outro" },
];

const formInicial = (): EventoForm => {
  const agora = new Date();
  return {
    nome: "",
    descricao: "",
    esporte: "",
    endereco: "",
    cidade: "",
    data: "",
    hora: `${String(agora.getHours()).padStart(2, "0")}:${String(agora.getMinutes()).padStart(2, "0")}`,
    vagas: "",
  };
};

type Erros = Partial<Record<keyof EventoForm | "geral", string>>;

const validar = (evento: EventoForm, grupoId?: string): Erros => {
  const erros: Erros = {};

  if (!evento.nome.trim())
    erros.nome = "Nome do evento é obrigatório.";
  else if (evento.nome.trim().length < 3)
    erros.nome = "Nome deve ter pelo menos 3 caracteres.";

  if (!evento.esporte)
    erros.esporte = "Selecione um esporte.";

  if (!evento.data)
    erros.data = "Informe a data do evento.";

  if (!evento.hora)
    erros.hora = "Informe o horário do evento.";

  if (evento.vagas) {
    const n = parseInt(evento.vagas, 10);
    if (isNaN(n) || n <= 0)
      erros.vagas = "Informe um número de vagas válido.";
    else if (n > 1000)
      erros.vagas = "Máximo de 1000 vagas.";
  }

  if (!grupoId)
    erros.geral = "Nenhum grupo selecionado.";

  return erros;
};

const formatarDataExibicao = (dataISO: string) => {
  const [a, m, d] = dataISO.split("-");
  return `${d}/${m}/${a}`;
};

const NewEventScreen = () => {
  const { user } = useAuth();
  const { grupoId } = useLocalSearchParams<{ grupoId: string }>();
  const [evento, setEvento] = useState<EventoForm>(formInicial);
  const [erros, setErros] = useState<Erros>({});
  const [salvando, setSalvando] = useState(false);
  const [calendarioVisivel, setCalendarioVisivel] = useState(false);

  const set =
    <K extends keyof EventoForm>(campo: K) =>
    (valor: EventoForm[K]) => {
      setEvento((prev) => ({ ...prev, [campo]: valor }));
      if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
    };

  const handleCriarEvento = async () => {
    const novosErros = validar(evento, grupoId);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    if (!user) return;

    setSalvando(true);
    const { error } = await postCreateEvento(evento, grupoId, user.id);
    setSalvando(false);

    if (error) {
      console.error("Erro ao criar evento:", error);
      setErros({ geral: "Não foi possível criar o evento. Tente novamente." });
      return;
    }

    router.replace("/(app)/feed");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            <Text style={styles.headerTitle}>Criar Evento</Text>
          </View>

          <ChipSelector
            label="Esporte"
            options={ESPORTES}
            selected={evento.esporte ? [evento.esporte] : []}
            onToggle={(value) => {
              setEvento((prev) => ({ ...prev, esporte: prev.esporte === value ? "" : value }));
              setErros((prev) => ({ ...prev, esporte: undefined }));
            }}
          />
          {erros.esporte && <Text style={styles.erro}>{erros.esporte}</Text>}

          <FormField
            label="Nome do Evento"
            placeholder="Ex: Futevôlei na Prainha"
            value={evento.nome}
            onChangeText={set("nome")}
          />
          {erros.nome && <Text style={styles.erro}>{erros.nome}</Text>}

          <FormField
            label="Descrição"
            placeholder="Fale um pouco sobre o evento..."
            value={evento.descricao}
            onChangeText={set("descricao")}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
          />

          <Text style={styles.label}>DATA</Text>
          <TouchableOpacity
            style={[styles.seletorData, erros.data ? styles.seletorDataErro : undefined]}
            onPress={() => setCalendarioVisivel(true)}
          >
            <Text style={{ color: evento.data ? "#fff" : "#555", fontSize: 14 }}>
              {evento.data ? formatarDataExibicao(evento.data) : "DD/MM/AAAA"}
            </Text>
          </TouchableOpacity>
          {erros.data && <Text style={styles.erro}>{erros.data}</Text>}

          <Text style={[styles.label, { marginTop: 4 }]}>HORÁRIO</Text>
          <WheelTimePicker
            value={evento.hora}
            onChange={(t) => {
              setEvento((prev) => ({ ...prev, hora: t }));
              setErros((prev) => ({ ...prev, hora: undefined }));
            }}
          />
          {erros.hora && <Text style={styles.erro}>{erros.hora}</Text>}

          <FormField
            label="Endereço"
            placeholder="Ex: Rua das Flores, 123"
            value={evento.endereco}
            onChangeText={set("endereco")}
          />

          <RowFields>
            <View style={{ flex: 1 }}>
              <FormField
                label="Cidade"
                placeholder="Ex: Almenara"
                value={evento.cidade}
                onChangeText={set("cidade")}
              />
            </View>
            <View style={{ flex: 0.5 }}>
              <FormField
                label="Vagas"
                placeholder="20"
                value={evento.vagas}
                onChangeText={set("vagas")}
                keyboardType="numeric"
              />
              {erros.vagas && <Text style={styles.erro}>{erros.vagas}</Text>}
            </View>
          </RowFields>

          {erros.geral && <Text style={styles.erroGeral}>{erros.geral}</Text>}

          <PrimaryButton
            title={salvando ? "Salvando..." : "Criar Evento"}
            onPress={handleCriarEvento}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        visible={calendarioVisivel}
        animationType="fade"
        onRequestClose={() => setCalendarioVisivel(false)}
      >
        <Pressable
          style={styles.overlayCalendario}
          onPress={() => setCalendarioVisivel(false)}
        >
          <Pressable onPress={() => {}}>
            <View style={styles.containerCalendario}>
              <Text style={styles.tituloCalendario}>Selecione a data</Text>
              <Calendar
                current={evento.data || hojeISO}
                minDate={hojeISO}
                onDayPress={(day) => {
                  setEvento((prev) => ({ ...prev, data: day.dateString }));
                  setErros((prev) => ({ ...prev, data: undefined }));
                  setCalendarioVisivel(false);
                }}
                markedDates={{
                  [evento.data]: { selected: true, selectedColor: "#00FFD1" },
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
                style={styles.botaoCancelarCalendario}
                onPress={() => setCalendarioVisivel(false)}
              >
                <Text style={{ color: "#888", fontWeight: "600" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default NewEventScreen;

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
  label: {
    color: "#888",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 6,
  },
  seletorData: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 13,
    marginBottom: 14,
  },
  seletorDataErro: {
    borderColor: "#ff4d4d",
  },
  erro: { color: "#ff4d4d", fontSize: 12, marginTop: -8, marginBottom: 8, marginLeft: 2 },
  erroGeral: {
    color: "#ff4d4d",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 8,
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
