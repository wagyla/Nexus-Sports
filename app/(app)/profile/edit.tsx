import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { ChipSelector, ChipOption } from "@/src/components/Formulario";
import { useAuth } from "@/src/contexts/AuthContext";
import { supabase } from "@/utils/supabase";

const ESPORTES: ChipOption[] = [
  { label: "Corrida", value: "corrida" },
  { label: "Tênis", value: "tenis" },
  { label: "Vôlei", value: "volei" },
  { label: "Ciclismo", value: "ciclismo" },
  { label: "Capoeira", value: "capoeira" },
  { label: "Natação", value: "natacao" },
  { label: "+Outro", value: "outro" },
];

const EditProfile = () => {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [email, setEmail] = useState("");
  const [esportes, setEsportes] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!user) return;
    setNome(user.user_metadata?.nome ?? "");
    setCidade(user.user_metadata?.cidade ?? "");
    setEmail(user.email ?? "");
    setEsportes(user.user_metadata?.esportes ?? []);
  }, [user]);

  const toggleEsporte = (value: string) =>
    setEsportes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );

  const iniciais = nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");

  const handleSalvar = async () => {
    if (!nome.trim()) {
      Alert.alert("Campo obrigatório", "Informe seu nome.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("E-mail inválido", "O e-mail informado não contém '@'.");
      return;
    }
    setSalvando(true);
    const { error } = await supabase.auth.updateUser({
      email,
      data: { nome, cidade, esportes },
    });
    setSalvando(false);
    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }
    router.push("/(app)/profile");
  };

  return (
    <SafeAreaView style={estilos.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={estilos.scroll}
        >
          <View style={estilos.cabecalho}>
            <TouchableOpacity
              style={estilos.botaoVoltar}
              onPress={() => router.push("/(app)/profile")}
            >
              <Text style={estilos.botaoVoltarTexto}>‹</Text>
              <Text style={estilos.titulo}>Editar Perfil</Text>
            </TouchableOpacity>
          </View>

          <View style={estilos.avatarContainer}>
            <View style={estilos.avatar}>
              <Text style={estilos.avatarTexto}>{iniciais || "?"}</Text>
            </View>
            <Text style={estilos.avatarDica}>
              Gerado pelas iniciais do nome
            </Text>
          </View>

          <Text style={estilos.secaoTitulo}>INFORMAÇÕES PESSOAIS</Text>

          <Text style={estilos.label}>Nome completo</Text>
          <View style={estilos.boxInput}>
            <TextInput
              style={estilos.input}
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#555"
              autoCapitalize="words"
            />
          </View>

          <Text style={estilos.label}>E-mail</Text>
          <View style={estilos.boxInput}>
            <TextInput
              style={estilos.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#555"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={estilos.label}>Cidade</Text>
          <View style={estilos.boxInput}>
            <TextInput
              style={estilos.input}
              value={cidade}
              onChangeText={setCidade}
              placeholderTextColor="#555"
            />
          </View>

          <Text style={[estilos.secaoTitulo, { marginTop: 10 }]}>
            ESPORTES FAVORITOS
          </Text>
          <ChipSelector
            options={ESPORTES}
            selected={esportes}
            onToggle={toggleEsporte}
          />

          <TouchableOpacity style={estilos.botaoSalvar} onPress={handleSalvar} disabled={salvando}>
            <Text style={estilos.botaoSalvarTexto}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoCancelar}
            onPress={() => router.push("/(app)/profile")}
          >
            <Text style={estilos.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scroll: {
    paddingHorizontal: 37,
    paddingTop: 40,
    paddingBottom: 60,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  botaoVoltar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  botaoVoltarTexto: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
    marginTop: -4,
  },
  titulo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#00FFD133",
    borderWidth: 1.5,
    borderColor: "#00FFD1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarTexto: {
    color: "#00FFD1",
    fontSize: 30,
    fontWeight: "bold",
  },
  avatarDica: {
    color: "#555",
    fontSize: 12,
  },
  secaoTitulo: {
    color: "#555",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 14,
  },
  label: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 6,
    marginLeft: 2,
  },
  boxInput: {
    width: "100%",
    height: 48,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#333",
    backgroundColor: "#111",
    paddingHorizontal: 15,
    justifyContent: "center",
    marginBottom: 14,
  },
  input: {
    color: "#fff",
    fontSize: 14,
  },
  botaoSalvar: {
    width: "100%",
    height: 50,
    backgroundColor: "#00FFD1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  botaoSalvarTexto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  botaoCancelar: {
    width: "100%",
    height: 50,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  botaoCancelarTexto: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
});
