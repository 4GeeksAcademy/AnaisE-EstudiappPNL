src/component/PayPalButton.jsx 
import React, { useEffect, useRef } from 'react';
import { useContext } from 'react';
import { Context } from '../store/appContext'; // Ajusta la ruta

const PayPalButton = ({ amount, onPaymentSuccess, onPaymentError }) => {
    const { store, actions } = useContext(Context);
    const paypalRef = useRef();

    useEffect(() => {
        // Asegúrate de que el SDK de PayPal se haya cargado
        if (window.paypal) {
            window.paypal.Buttons({
                createOrder: async (data, actions) => {
                    try {
                        const response = await fetch(`${store.backendUrl}/api/create-paypal-order`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // 'Authorization': `Bearer ${store.token}` // Si tu endpoint de backend requiere auth
                            },
                            body: JSON.stringify({ amount: amount, currency: 'USD' }),
                        });
                        const order = await response.json();
                        if (response.ok) {
                            return order.order_id;
                        } else {
                            throw new Error(order.error || 'Error al crear la orden de PayPal');
                        }
                    } catch (error) {
                        console.error('Error en createOrder:', error);
                        onPaymentError('Error al iniciar el pago con PayPal.');
                        return Promise.reject(error); // Para que PayPal sepa que hubo un error
                    }
                },
                onApprove: async (data, actions) => {
                    try {
                        const response = await fetch(`${store.backendUrl}/api/capture-paypal-order`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                // 'Authorization': `Bearer ${store.token}` // Si tu endpoint de backend requiere auth
                            },
                            body: JSON.stringify({ order_id: data.orderID }),
                        });
                        const details = await response.json();

                        if (response.ok && details.status === 'COMPLETED') {
                            console.log('Pago de PayPal completado:', details);
                            onPaymentSuccess(details); // Llama a la función de callback en el componente padre
                        } else {
                            throw new Error(details.error || 'Pago de PayPal no completado.');
                        }
                    } catch (error) {
                        console.error('Error en onApprove:', error);
                        onPaymentError('Error al procesar el pago de PayPal.');
                    }
                },
                onError: (err) => {
                    console.error('Error de PayPal:', err);
                    onPaymentError('Ha ocurrido un error con PayPal. Por favor, inténtelo de nuevo.');
                }
            }).render(paypalRef.current);
        }
    }, [amount, store.backendUrl, onPaymentSuccess, onPaymentError]); // Dependencias del useEffect

    return (
        <div ref={paypalRef} style={{ maxWidth: '300px', margin: '20px auto' }}>
            {/* Aquí se renderizará el botón de PayPal */}
        </div>
    );
};

export default PayPalButton;
