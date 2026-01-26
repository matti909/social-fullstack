# Stage 1: Construcción
FROM node:16.4.2-alpine as build

WORKDIR /app

# Copiar ambos paquetes
COPY server/package.json ./server/
COPY graphql-types/package.json ./graphql-types/

WORKDIR /app/server
RUN npm install --legacy-peer-deps

WORKDIR /app/graphql-types
RUN npm install --legacy-peer-deps

WORKDIR /app
COPY graphql-types ./graphql-types
COPY server ./server

# Compilar server (--build compila también las referencias)
WORKDIR /app/server
RUN npx tsc --build
# Copiar archivos no-TS al dist
RUN cp -r src/graphql/*.graphql dist/src/graphql/

# Stage 2: Producción
FROM node:16.4.2-alpine

WORKDIR /app

COPY --from=build /app/server/package.json .
COPY --from=build /app/server/dist ./dist
COPY --from=build /app/graphql-types ../graphql-types

RUN npm install --legacy-peer-deps --production

EXPOSE 4000

CMD [ "node", "dist/src/index.js" ]
