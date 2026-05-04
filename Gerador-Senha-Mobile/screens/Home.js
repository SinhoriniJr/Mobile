import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { generatePassword } from "../service/passwordService";
import { criarSenha } from "../service/senhaService";

export default function Home({ navigation, onLogout }) {
  const [senha, setSenha] = useState("");
  const [modal, setModal] = useState(false);
  const [nome, setNome] = useState("");

  const gerar = () => setSenha(generatePassword());

  const salvar = async () => {
    try {
      await criarSenha({
        name: nome,
        pass: senha,
      });

      setModal(false);
      setNome("");
      navigation.navigate("Historico");
    } catch (e) {
      console.log(e);
      alert("Erro ao salvar senha");
    }
  };

  const copiar = async () => {
    await Clipboard.setStringAsync(senha);
    alert("Copiado");
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    onLogout();
    alert("Logout realizado");
  };

  const actionButtonClass = (enabled = true) =>
    `mb-3 w-4/5 rounded-md bg-primary-500 px-4 py-4 ${
      enabled ? "" : "opacity-50"
    }`;

  return (
    <View className="flex-1 items-center justify-center bg-white px-5">
      <Text className="mb-5 text-center text-3xl font-bold text-primary-600">
        GERADOR DE SENHA
      </Text>

      <Text className="mb-5 text-2xl tracking-[2px] text-slate-900">
        {senha || "********"}
      </Text>

      <Pressable className={actionButtonClass()} onPress={gerar}>
        <Text className="text-center font-semibold text-white">
          GERAR SENHA
        </Text>
      </Pressable>

      <Pressable
        className={actionButtonClass(!!senha)}
        disabled={!senha}
        onPress={() => setModal(true)}
      >
        <Text className="text-center font-semibold text-white">SALVAR</Text>
      </Pressable>

      <Pressable
        className={actionButtonClass(!!senha)}
        disabled={!senha}
        onPress={copiar}
      >
        <Text className="text-center font-semibold text-white">COPIAR</Text>
      </Pressable>

      <Pressable className={actionButtonClass()} onPress={logout}>
        <Text className="text-center font-semibold text-white">SAIR</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Historico")}>
        <Text className="mt-2 text-base text-slate-700">Ver Senhas</Text>
      </Pressable>

      <Modal visible={modal} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-4/5 rounded-xl bg-white p-5">
            <Text className="mb-3 text-center text-lg font-semibold text-primary-600">
              CADASTRO DE SENHA
            </Text>

            <TextInput
              className="mb-3 rounded-md border border-slate-300 px-3 py-2.5 text-base text-slate-900"
              placeholder="Nome do aplicativo"
              value={nome}
              onChangeText={setNome}
            />

            <TextInput
              className="mb-3 rounded-md border border-slate-300 bg-slate-200 px-3 py-2.5 text-base text-slate-600"
              value={senha}
              editable={false}
            />

            <Pressable
              className={`mt-1 rounded-md bg-blue-500 px-3 py-3 ${
                nome ? "" : "opacity-50"
              }`}
              disabled={!nome}
              onPress={salvar}
            >
              <Text className="text-center font-semibold text-white">CRIAR</Text>
            </Pressable>

            <Pressable
              className="mt-2 rounded-md bg-blue-500 px-3 py-3"
              onPress={() => setModal(false)}
            >
              <Text className="text-center font-semibold text-white">
                CANCELAR
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
