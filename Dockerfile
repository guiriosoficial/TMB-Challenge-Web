# Use uma imagem oficial do Node.js como base, versão 22
FROM node:22-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm ci

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Defina as variáveis de ambiente necessárias
# Você pode definir variáveis padrão aqui ou passá-las no momento da execução do contêiner
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
ENV NEXT_PUBLIC_WS_BASE_URL=ws://localhost:5000/ws

# Construa a aplicação Next.js
RUN npm run build

# Exponha a porta em que a aplicação irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação em modo de produção
CMD ["npm", "start"]
