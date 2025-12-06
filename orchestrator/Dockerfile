# Imagen base con Node 22 (ligera y optimizada)
FROM node:22-slim

# Directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos primero los manifiestos para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos solo las dependencias de producción
# Asegúrate de haber instalado node-fetch@2 para que funcione con require
RUN npm ci --omit=dev

# Copiamos el resto del código fuente de nuestra aplicación
COPY . .

# Escucha en el puerto 8080 
EXPOSE 8080

# Comando que se ejecutará para arrancar el servicio
CMD ["node", "server.js"]
