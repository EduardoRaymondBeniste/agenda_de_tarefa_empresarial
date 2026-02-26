FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de dependências primeiro (otimiza o cache)
COPY package*.json ./
RUN npm install

# Copia o restante do seu código
COPY . .

# Expõe a porta 3000 (ou a que você usa no seu app)
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]