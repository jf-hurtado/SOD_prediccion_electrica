# ---- Fase 1: La Receta del Servidor Nginx ----

# Usamos la imagen oficial de Nginx, versión 'stable-alpine'.
# 'alpine' significa que es una versión ultra-ligera, lo que es una buena práctica.
FROM nginx:stable-alpine

# Nginx, por defecto, busca archivos para servir en la carpeta /usr/share/nginx/html.
# Este comando copia TODO el contenido de nuestra carpeta actual (el '.')
# (index.html, style.css, script.js) a esa carpeta mágica dentro del contenedor.
COPY . /usr/share/nginx/html