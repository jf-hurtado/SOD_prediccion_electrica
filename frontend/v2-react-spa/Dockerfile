# --- FASE 1: El Constructor (Builder) ---
# Usamos una imagen completa de Node para tener npm y todas las herramientas
FROM node:22-slim AS builder

WORKDIR /app

# Copiamos los manifiestos e instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código fuente
COPY . .

# ¡El paso clave! Construimos la versión de producción optimizada
RUN npm run build

# --- FASE 2: El Servidor Final ---
# Usamos una imagen súper ligera de Nginx
FROM nginx:stable-alpine

# Copiamos la configuración de Nginx (la crearemos en el siguiente paso)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# El paso mágico: copiamos SÓLO los archivos construidos de la fase 'builder'
# La carpeta 'dist' es donde Vite pone los archivos optimizados (HTML, CSS, JS)
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx ya sabe cómo arrancar y servir desde esa carpeta en el puerto 80
