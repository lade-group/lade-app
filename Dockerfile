# Etapa 1: build
FROM node:22.16.0-alpine AS builder

WORKDIR /app

# Copiar solo package.json y lock para aprovechar cache
COPY package*.json ./

# Instalar dependencias (dev incluídas para el build)
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Construir el frontend (esto genera /dist)
RUN npm run build

# Etapa 2: producción - Servir archivos estáticos con `serve`
FROM node:22.16.0-alpine

WORKDIR /app

# Instalar servidor estático
RUN npm install -g serve

# Copiar solo archivos de build
COPY --from=builder /app/dist ./dist

# Exponer puerto (ajusta si usas otro)
EXPOSE 5173

# Ejecutar servidor en modo SPA
CMD ["serve", "-s", "dist", "-l", "5173"]
