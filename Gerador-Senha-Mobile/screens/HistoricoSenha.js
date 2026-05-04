import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { listarSenhas, deletarSenha } from "../service/senhaService";

export default function HistoricoSenha({ navigation }) {
  const [dados, setDados] = useState([]);
  const [mostrar, setMostrar] = useState({});
  const foco = useIsFocused();

  const carregar = async () => {
    try {
      const res = await listarSenhas();
      setDados(res.data);
      setMostrar({});
    } catch (e) {
      console.log(e);
      alert("Erro ao carregar senhas");
    }
  };

  useEffect(() => {
    if (foco) carregar();
  }, [foco]);

  return (
    <View className="flex-1 bg-slate-50 px-5 py-6">
      <Text className="mb-5 text-center text-2xl font-bold text-blue-500">
        HISTORICO DE SENHAS
      </Text>

      <FlatList
        data={dados}
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
              <Text className="tracking-[2px] text-slate-700">
                {mostrar[item.id] ? item.pass : "********"}
              </Text>
            </View>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() =>
                  setMostrar((p) => ({ ...p, [item.id]: !p[item.id] }))
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
                    await deletarSenha(item.id);
                    carregar();
                  } catch (e) {
                    console.log(e);
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

      <Pressable
        className="mt-3 items-center rounded-md bg-blue-500 px-4 py-3"
        onPress={() => navigation.goBack()}
      >
        <Text className="font-semibold text-white">VOLTAR</Text>
      </Pressable>
    </View>
  );
}
