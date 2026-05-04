# Cofre de Senhas

Sistema de gerenciamento de senhas com:

- app mobile/web em React Native com Expo
- API em Spring Boot
- banco de dados MySQL

O projeto permite:

- criar conta
- fazer login
- gerar uma senha aleatoria
- salvar a senha com o nome de um aplicativo ou servico
- listar senhas salvas
- copiar ou excluir senhas

## Estrutura

```text
Mobile-main/
|- Gerador-Senha-Mobile/   # app Expo / React Native
|- passgeneration/         # API Spring Boot
|- docker-compose.yml      # sobe banco, backend e frontend web
```

## Como o sistema funciona

1. O usuario cria uma conta no app.
2. O backend valida os dados, criptografa a senha do usuario com BCrypt e salva no MySQL.
3. No login, o backend devolve um token JWT.
4. O app salva esse token no `AsyncStorage`.
5. Nas requisicoes autenticadas, o app envia `Authorization: Bearer <token>`.
6. O backend usa o token para identificar o usuario e salvar/listar as senhas dele.

## Pre-requisitos

Para rodar sem Docker:

- Node.js 18+ ou superior
- npm
- Java 17
- Maven 3.9+ ou usar o `mvnw`
- MySQL 8

Para rodar com Docker:

- Docker
- Docker Compose

## Portas usadas

- backend: `8080`
- frontend web Expo: `8081`
- mysql: `3307` no host

## Rodando com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Depois acesse:

- frontend web: `http://localhost:8081`
- backend: `http://localhost:8080`

O banco sera criado com:

- database: `password_vault`
- usuario: `root`
- senha: `root`

## Rodando manualmente

### 1. Subir o MySQL

Crie um banco chamado `password_vault`.

Exemplo de configuracao local:

- host: `localhost`
- porta: `3306`
- usuario: `root`
- senha: `root`

Se quiser usar outra senha, ajuste em [application.properties](C:/Users/milton.junior/Downloads/Mobile-main/passgeneration/src/main/resources/application.properties:1).

### 2. Rodar o backend

Entre na pasta:

```bash
cd passgeneration
```

O arquivo [application.properties](C:/Users/milton.junior/Downloads/Mobile-main/passgeneration/src/main/resources/application.properties:1) ja vem pronto para MySQL local na porta `3306`:

```properties
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/password_vault?createDatabaseIfNotExist=true&serverTimezone=UTC}
```

Depois execute:

```bash
./mvnw spring-boot:run
```

No Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

### 3. Rodar o app

Entre na pasta:

```bash
cd Gerador-Senha-Mobile
```

Instale as dependencias:

```bash
npm install
```

Se o backend estiver em outra maquina ou IP, ajuste a URL da API antes de iniciar:

```powershell
$env:EXPO_PUBLIC_API_URL="http://localhost:8080"
```

Ou:

```powershell
$env:API_URL="http://localhost:8080"
```

Inicie o projeto:

```bash
npm start
```

Atalhos uteis:

- `npm run web` para abrir no navegador
- `npm run android` para abrir no Android
- `npm run ios` para abrir no iOS

## Endpoints principais

- `POST /signup` cria usuario
- `POST /signin` faz login
- `GET /senhas` lista senhas do usuario autenticado
- `POST /senhas` salva uma nova senha
- `DELETE /senhas/{id}` remove uma senha

## Tecnologias

- React Native
- Expo
- Axios
- AsyncStorage
- Spring Boot
- Spring Security
- Spring Data JPA
- MySQL
- JWT

## Observacoes

- O app usa `AsyncStorage` para guardar o token de autenticacao.
- O backend salva a senha do usuario criptografada.
- As senhas geradas para os servicos sao armazenadas no banco conforme a implementacao atual.
