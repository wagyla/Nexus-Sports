import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/src/contexts/AuthContext";

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!email || !email.includes("@")) {
      setErro("Digite um endereço de e-mail válido.");
      return;
    }
    setErro("");
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) {
      setErro(error);
    } else {
      setEnviado(true);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.botaoVoltar}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>Esqueceu{"\n"}sua senha?</Text>
        <Text style={styles.subtitulo}>
          Informe o e-mail da sua conta. Vamos enviar um link para redefinir sua
          senha.
        </Text>

        <Text style={styles.fieldLabel}>E-mail</Text>
        <TextInput
          style={[styles.input, erro ? styles.inputErro : null]}
          placeholder="Ex: exemplo@email.com"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErro("");
          }}
          editable={!enviado}
        />

        {erro ? <Text style={styles.textoErro}>{erro}</Text> : null}

        {!enviado ? (
          <TouchableOpacity
            style={[styles.botao, loading && { opacity: 0.6 }]}
            onPress={handleEnviar}
            disabled={loading}
          >
            <Text style={styles.botaoTexto}>{loading ? "Enviando..." : "Enviar link"}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.bannerSucesso}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitulo}>Link enviado!</Text>
              <Text style={styles.bannerDesc}>
                Verifique sua caixa de entrada.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>Lembrou a senha? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.rodapeLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    paddingHorizontal: 37,
    paddingTop: 40,
  },
  botaoVoltar: {
    marginBottom: 32,
    alignSelf: "flex-start",
  },
  backIcon: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "300",
    lineHeight: 32,
  },
  titulo: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitulo: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 32,
  },
  fieldLabel: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    color: "#fff",
    marginBottom: 6,
  },
  inputErro: {
    borderColor: "#FF6666",
  },
  textoErro: {
    color: "#FF6666",
    fontSize: 12,
    marginBottom: 14,
    marginLeft: 2,
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "#00FFD1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  botaoTexto: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerSucesso: {
    backgroundColor: "#00FFD115",
    borderWidth: 1,
    borderColor: "#00FFD140",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 20,
  },
  bannerTitulo: {
    color: "#00FFD1",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  bannerDesc: {
    color: "#888",
    fontSize: 13,
    lineHeight: 18,
  },
  rodape: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  rodapeTexto: {
    color: "#888",
    fontSize: 14,
  },
  rodapeLink: {
    color: "#00FFD1",
    fontSize: 14,
    fontWeight: "600",
  },
});
