import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import style from "./login.styles";
import { useAuth } from "@/src/contexts/AuthContext";

const Login = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setErro("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setErro(error);
  };

  return (
    <View style={style.container}>
      <View style={style.boxTop}>
        <Image
          source={require("../../assets/images/logo-nexus.png")}
          style={style.logo}
          resizeMode="contain"
        />
      </View>

      <View style={style.boxMid}>
        <Text style={style.titleInput}>E-mail</Text>
        <View style={style.boxInput}>
          <TextInput
            placeholder="Ex: exemplo@email.com"
            placeholderTextColor="#555"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            style={style.input}
          />
        </View>

        <Text style={style.titleInput}>Senha</Text>
        <View style={style.boxInput}>
          <TextInput
            placeholder="*******"
            placeholderTextColor="#555"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={style.input}
          />
        </View>

        {erro ? <Text style={style.errorText}>{erro}</Text> : null}
      </View>

      <View style={style.boxBottom}>
        <TouchableOpacity
          style={[style.button, loading && style.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={style.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <View style={style.registerContainer}>
          <Text style={style.registerText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={style.registerLink}>Criar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
