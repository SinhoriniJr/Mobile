import React, { useState } from "react";
import { View, Text, Pressable, Modal, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { generateSecurePassword } from "../service/passwordService";
import { usePasswordStore } from "../store/passwordStore";

export default function Home({ navigation, onLogout }) {
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState("");
  const savePassword = usePasswordStore((state) => state.savePassword);
  const clearLocalPasswords = usePasswordStore((state) => state.clearLocalPasswords);
  const isOffline = usePasswordStore((state) => state.isOffline);
  const pendingOperations = usePasswordStore((state) => state.pendingOperations);

  const handleGeneratePassword = () => {
    setGeneratedPassword(generateSecurePassword());
  };

  const handleSavePassword = async () => {
    try {
      await savePassword({
        name: passwordLabel,
        pass: generatedPassword,
      });

      setIsSaveModalVisible(false);
      setPasswordLabel("");
      navigation.navigate("Historico");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar senha");
    }
  };

  const handleCopyPassword = async () => {
    await Clipboard.setStringAsync(generatedPassword);
    alert("Copiado");
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    clearLocalPasswords();
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
        COFRE DE SENHAS
      </Text>

      {(isOffline || pendingOperations.length > 0) && (
        <Text className="mb-4 text-center text-sm font-semibold text-amber-700">
          Modo offline: {pendingOperations.length} alteracao(oes) pendente(s)
        </Text>
      )}

      <Text className="mb-5 text-2xl tracking-[2px] text-slate-900">
        {generatedPassword || "********"}
      </Text>

      <Pressable className={actionButtonClass()} onPress={handleGeneratePassword}>
        <Text className="text-center font-semibold text-white">
          GERAR SENHA
        </Text>
      </Pressable>

      <Pressable
        className={actionButtonClass(!!generatedPassword)}
        disabled={!generatedPassword}
        onPress={() => setIsSaveModalVisible(true)}
      >
        <Text className="text-center font-semibold text-white">SALVAR</Text>
      </Pressable>

      <Pressable
        className={actionButtonClass(!!generatedPassword)}
        disabled={!generatedPassword}
        onPress={handleCopyPassword}
      >
        <Text className="text-center font-semibold text-white">COPIAR</Text>
      </Pressable>

      <Pressable className={actionButtonClass()} onPress={handleLogout}>
        <Text className="text-center font-semibold text-white">SAIR</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Historico")}>
        <Text className="mt-2 text-base text-slate-700">Ver Senhas</Text>
      </Pressable>

      <Modal visible={isSaveModalVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50 px-5">
          <View className="w-4/5 rounded-xl bg-white p-5">
            <Text className="mb-3 text-center text-lg font-semibold text-primary-600">
              CADASTRO DE SENHA
            </Text>

            <TextInput
              className="mb-3 rounded-md border border-slate-300 px-3 py-2.5 text-base text-slate-900"
              placeholder="Nome do aplicativo"
              value={passwordLabel}
              onChangeText={setPasswordLabel}
            />

            <TextInput
              className="mb-3 rounded-md border border-slate-300 bg-slate-200 px-3 py-2.5 text-base text-slate-600"
              value={generatedPassword}
              editable={false}
            />

            <Pressable
              className={`mt-1 rounded-md bg-blue-500 px-3 py-3 ${
                passwordLabel ? "" : "opacity-50"
              }`}
              disabled={!passwordLabel}
              onPress={handleSavePassword}
            >
              <Text className="text-center font-semibold text-white">CRIAR</Text>
            </Pressable>

            <Pressable
              className="mt-2 rounded-md bg-blue-500 px-3 py-3"
              onPress={() => setIsSaveModalVisible(false)}
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
