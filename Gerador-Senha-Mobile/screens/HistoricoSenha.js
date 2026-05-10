import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { usePasswordStore } from "../store/passwordStore";

export default function HistoricoSenha({ navigation }) {
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const isScreenFocused = useIsFocused();
  const savedPasswords = usePasswordStore((state) => state.passwords);
  const loadPasswords = usePasswordStore((state) => state.loadPasswords);
  const deletePassword = usePasswordStore((state) => state.deletePassword);
  const isLoading = usePasswordStore((state) => state.isLoading);
  const isSyncing = usePasswordStore((state) => state.isSyncing);
  const isOffline = usePasswordStore((state) => state.isOffline);
  const pendingOperations = usePasswordStore((state) => state.pendingOperations);
  const lastSyncError = usePasswordStore((state) => state.lastSyncError);

  useEffect(() => {
    if (isScreenFocused) {
      loadPasswords();
      setVisiblePasswords({});
    }
  }, [isScreenFocused, loadPasswords]);

  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="mb-5 text-center text-2xl font-bold text-blue-500">
        HISTORICO DE SENHAS
      </Text>

      {(isOffline || pendingOperations.length > 0 || isSyncing) && (
        <View className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
          <Text className="text-center text-sm font-semibold text-amber-800">
            {isSyncing
              ? "Sincronizando alteracoes..."
              : `Offline first ativo: ${pendingOperations.length} pendente(s)`}
          </Text>
        </View>
      )}

      {lastSyncError && (
        <Text className="mb-3 text-center text-sm text-slate-500">
          {lastSyncError}
        </Text>
      )}

      <FlatList
        data={savedPasswords}
        keyExtractor={(item) => item.id.toString()}
        contentContainerClassName="pb-4"
        ListEmptyComponent={
          <View className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6">
            <Text className="text-center text-base text-slate-500">
              Nenhuma senha salva ate agora.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center justify-between rounded-lg border border-black bg-white p-4 shadow">
            <View>
              <Text className="font-bold text-slate-900">{item.name}</Text>
              {item.syncStatus === "pending_create" && (
                <Text className="text-xs font-semibold text-amber-700">
                  Pendente de sincronizacao
                </Text>
              )}
              <Text className="tracking-[2px] text-slate-700">
                {visiblePasswords[item.id] ? item.pass : "********"}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() =>
                  setVisiblePasswords((currentVisiblePasswords) => ({
                    ...currentVisiblePasswords,
                    [item.id]: !currentVisiblePasswords[item.id],
                  }))
                }
              >
                <Text className="text-xs font-semibold text-blue-600">VER</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(item.pass);
                  alert("Senha copiada!");
                }}
              >
                <Text className="text-xs font-semibold text-emerald-600">
                  COPIAR
                </Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  try {
                    await deletePassword(item.id);
                  } catch (error) {
                    console.log(error);
                    alert("Erro ao deletar");
                  }
                }}
              >
                <Text className="text-xs font-semibold text-rose-600">
                  EXCLUIR
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {isLoading && (
        <Text className="mt-2 text-center text-sm text-slate-500">
          Atualizando historico...
        </Text>
      )}

      <Pressable
        className="mt-3 items-center rounded-md bg-blue-500 px-4 py-3"
        onPress={() => navigation.goBack()}
      >
        <Text className="font-semibold text-white">VOLTAR</Text>
      </Pressable>
    </View>
  );
}
