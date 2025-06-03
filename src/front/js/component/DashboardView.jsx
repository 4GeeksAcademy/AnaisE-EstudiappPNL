import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate para redirección
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2'

const DashboardView = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate(); // Hook para la redirección

    useEffect(() => {
        console.log("DashboardView: Componente montado o token cambiado.");
        // Si no hay token, redirige al login
        if (!store.token) {
            console.log("DashboardView: No hay token. Redirigiendo a /login");
            navigate("/login");
            return; // Detiene la ejecución del useEffect
        }

        // Si hay token, pero no hay datos del dashboard, o si el token cambia, obtenlos
        if (!store.dashboardData && !store.testLoading) { // solo si no hay datos y no estamos ya cargando
             console.log("DashboardView: Token presente, obteniendo datos del dashboard.");
             actions.getDashboardData();
        }
       
        // Dependencias: ejecutar cuando el token cambie
    }, [store.token, actions, navigate, store.dashboardData, store.testLoading]); 
    // Añadí store.dashboardData y store.testLoading a las dependencias para evitar llamadas redundantes si los datos ya están ahí
    // También actions y navigate, aunque actions suele ser estable, y navigate para evitar warnings de ESLint.

    // --- Manejo de estados de carga y error ---
    if (store.testLoading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando datos del dashboard...</span>
                </div>
                <p>Cargando datos del dashboard...</p>
            </div>
        );
    }

    if (store.dashboardError) {
        return (
            <div className="text-center mt-5 alert alert-danger">
                <h4>Error al cargar el dashboard:</h4>
                <p>{store.dashboardError}</p>
                <button className="btn btn-primary" onClick={() => actions.getDashboardData()}>
                    Intentar de nuevo
                </button>
            </div>
        );
    }

    // Después de cargar y sin errores, si dashboardData sigue siendo null, significa que no hay datos.
    // Esto podría pasar si el token no es válido o hubo otro problema no capturado por dashboardError.
    if (!store.dashboardData || !store.dashboardData.user_data) {
        return (
            <div className="text-center mt-5 alert alert-warning">
                <h4>No se pudieron cargar los datos del dashboard.</h4>
                <p>Por favor, inténtalo de nuevo o inicia sesión.</p>
                <button className="btn btn-primary" onClick={() => actions.getDashboardData()}>
                    Recargar Dashboard
                </button>
                <button className="btn btn-secondary ms-2" onClick={() => navigate("/login")}>
                    Ir a Login
                </button>
            </div>
        );
    }

    // Accede a los datos del usuario directamente de dashboardData
    const userData = store.dashboardData.user_data;
    const hasCompletedTest = store.dashboardData.has_completed_test; // Ahora este campo vendrá del backend

   
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg">
                        <div className="card-header bg-primary text-white text-center">
                            <h2>Bienvenido a tu Dashboard, {userData.username}!</h2>
                        </div>
                        <div className="card-body">
                            <p className="card-text"><strong>ID de Usuario:</strong> {userData.id}</p>
                            <p className="card-text"><strong>Email:</strong> {userData.email}</p>
                            <p className="card-text"><strong>Rol:</strong> {userData.rol}</p>
                            <p className="card-text">
                                <strong>Test de PNL Completado:</strong> {hasCompletedTest ? "Sí" : "No"}
                            </p>
                            
                            {/* Aquí puedes añadir más secciones de tu dashboard */}
                            <hr />
                            <h3>¡Tu espacio personalizado!</h3>
                            <p>Aquí verás contenido y funcionalidades basadas en tu perfil y resultados de test.</p>

                            {!hasCompletedTest && (
                                <div className="alert alert-info mt-3">
                                    ¡Parece que aún no has completado tu test de PNL! Te recomendamos hacerlo para desbloquear todas las funciones.
                                </div>
                            )}
                    <Link to="/vaktest">
						<button className="btn btn-primary">Test VAK</button>
					</Link>
                    <span className="d-block">Regálame un café:</span>
                    <PayPalScriptProvider options={{ clientId: process.env.PAYPAL_CLIENT_ID }}>
           <PayPalButtons
                onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            const name = details.payer.name.given_name;
           Swal.fire({
  title: "Excelente!",
  text: `Gracias por tu donación ${name}!`,
  icon: "success"
});
          });
        }}
            />
        </PayPalScriptProvider>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView
