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
import { router } from "expo-router";
import { supabase } from "@/utils/supabase";
import { saveData } from "@/utils/Storage";
import { SessionStorageKeysEnum } from "@/utils/Enums";

const SPORTS: ChipOption[] = [
  { label: "Corrida", value: "corrida" },
  { label: "Tênis", value: "tenis" },
  { label: "Vôlei", value: "volei" },
  { label: "Ciclismo", value: "ciclismo" },
  { label: "Futebol", value: "futebol" },
  { label: "+Outro", value: "outro" },
];

const Register = () => {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");
  const [senha, setSenha] = useState("");
  const [esportesFavoritos, setEsportesFavoritos] = useState<string[]>([]);

  const toggleEsporte = (value: string) => {
    setEsportesFavoritos((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleCriarConta = async () => {
    try {
      const { data } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: {
            nome: nomeCompleto,
            cidade: cidade,
          },
        },
      });

      const { session, user } = data;

      saveData(SessionStorageKeysEnum.ACCESS_TOKEN, session?.access_token);
      saveData(SessionStorageKeysEnum.USER_DATA, user);

      router.push("/(app)/feed");
    } catch (err) {
      console.error(err);
    }
    console.log({ nomeCompleto, email, cidade, senha, esportesFavoritos });
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
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Junte-se à comunidade</Text>

          <FormField
            label="Nome Completo"
            placeholder="Ex: Leonardo Pinheiro"
            value={nomeCompleto}
            onChangeText={setNomeCompleto}
            autoCapitalize="words"
          />

          <FormField
            label="E-mail"
            placeholder="Ex: exemplo@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <RowFields>
            <View style={{ flex: 1 }}>
              <FormField
                label="Cidade"
                placeholder="Ex: Almenara"
                value={cidade}
                onChangeText={setCidade}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormField
                label="Senha"
                placeholder="••••••"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
              />
            </View>
          </RowFields>

          <ChipSelector
            label="Escolha seu esporte Favorito"
            options={SPORTS}
            selected={esportesFavoritos}
            onToggle={toggleEsporte}
            containerStyle={{ marginTop: 4 }}
          />

          <PrimaryButton
            title="Criar Conta"
            onPress={handleCriarConta}
            style={{ marginTop: 16 }}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

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
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 2,
  },
  subtitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#aaa",
    fontSize: 14,
  },
  footerLink: {
    color: "#00FFD1",
    fontSize: 14,
    fontWeight: "600",
  },
});
