# Imagen base con Node 22 (ligera y optimizada)
FROM node:22-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los manifiestos para aprovechar la caché de Docker
# Si no cambian, Docker no volverá a instalar las dependencias
COPY package*.json ./

# Instalamos solo las dependencias de producción
RUN npm ci --omit=dev

# Copiamos el resto del código fuente de nuestra aplicación
COPY . .

# Escucha en el puerto 3001
EXPOSE 3001

# Comando que se ejecutará para arrancar el servicio
CMD ["node", "server.js"]
