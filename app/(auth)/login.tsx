import React, { useState } from "react";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import style from "./login.styles";
import { supabase } from "@/utils/supabase";
import { CreateSessionType } from "@/src/types";
import { saveData } from "@/utils/Storage";
import { SessionStorageKeysEnum } from "@/utils/Enums";

const Login = () => {
  const [userData, setUser] = useState<CreateSessionType>({
    email: "",
    password: "",
  });

  const abrirCriarConta = () => {
    router.push("/(auth)/register");
  };

  const handleLogin = async () => {
    try {
      const { data } = await supabase.auth.signInWithPassword(userData);
      const { session, user } = data;
      
      saveData(SessionStorageKeysEnum.ACCESS_TOKEN, session?.access_token);
      saveData(SessionStorageKeysEnum.USER_DATA, user);
      router.push("/(app)/feed");
    } catch (err) {
      console.error(err);
    }
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
            onChangeText={(e) => setUser((prev) => ({ ...prev, email: e }))}
            style={style.input}
          />
        </View>

        <Text style={style.titleInput}>Senha</Text>

        <View style={style.boxInput}>
          <TextInput
            placeholder="*******"
            placeholderTextColor="#555"
            secureTextEntry={true}
            onChangeText={(e) => setUser((prev) => ({ ...prev, password: e }))}
            style={style.input}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={style.forgotContainer}
        >
          <Text style={style.forgotText}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <View style={style.boxBottom}>
        <TouchableOpacity style={style.button} onPress={handleLogin}>
          <Text style={style.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={style.registerContainer}>
          <Text style={style.registerText}>Não tem uma conta?</Text>

          <TouchableOpacity onPress={abrirCriarConta}>
            <Text style={style.registerLink}>Criar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
