// src/App.jsx
import { useState } from 'react'; // 1. Importamos el Hook 'useState'
import './App.css';

function App() {
  // 2. Declaramos las "variables de estado" de nuestra aplicación
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const orchestratorUrl = '/run'; // La URL sigue siendo la misma

  // 3. La función que se ejecutará al hacer clic
  const handleExecuteFlow = async () => {
    // Preparamos el estado para la espera
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(orchestratorUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status}): ${responseData.message || 'Error desconocido'}`);
      }

      // ¡LA MAGIA! Actualizamos el estado con los datos recibidos
      setData(responseData);

    } catch (err) {
      // Si hay un error, lo guardamos en el estado
      setError(err.message);
    } finally {
      // Al final, dejamos de cargar
      setIsLoading(false);
    }
  };

  // 4. El JSX que se renderiza, ahora es dinámico
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Orquestador de Predicción Eléctrica (React v2)</h1>
      <p>Pulsa el botón para ejecutar el flujo completo a través del orquestador.</p>
      
      <button onClick={handleExecuteFlow} className="btn btn-primary btn-lg" disabled={isLoading}>
        {isLoading ? 'Ejecutando...' : 'Ejecutar Flujo Completo'}
      </button>

      {/* Renderizado Condicional: mostramos cosas dependiendo del estado */}
      {isLoading && (
        <div className="spinner-border text-primary mt-4" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div className="alert alert-success mt-4">
          <strong>¡Flujo completado con éxito!</strong>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;