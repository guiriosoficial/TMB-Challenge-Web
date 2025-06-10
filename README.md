# TMB-Challenge-Web

Este projeto é o Front-End do desafio técnico para TMB.
Os detalhes do desafio podem ser vistos no arquivo [POC-TMB](https://github.com/guiriosoficial/TMB-Challenge-Web/blob/main/POC-TMB.pdf)

**BACK END**
- O Back-End deste projeto está disponível em [TMB-Challenge-Api](https://github.com/guiriosoficial/TMB-Challenge-Api)

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes componentes instalados:

- [Node e NPM](https://nodejs.org/en) (Versão 22)
- [Docker](https://www.docker.com/products/docker-desktop/) (Recomendado para rodar o Back-end localmente)

## Configuração do Projeto

1. **Clone o Repositório**:
```bash
git clone git@github.com:guiriosoficial/TMB-Challenge-Web.git
cd TMB-Challenge-Web
```

2. **Entenda a Estrutura do Projeto**:
```
/public             -> Arquivos estáticos que são servidos diretamente, como imagens, fontes e outros recursos estáticos.      
/src                -> Diretório principal do código-fonte da aplicação.
  /app              -> Estrutura de rotas e páginas da aplicação, incluindo arquivos de layout e componentes de página.
  /components       -> Componentes reutilizáveis que podem ser usados em várias partes do aplicativo.
    /ui             -> Componentes de interface do usuário, como botões, inputs e outros elementos visuais.
    /dialogs        -> Componentes de diálogo/modais que são usados para interações e notificações ao usuário.
  /enums            -> Tipos enumerados que são usados em todo o aplicativo para representar valores constantes.
  /lib              -> Bibliotecas e utilitários personalizados que fornecem funcionalidades auxiliares.
  /models           -> Classes de modelo que representam a estrutura dos dados manipulados pelo aplicativo.
  /services         -> Lógica de negócios do aplicativo e consultas a API, organizada em serviços.
```

3. **Defina as Variaveis de Ambiente**
  - Crie um arquivo `.env` ou `.env.local` na raiz do projeto.
  - Atualize o arquivo com as variáveis necessárias:
```bash
# Por Padrão, a API é executada na porta 5000
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000/api"
NEXT_PUBLIC_WS_BASE_URL="ws://localhost:5000/ws"
```

## Execute o Projeto Manualmente

1. **Instale as Dependências**:
```bash
npm install
```

2. **Compile o Projeto**:
```bash
npm run build
```

3. **Execute o Projeto**:
```bash
npm run dev
```

## Execute o Projeto com Docker

1. **Na Primeira Execução**:
```bash
docker compose up --build
# Isso fará o Build do Projeto, utilize sempre que fizer alterações
```

2. **Demais Execuções**:
```bash
docker compose up
# Apenas inicia o container
```

3. **Back-end**:
  - Caso queira iniciar o Back-end, clone o projeto em um diretório irmão.
    ```bash
    # Assumindo que você está dentro do projeto TMB-Challenge-Web
    git clone https://github.com/guiriosoficial/TMB-Challenge-Api ../
    ```

  - Adicione as variáveis de ambiente necessárias ao `.env`.
    ```bash
    DB_NAME=<DB_NAME>
    DB_USERNAME=<DB_USERNAME>
    DB_PASSWORD=<DB_PASSWORD>
    DB_HOST=db
    DB_PORT=5432

    ConnectionStrings__DefaultConnection="Host=${DB_HOST}$;Port=${DB_PORT};Database=${DB_NAME};Username=${DB_USERNAME};Password=${DB_PASSWORD}""
    AzureServiceBus__ConnectionString=<AZURE_SERVICEBUS_CONNECTION_STRING>
    AzureServiceBus__QueueName=<AZURE_SERVICEBUS_QUEUE_NAME>
    ```
  
  - Substitua `<DB_NAME>`, `<DB_USERNAME>` e `<DB_PASSWORD>` pelo nome do banco de dados, nome de usuário e senha respectivamente.
  - Substitua `<AZURE_SERVICEBUS_QUEUE_NAME>` pelo nome da sua fila no Azure Service Bus.
  - Substitua `AZURE_SERVICEBUS_CONNECTION_STRING` pela cadeia de conexão da sua fila.
    ```bash
    # Exemplo de AZURE_SERVICEBUS_CONNECTION_STRING
    "Endpoint=sb://<SEU_NAMESPACE>.servicebus.windows.net/;SharedAccessKeyName=<NOME_DA_CHAVE_DE_ACESSP>;SharedAccessKey=<CHAVE_DE_ACESSO>"
    ```

  - Utilize o parametro `build` na primeira execução (ou sempre que houverem alterações na api) para compilar o projeto
  - Utilize o perfil `migrator` na primeira execução (ou sempre que houverem alterações no banco) para aplicar as migrações.
    ```bash
    docker compose --profile migrator up --build -d
    ```

  - Utilize o perfil `app` para iniciar o projeto completo.
    ```bash
    docker compose --profile app up -d
    ```

## Abra o Projeto
- Por padrão, o app irá ser executado na porta 3000.
- Abra [http://localhost:3000](http://localhost:3000) para ver o resultado.

### TODO
- Implementar Máscara monetária no dialog de Adiciona/Editar pedidos
- Implementar remoção de filtro por Status
- Implementar Filtro por Valor
- Implementar paginação
- Bloquear click fora do modal no loading
