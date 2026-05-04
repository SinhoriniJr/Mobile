import "./global.css";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Home from "./screens/Home";
import HistoricoSenha from "./screens/HistoricoSenha";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const refreshSession = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsAuthenticated(!!token);
  };

  useEffect(() => {
    refreshSession();
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#eff6ff" },
          headerTintColor: "#1e3a8a",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="SignIn" options={{ title: "Entrar" }}>
              {(props) => <SignIn {...props} onLogin={refreshSession} />}
            </Stack.Screen>

            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ title: "Criar Conta" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ title: "Cofre de Senhas" }}>
              {(props) => <Home {...props} onLogout={refreshSession} />}
            </Stack.Screen>

            <Stack.Screen
              name="Historico"
              component={HistoricoSenha}
              options={{ title: "Historico de Senhas" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
