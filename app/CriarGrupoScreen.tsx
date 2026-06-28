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
} from "@/src/componentes/Formulario";
import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { SupabaseTablesEnum } from "@/utils/Enums";

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

export default function CriarGrupoScreen({ navigation }: any) {
  const [nomeGrupo, setNomeGrupo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [local, setLocal] = useState("");
  const [vagas, setVagas] = useState("");
  const [esportes, setEsportes] = useState<string[]>([]);
  const [nivel, setNivel] = useState<string[]>([]);
  const [membros, setMembros] = useState<string[]>([]);
  const [novoMembro, setNovoMembro] = useState("");

  const toggleEsporte = (value: string) =>
    setEsportes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const toggleNivel = (value: string) =>
    setNivel((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const adicionarMembro = () => {
    const email = novoMembro.trim();
    setMembros((prev) =>
      [...prev.filter((m) => m !== email), email].filter(Boolean),
    );
    setNovoMembro("");
  };

  const handleCriarGrupo = async() => {
    console.log("YAHUUU")
    try {
      const result = await supabase.from(SupabaseTablesEnum.GRUPOS).insert({
        nome: nomeGrupo,
        descricao: descricao,
        esporte: esportes[0] ?? undefined,
        cidade: "Almenara",
        privado: false,
      })

      console.log(result)
    }catch(err){
      console.error(err)
    }

    console.log({
      nomeGrupo,
      descricao,
      data,
      horario,
      local,
      vagas,
      esportes,
      nivel,
      membros,
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
            <Text style={styles.headerTitle}>Criar Grupo</Text>
          </View>

          <ChipSelector
            label="Esportes"
            options={ESPORTES}
            selected={esportes}
            onToggle={toggleEsporte}
          />

          <FormField
            label="Nome do Grupo"
            placeholder="Ex: Futevôlei na Prainha"
            value={nomeGrupo}
            onChangeText={setNomeGrupo}
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

          <Text style={styles.sectionLabel}>Adicionar membro:</Text>
          <View style={styles.addMemberRow}>
            <FormField
              placeholder="Ex: exemplo@email.com"
              value={novoMembro}
              onChangeText={setNovoMembro}
              containerStyle={{ flex: 1, marginBottom: 0 }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addBtn} onPress={adicionarMembro}>
              <Text style={styles.addBtnText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.membersList}>
            {membros.map((m) => (
              <View key={m} style={styles.memberBadge}>
                <Text style={styles.memberText}>{m}</Text>
              </View>
            ))}
          </View>

          <PrimaryButton
            title="Criar Grupo"
            onPress={handleCriarGrupo}
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  sectionLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 2,
    marginTop: 4,
  },
  addMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addBtn: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#00FFD1",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 14,
  },
  addBtnText: {
    color: "#00FFD1",
    fontSize: 13,
    fontWeight: "600",
  },
  membersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
    marginBottom: 4,
  },
  memberBadge: {
    backgroundColor: "#111",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#333",
  },
  memberText: {
    color: "#aaa",
    fontSize: 12,
  },
});
