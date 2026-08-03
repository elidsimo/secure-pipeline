FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

# Ne jamais faire tourner le conteneur en root (voir scénario de départ :
# "production deployment uses docker:latest with root")
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
