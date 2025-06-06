# TMB-Challenge-Web

Este projeto é o Front-End do desafio técnico para TMB.
Os detalhes do desafio podem ser vistos no arquivo [POC-TMB](https://github.com/guiriosoficial/TMB-Challenge-Web/blob/main/POC-TMB.pdf)

**BACK END**
- O Back-End deste projeto está disponível em [TMB-Challenge-Api](https://github.com/guiriosoficial/TMB-Challenge-Api)

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes componentes instalados:

- [Node e NPM](https://nodejs.org/en) (Versão 22)

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

## Execute o Projeto

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

## Via Docker

1. **Crie a Imagem**:
```bash
docker build -t tmb-challenge-web .
```

2. **Inicie o Container**:
```bash
docker run -p 3000:3000 tmb-challenge-web
```

- Voce pode passar as varáveis de ambiente `NEXT_PUBLIC_API_BASE_URL` e `NEXT_PUBLIC_WS_BASE_URL` para alterar o endereço do Back-End em outros ambientes utilizando o parametro `-e <VAR_NAME>=<VAR_VALUE>`

## Abra o Projeto
- Por padrão, o app irá ser executado na porta 3000.
- Abra [http://localhost:3000](http://localhost:3000) para ver o resultado.

### TODO
- Remover tratativa de Enum StatusOrder do Front-End
- Implementar Máscara monetária no dialog de Adiciona/Editar pedidos
- Implementar ícone de loading na tag de status quando estiver processando
- Implementar filtro por status
- Implementar campo de busca
- Implementar paginação
- Implementar Skeleton Loading na tabela e nos detalhes do pedido
- Implementar Toasts de erros
- Bloquear click fora do modal no loading
