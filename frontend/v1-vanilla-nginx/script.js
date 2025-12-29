// Nos aseguramos de que el HTML esté completamente cargado antes de ejecutar nada
document.addEventListener('DOMContentLoaded', () => {
    
    const runBtn = document.getElementById('runOrchestratorBtn');
    const resultDiv = document.getElementById('result');
    const spinner = document.getElementById('spinner');

    // La URL de nuestro orquestador. ¡Es la única que el cliente necesita conocer!
    // No usamos localhost porque, desde la perspectiva del navegador, el servidor está en el mismo dominio.
    const orchestratorUrl = '/run';

    const executeFlow = async () => {
        // Preparamos la UI para la espera
        resultDiv.innerHTML = '';
        resultDiv.className = 'mt-4'; // Reseteamos las clases de alerta
        spinner.classList.remove('d-none');
        runBtn.disabled = true;

        try {
            // Hacemos la llamada al BFF (nuestro orquestador)
            const response = await fetch(orchestratorUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            const data = await response.json();

            // Verificamos si la respuesta del orquestador fue un error HTTP
            if (!response.ok) {
                throw new Error(`Error del servidor (${response.status}): ${data.message || 'Error desconocido'}`);
            }

            // Mostramos el resultado exitoso
            resultDiv.classList.add('alert', 'alert-success');
            resultDiv.innerHTML = `<strong>¡Flujo completado con éxito!</strong><br><pre>${JSON.stringify(data, null, 2)}</pre>`;

        } catch (error) {
            // Mostramos cualquier error que haya ocurrido
            console.error('Error durante la ejecución del flujo:', error);
            resultDiv.classList.add('alert', 'alert-danger');
            resultDiv.textContent = error.message;

        } finally {
            // Esto se ejecuta siempre, haya habido éxito o error
            spinner.classList.add('d-none');
            runBtn.disabled = false;
        }
    };

    runBtn.addEventListener('click', executeFlow);
});