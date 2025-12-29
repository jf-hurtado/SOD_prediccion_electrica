# SOD Predicción Eléctrica

## ¿De qué va este repositorio?
Es un predictor eléctrico de un edificio específico de la UA.

El sistema está compuesto por un backend de microservicios y un cliente web para visualizar los resultados

## Arquitectura del proyecto:
- `backend/acquire`: Obtiene y procesa datos de una API externa.

- `backend/predict`: Ejecuta un modelo de IA para hacer predicciones.

- `backend/orchestrator`: Actúa como BFF, coordinando los servicios.

- `frontend/v1-vanilla-nginx`: Un cliente web estático servido por Nginx.

## Prerequisitos:
- Docker y Docker Compose

## Instrucciones para replicar:
1. Clonar el repositorio: `git clone https://github.com/jf-hurtado/SOD_prediccion_electrica`

2. Crea el archivo de entorno (.env) rellenando los campos del .env.example  

3. Levanta el docker compose: `docker compose up --build` 
    - Añade el flag `-d` si quieres que se ejecute en segundo plano y así tener el control de la terminal (no verás los logs)

## Uso
Ahora que el servicio se está ejecutando sólamente tienes que:
1. Ir a tu navegador y buscar la url `http://localhost` 

2. Pulsa el botón 'Ejecuta flujo' para realizar la búsqueda

3. También puedes utilzar postman: `POST http://localhost:8080/run` con un body={}
