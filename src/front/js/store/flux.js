const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            demo: [
                {
                    title: "FIRST",
                    background: "white",
                    initial: "white"
                },
                {
                    title: "SECOND",
                    background: "white",
                    initial: "white"
                }
            ],
            backendUrl: process.env.BACKEND_URL,
            token: null,
            user: null,  // Para almacenar la información del usuario logueado
            // --- NUEVOS ESTADOS PARA EL DASHBOARD ---
            dashboardData: null, // Para almacenar los datos del dashboard
            dashboardError: null, // Para manejar errores específicos del dashboard
            testLoading: false,  // Para indicar si los datos del dashboard están cargando
            // --- FIN NUEVOS ESTADOS ---
        },
        actions: {
            // Use getActions to call a function within a fuction
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getMessage: async () => {
                try {
                    const store = getStore();
                    const resp = await fetch(`${store.backendUrl}/api/hello`); // Usar store.backendUrl
                    const data = await resp.json();
                    setStore({ message: data.message });

                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },
            changeColor: (index, color) => {
                //get the store
                const store = getStore();


                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });


                setStore({ demo: demo });
            },

            // --- ACCIÓN DE REGISTRO ---
            register: async (email, username, password) => {
                console.log("FLUX (register): Intentando registrar usuario:", email);
                try {
                    const store = getStore(); // Obtener el store para acceder a backendUrl
                    const response = await fetch(`${store.backendUrl}/api/register`, { // Usar store.backendUrl
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, username, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("FLUX (register): Error backend:", data.msg || data.message || data);
                        setStore({ message: data.msg || data.message || "Error desconocido en el registro" });
                        return { success: false, message: data.msg || data.message || "Error desconocido" };
                    }
                    console.log("FLUX (register): Registro exitoso:", data);
                    setStore({ message: data.msg || "Registro exitoso" });
                    return { success: true, data };
                } catch (error) {
                    console.error("FLUX (register): Error fetch:", error);
                    setStore({ message: error.message || "Error de red al registrar" });
                    return { success: false, message: error.message };
                }
            },

            // --- ACCIÓN DE LOGIN ---
            login: async (identifier, password) => {
                console.log("FLUX (login): Intentando iniciar sesión con:", identifier);
                try {
                    const store = getStore();
                    const response = await fetch(`${store.backendUrl}/api/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ identifier, password }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("FLUX (login): Error backend:", data.msg || data.message || data);
                        setStore({ message: data.msg || data.message || "Error desconocido en el login" });
                        return { success: false, message: data.msg || data.message || "Error desconocido" };
                    }

                    console.log("FLUX (login): Login exitoso:", data);
                    // Guardar el token y la info del usuario en el store y localStorage
                    setStore({
                        token: data.access_token,
                        user: data.user,
                        message: data.msg || "Login exitoso"
                    });
                    localStorage.setItem("jwt_token", data.access_token); // Guarda el token en localStorage
                    localStorage.setItem("user_info", JSON.stringify(data.user)); // Guarda la info del usuario

                    return { success: true, data };
                } catch (error) {
                    console.error("FLUX (login): Error fetch:", error);
                    setStore({ message: error.message || "Error de red al iniciar sesión" });
                    return { success: false, message: error.message };
                }
            },

            // --- ACCIÓN DE LOGOUT ---
            logout: () => {
                setStore({ token: null, user: null, message: "Sesión cerrada" });
                localStorage.removeItem("jwt_token");
                localStorage.removeItem("user_info");
                console.log("FLUX: Sesión cerrada.");
            },

            // --- ACCIÓN PARA SINCRONIZAR TOKEN DESDE LOCALSTORAGE AL INICIAR LA APP ---
            syncTokenFromLocalStorage: () => {
                const token = localStorage.getItem("jwt_token");
                const user = JSON.parse(localStorage.getItem("user_info")); // Parsear la info del usuario
                if (token && user) {
                    setStore({ token: token, user: user });
                    console.log("FLUX: Token y usuario sincronizados desde localStorage.");
                } else {
                    setStore({ token: null, user: null }); // Limpiar si no hay token o user
                }
            }, // <-- CIERRA LA ACCIÓN syncTokenFromLocalStorage AQUÍ

            // --- ACCIÓN getDashboardData 
            getDashboardData: async () => {
                const store = getStore();
                const actions = getActions();
                const token = store.token;

                console.log("FLUX (getDashboardData): Solicitando datos del dashboard al backend...");
                setStore({ dashboardData: null, dashboardError: null, testLoading: true }); // Resetear estados

                if (!token) {
                    console.error("FLUX (getDashboardData): No hay token de acceso. No se puede acceder al dashboard.");
                    setStore({ dashboardError: "No autorizado: No hay token de acceso.", testLoading: false });
                    return { success: false, message: "No autorizado: No hay token." };
                }

                try {
                    const response = await fetch(`${store.backendUrl}/api/dashboard`, { // Usa store.backendUrl
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        console.error("FLUX (getDashboardData): Error al acceder al dashboard:", data.msg || data.message || data);
                        setStore({ dashboardError: data.msg || data.message || "Error desconocido al cargar dashboard.", testLoading: false });
                        if (response.status === 401 || response.status === 403) {
                            console.warn("FLUX (getDashboardData): Token expirado o inválido, realizando logout.");
                            actions.logout(); // Llama a la acción logout
                        }
                        return { success: false, message: data.msg || data.message || "Error al cargar dashboard." };
                    }

                    console.log("FLUX (getDashboardData): Datos del dashboard recibidos:", data);
                    setStore({ dashboardData: data, testLoading: false, dashboardError: null }); // Guarda los datos completos en el store
                    return { success: true, data };

                } catch (error) {
                    console.error("FLUX (getDashboardData): Error fetch:", error);
                    setStore({ dashboardError: error.message || "Error de red al cargar dashboard.", testLoading: false });
                    return { success: false, message: error.message };
                }
            },


            submitTestAnswers: async (answers) => {
            const store = getStore();
            const token = store.token;

            if (!token) {
                console.error("FLUX (submitTestAnswers): No hay token. Usuario no autenticado.");
                return { success: false, message: "No autorizado." };
            }

            try {
                const response = await fetch(`${store.backendUrl}/api/submit-test-answers`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ answers: answers }), // Envía el diccionario de respuestas
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("FLUX (submitTestAnswers): Error del backend:", data.msg || data.message || data);
                    setStore({ message: data.msg || data.message || "Error al enviar test." });
                    return { success: false, message: data.msg || data.message || "Error al enviar test." };
                }

                console.log("FLUX (submitTestAnswers): Test enviado exitosamente:", data);
                
                return { success: true, data };

            } catch (error) {
                console.error("FLUX (submitTestAnswers): Error de red:", error);
                setStore({ message: error.message || "Error de red al enviar test." });
                return { success: false, message: error.message };
            }
        },
        },
        //REGISTRA LAS RESPUESTAS DADAS POR EL USUARIO
        

    };
};

export default getState;