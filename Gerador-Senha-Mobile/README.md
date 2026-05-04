# PassGeneration — Gerador de Senhas

Aplicativo mobile para **criação e gerenciamento de senhas**, desenvolvido utilizando **React Native com Expo**.

Permite gerar senhas aleatórias, armazená-las com uma identificação (nome do aplicativo ou finalidade) e acessar um histórico com opções para visualizar, copiar e remover.

---

## Telas do Aplicativo

| Tela | Descrição |
|---|---|
| **Sign In** | Tela inicial. Login com email e senha. O botão ENTRAR só é ativado quando ambos os campos estão preenchidos. |
| **Sign Up** | Tela de cadastro com Nome, Email, Senha e Confirmação. O botão REGISTRAR só é habilitado quando todos os campos estão preenchidos e as senhas coincidem. Após o cadastro, redireciona para o login com o email preenchido automaticamente. |
| **Home** | Responsável por gerar senhas aleatórias. Possui opções para salvar (abre um modal), copiar e acessar o histórico. |
| **Histórico** | Exibe as senhas salvas em formato de cards. Cada item possui ações para mostrar ou ocultar, copiar e excluir. |

---

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, é necessário ter instalado:

- **Node.js** — preferencialmente a versão LTS  
  Verifique com:
  ```bash
  node -v

Git — para clonar o repositório
Verifique com:
git -v

2. Instalar dependências
npm install

Esse comando fará o download das bibliotecas necessárias para a pasta node_modules/.

3. Iniciar o ambiente de desenvolvimento
npx expo start

O terminal exibirá um QR Code e opções de execução.

4. Executar o aplicativo
Opção A — Dispositivo físico
Abra o aplicativo Expo Go no celular
Escaneie o QR Code exibido no terminal
O aplicativo será carregado automaticamente
Opção B — Emulador Android
Abra o Android Studio e inicie um emulador
Com o emulador em execução, pressione a no terminal
O aplicativo será aberto automaticamente

O celular e o computador devem estar na mesma rede Wi-Fi para funcionamento com Expo Go.

Estrutura do Projeto
PassGeneration/
├── App.js                  # Configuração das rotas e navegação
├── index.js                # Arquivo de entrada do aplicativo
├── app.json                # Configurações do Expo
├── assets/                 # Arquivos de imagem e ícones
├── screens/
│   ├── SignIn.js           # Tela de login
│   ├── SignUp.js           # Tela de cadastro
│   ├── Home.js             # Gerador de senha e modal de salvamento
│   └── HistoricoSenha.js   # Tela de histórico
└── service/
    └── passwordService.js  # Função de geração de senha aleatória

    Tecnologias Utilizadas
React Native
Expo
@react-navigation/native
@react-native-async-storage/async-storage
expo-clipboard

npx expo start
npx expo start --android
npx expo start --ios