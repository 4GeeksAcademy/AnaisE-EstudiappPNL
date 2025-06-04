import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from 'sweetalert2';

const DashboardView = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.token) {
            navigate("/login");
            return;
        }

        if (!store.dashboardData && !store.testLoading) {
            actions.getDashboardData();
        }
    }, [store.token, actions, navigate, store.dashboardData, store.testLoading]);

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

    const userData = store.dashboardData.user_data;
    const hasCompletedTest = store.dashboardData.has_completed_test;
    const testResults = userData.test_results;
    const latestTestResult = testResults && testResults.length > 0 ? testResults[testResults.length - 1] : null;

    const getChannelLabel = (code) => {
        switch (code) {
            case 'V': return 'Visual';
            case 'A': return 'Auditivo';
            case 'K': return 'Kinestésico';
            default: return 'No definido';
        }
    };

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

                            <hr />
                            <h3>¡Tu espacio personalizado!</h3>

                            {latestTestResult ? (
                                <div>
                                    <p><strong>Resultado del test:</strong></p>
                                    <ul>
                                        <li><strong>Canal de aprendizaje dominante:</strong> {getChannelLabel(latestTestResult.dominant_channel)}</li>
                                        <li><strong>Fecha del test:</strong> {new Date(latestTestResult.created_at).toLocaleDateString()}</li>
                                    </ul>
                                </div>
                            ) : (
                                <p>Aún no hay resultados de test disponibles.</p>
                            )}

                            {!hasCompletedTest && (
                                <div className="alert alert-info mt-3">
                                    ¡Parece que aún no has completado tu test de PNL! Te recomendamos hacerlo para desbloquear todas las funciones.
                                </div>
                            )}

                            <Link to="/vaktest">
                                <button className="btn btn-primary">Test VAK</button>
                            </Link>

                            <div className="mt-4">
                                <span className="d-block">Regálame un café:</span>
                                <PayPalScriptProvider options={{ clientId: process.env.PAYPAL_CLIENT_ID }}>
                                    <PayPalButtons
                                        onApprove={(data, actions) => {
                                            return actions.order.capture().then((details) => {
                                                const name = details.payer.name.given_name;
                                                Swal.fire({
                                                    title: "¡Excelente!",
                                                    text: `Gracias por tu donación, ${name}!`,
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
        </div>
    );
};

export default DashboardView;