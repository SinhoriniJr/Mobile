import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { registerUser } from "../service/authService";

export default function SignUp({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const isFormValid =
    fullName &&
    email &&
    password &&
    password === passwordConfirmation;

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSignup = async () => {
    if (!isValidEmail(email)) {
      return alert("Email em formato invalido");
    }

    try {
      await registerUser({
        nome: fullName,
        email,
        senha: password,
        repetirSenha: passwordConfirmation,
      });

      alert("Cadastro realizado!");
      navigation.navigate("SignIn", { email });
    } catch (error) {
      console.log("ERRO SIGNUP:", error.response || error);

      let message = "Erro no cadastro";
      const status = error.response?.status;

      if (status === 403) {
        message = "Email ja cadastrado";
      } else if (status === 400) {
        message = "Dados invalidos";
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      alert(message);
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
        value={fullName}
        onChangeText={setFullName}
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
        value={password}
        onChangeText={setPassword}
      />

      <Text className="mb-1 text-base text-slate-700">Confirmar Senha</Text>
      <TextInput
        className="mb-5 rounded-md border border-black bg-accent-500 px-3 py-2.5 text-base text-slate-900"
        secureTextEntry
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />

      <Pressable
        className={`items-center rounded-md px-3 py-3 ${
          isFormValid ? "bg-zinc-300" : "bg-zinc-300 opacity-50"
        }`}
        disabled={!isFormValid}
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
