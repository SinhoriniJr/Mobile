import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  deletePasswordEntry,
  listPasswordEntries,
  savePasswordEntry,
} from "../service/senhaService";

const createLocalId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const isNetworkError = (error) => !error.response;

const buildCreateOperation = (entry) => ({
  id: createLocalId(),
  type: "create",
  clientId: entry.id,
  payload: {
    name: entry.name,
    pass: entry.pass,
  },
});

const buildDeleteOperation = (entry) => ({
  id: createLocalId(),
  type: "delete",
  serverId: entry.id,
});

export const usePasswordStore = create(
  persist(
    (set, get) => ({
      passwords: [],
      pendingOperations: [],
      isLoading: false,
      isSyncing: false,
      isOffline: false,
      lastSyncError: null,

      loadPasswords: async () => {
        set({ isLoading: true, lastSyncError: null });

        await get().syncPendingOperations();

        try {
          const response = await listPasswordEntries();
          const pendingCreates = get().passwords.filter(
            (password) => password.syncStatus === "pending_create"
          );

          set({
            passwords: [...response.data, ...pendingCreates],
            isOffline: false,
            isLoading: false,
          });
        } catch (error) {
          console.log("Erro ao carregar senhas:", error.response || error);
          set({
            isOffline: isNetworkError(error),
            isLoading: false,
            lastSyncError: "Nao foi possivel atualizar com o servidor.",
          });
        }
      },

      savePassword: async (payload) => {
        const localEntry = {
          id: createLocalId(),
          name: payload.name,
          pass: payload.pass,
          syncStatus: "pending_create",
        };

        set((state) => ({
          passwords: [localEntry, ...state.passwords],
          lastSyncError: null,
        }));

        try {
          const response = await savePasswordEntry(payload);

          set((state) => ({
            passwords: state.passwords.map((password) =>
              password.id === localEntry.id ? response.data : password
            ),
            isOffline: false,
          }));
        } catch (error) {
          console.log("Erro ao salvar senha:", error.response || error);

          if (!isNetworkError(error)) {
            set((state) => ({
              passwords: state.passwords.filter(
                (password) => password.id !== localEntry.id
              ),
              lastSyncError: "Nao foi possivel salvar a senha.",
            }));
            throw error;
          }

          set((state) => ({
            pendingOperations: [
              ...state.pendingOperations,
              buildCreateOperation(localEntry),
            ],
            isOffline: true,
            lastSyncError:
              "Senha salva offline. Ela sera sincronizada quando a API voltar.",
          }));
        }

        return localEntry;
      },

      deletePassword: async (passwordId) => {
        const passwordToDelete = get().passwords.find(
          (password) => password.id === passwordId
        );

        if (!passwordToDelete) return;

        set((state) => ({
          passwords: state.passwords.filter((password) => password.id !== passwordId),
          lastSyncError: null,
        }));

        const pendingCreate = get().pendingOperations.find(
          (operation) =>
            operation.type === "create" && operation.clientId === passwordId
        );

        if (pendingCreate) {
          set((state) => ({
            pendingOperations: state.pendingOperations.filter(
              (operation) => operation.id !== pendingCreate.id
            ),
          }));
          return;
        }

        try {
          await deletePasswordEntry(passwordId);
          set({ isOffline: false });
        } catch (error) {
          console.log("Erro ao deletar senha:", error.response || error);

          if (!isNetworkError(error)) {
            set((state) => ({
              passwords: [passwordToDelete, ...state.passwords],
              lastSyncError: "Nao foi possivel excluir a senha.",
            }));
            throw error;
          }

          set((state) => ({
            pendingOperations: [
              ...state.pendingOperations,
              buildDeleteOperation(passwordToDelete),
            ],
            isOffline: true,
            lastSyncError:
              "Exclusao salva offline. Ela sera sincronizada quando a API voltar.",
          }));
        }
      },

      syncPendingOperations: async () => {
        const { pendingOperations, isSyncing } = get();

        if (isSyncing || pendingOperations.length === 0) return;

        set({ isSyncing: true, lastSyncError: null });

        const remainingOperations = [];

        for (const operation of pendingOperations) {
          try {
            if (operation.type === "create") {
              const response = await savePasswordEntry(operation.payload);

              set((state) => ({
                passwords: state.passwords.map((password) =>
                  password.id === operation.clientId ? response.data : password
                ),
              }));
            }

            if (operation.type === "delete") {
              await deletePasswordEntry(operation.serverId);
            }
          } catch (error) {
            console.log("Erro ao sincronizar senha:", error.response || error);
            remainingOperations.push(operation);

            if (!isNetworkError(error)) {
              continue;
            }

            const operationIndex = pendingOperations.indexOf(operation);
            remainingOperations.push(...pendingOperations.slice(operationIndex + 1));
            break;
          }
        }

        set({
          pendingOperations: remainingOperations,
          isOffline: remainingOperations.length > 0,
          isSyncing: false,
          lastSyncError:
            remainingOperations.length > 0
              ? "Ainda existem alteracoes locais pendentes."
              : null,
        });
      },

      clearLocalPasswords: () => {
        set({
          passwords: [],
          pendingOperations: [],
          isLoading: false,
          isSyncing: false,
          isOffline: false,
          lastSyncError: null,
        });
      },
    }),
    {
      name: "password-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        passwords: state.passwords,
        pendingOperations: state.pendingOperations,
        isOffline: state.isOffline,
        lastSyncError: state.lastSyncError,
      }),
    }
  )
);
