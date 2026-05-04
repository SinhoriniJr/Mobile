import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { signup } from "../service/authService";

export default function SignUp({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const valido = nome && email && senha && senha === confirmar;

  const emailValido = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignup = async () => {
    if (!emailValido(email)) {
      return alert("Email em formato invalido");
    }

    try {
      await signup({
        nome,
        email,
        senha,
        repetirSenha: confirmar,
      });

      alert("Cadastro realizado!");
      navigation.navigate("SignIn", { email });
    } catch (e) {
      console.log("ERRO SIGNUP:", e.response || e);

      let msg = "Erro no cadastro";
      const status = e.response?.status;

      if (status === 403) {
        msg = "Email ja cadastrado";
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
        SIGN UP
      </Text>

      <Text className="mb-1 text-base text-slate-700">Nome</Text>
      <TextInput
        className="mb-4 rounded-md border border-black bg-accent-500 px-3 py-2.5 text-base text-slate-900"
        value={nome}
        onChangeText={setNome}
      />

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
        className="mb-4 rounded-md border border-black bg-accent-500 px-3 py-2.5 text-base text-slate-900"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Text className="mb-1 text-base text-slate-700">Confirmar Senha</Text>
      <TextInput
        className="mb-5 rounded-md border border-black bg-accent-500 px-3 py-2.5 text-base text-slate-900"
        secureTextEntry
        value={confirmar}
        onChangeText={setConfirmar}
      />

      <Pressable
        className={`items-center rounded-md px-3 py-3 ${
          valido ? "bg-zinc-300" : "bg-zinc-300 opacity-50"
        }`}
        disabled={!valido}
        onPress={handleSignup}
      >
        <Text className="font-bold text-slate-900">REGISTRAR</Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text className="mt-4 text-center text-base text-slate-700">
          Voltar
        </Text>
      </Pressable>
    </View>
  );
}
