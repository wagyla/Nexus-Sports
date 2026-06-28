import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  FormField,
  ChipSelector,
  PrimaryButton,
  RowFields,
  ChipOption,
} from "@/src/components/Formulario";
import { router, useLocalSearchParams } from "expo-router";

const ESPORTES: ChipOption[] = [
  { label: "Corrida", value: "corrida" },
  { label: "Tênis", value: "tenis" },
  { label: "Vôlei", value: "volei" },
  { label: "Ciclismo", value: "ciclismo" },
  { label: "Futebol", value: "futebol" },
  { label: "+Outro", value: "outro" },
];

const NIVEIS: ChipOption[] = [
  { label: "Iniciante", value: "iniciante" },
  { label: "Recreação", value: "recreacao" },
  { label: "Avançado", value: "avancado" },
  { label: "+Outro", value: "outro" },
];

const NewEvent = () => {
  const { grupoId, grupoNome } = useLocalSearchParams<{ grupoId: string; grupoNome: string }>();
  const [nomeEvento, setNomeEvento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [vagas, setVagas] = useState("");
  const [esportes, setEsportes] = useState<string[]>([]);
  const [nivel, setNivel] = useState<string[]>([]);

  const toggleEsporte = (value: string) =>
    setEsportes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const toggleNivel = (value: string) =>
    setNivel((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const handleCriarEvento = () => {
    console.log({
      nomeEvento,
      grupoId,
      grupoNome,
      descricao,
      data,
      horario,
      local,
      vagas,
      esportes,
      nivel,
    });
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
            label="Esportes"
            options={ESPORTES}
            selected={esportes}
            onToggle={toggleEsporte}
          />

          <FormField
            label="Nome do Evento"
            placeholder="Ex: Futevôlei na Prainha"
            value={nomeEvento}
            onChangeText={setNomeEvento}
          />

          <FormField
            label="Descrição:"
            placeholder="Ex: Corrida de 5km"
            value={descricao}
            onChangeText={setDescricao}
            multiline
            numberOfLines={3}
            style={{ height: 80, textAlignVertical: "top", paddingTop: 12 }}
          />

          <RowFields>
            <View style={{ flex: 1 }}>
              <FormField
                label="Data:"
                placeholder="xx/xx/xxxx"
                value={data}
                onChangeText={setData}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label="Horário:"
                placeholder="xx:xx"
                value={horario}
                onChangeText={setHorario}
                keyboardType="numeric"
              />
            </View>
          </RowFields>

          <RowFields>
            <View style={{ flex: 1 }}>
              <FormField
                label="Local:"
                placeholder="Ex: Praia"
                value={local}
                onChangeText={setLocal}
              />
            </View>
            <View style={{ flex: 0.5 }}>
              <FormField
                label="Vagas:"
                placeholder="20"
                value={vagas}
                onChangeText={setVagas}
                keyboardType="numeric"
              />
            </View>
          </RowFields>

          <PrimaryButton
            title="Criar Evento"
            onPress={handleCriarEvento}
            style={{ marginTop: 8 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewEvent;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    padding: 37,
    paddingTop: 40,
    paddingBottom: 40,
  },
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
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
  },
});
