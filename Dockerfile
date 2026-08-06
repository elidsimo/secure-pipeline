# builder — installe les dépendances avec npm
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY src/ ./src/

FROM node:20-alpine

RUN apk update && apk upgrade --no-cache

WORKDIR /app

# On copie uniquement le résultat du build, pas npm lui-même
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Le CLI npm (et ses propres dépendances, comme "tar") n'est utile qu'au
# moment du build, jamais à l'exécution — on le supprime de l'image finale
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack

# Ne jamais faire tourner le conteneur en root (voir scénario de départ :
# "production deployment uses docker:latest with root")
USER node

EXPOSE 3000

CMD ["node", "src/server.js"]
