import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signin } from "../service/authService";

export default function SignIn({ navigation, route, onLogin }) {
  const initialEmail = route.params?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [senha, setSenha] = useState("");

  const ativo = email !== "" && senha !== "";

  const handleLogin = async () => {
    try {
      const response = await signin({ email, senha });
      const token = response.data.token;

      await AsyncStorage.setItem("token", token);
      onLogin();

      alert("Login feito!");
    } catch (e) {
      console.log("ERRO LOGIN:", e.response || e);

      let msg = "Erro no login";
      const status = e.response?.status;

      if (status === 404) {
        msg = "Email nao existente";
      } else if (status === 401) {
        msg = "Senha invalida";
      } else if (status === 400) {
        msg = "Dados invalidos";
      } else if (e.response?.data?.message) {
        msg = e.response.data.message;
      }

      alert(msg);
    }
  };

  return (
    <View className="flex-1 justify-center bg-white px-5">
      <Text className="mb-8 text-center text-3xl font-bold text-primary-600">
        SIGN IN
      </Text>

      <Text className="mb-1 text-base text-slate-700">Email</Text>
      <TextInput
        className="mb-4 rounded-md border border-black bg-accent-500 px-3 py-2.5 text-base text-slate-900"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text className="mb-1 text-base text-slate-700">Senha</Text>
      <TextInput
        className="mb-5 rounded-md border border-black bg-accent-500 px-3 py-2.5 text-base text-slate-900"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Pressable
        className={`items-center rounded-md px-3 py-3 ${
          ativo ? "bg-zinc-300" : "bg-zinc-300 opacity-50"
        }`}
        disabled={!ativo}
        onPress={handleLogin}
      >
        <Text className="font-bold text-slate-900">ENTRAR</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("SignUp")}>
        <Text className="mt-5 text-center text-base text-slate-700">
          Nao possui conta ainda? Crie agora.
        </Text>
      </Pressable>
    </View>
  );
}
