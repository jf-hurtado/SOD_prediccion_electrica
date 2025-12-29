# Usamos la imagen oficial y ligera de Nginx
FROM nginx:stable-alpine

# 1. Borramos la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copiamos nuestro archivo de configuración personalizado
COPY nginx.conf /etc/nginx/conf.d/

# 3. Copiamos nuestros archivos estáticos a la carpeta de servicio
COPY . /usr/share/nginx/html