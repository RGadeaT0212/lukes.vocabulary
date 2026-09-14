// ==========================================================================
// CONFIGURACIÓN CENTRAL DEL CLIENTE SUPABASE (CONEXIÓN DE RED)
// ==========================================================================

// 🔑 CREDENCIALES DE TU PROYECTO
const SUPABASE_URL = "https://ylhjsbeliblhzkquxjss.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsaGpzYmVsaWJsaHprcXV4anNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNTAxMzcsImV4cCI6MjA5NzYyNjEzN30.SsiVPZP_V-ZyePINdwqHeJ4YUV2HIK7SPwAHYCGjo9k";

// Comprobar la disponibilidad del CDN de Supabase en el HTML
if (typeof window.supabase === 'undefined') {
    console.error("Error Crítico: El CDN de Supabase no se ha cargado correctamente en el HTML.");
}

// Inicialización del cliente
export const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🚀 EXPORTACIÓN DUAL: Garantiza compatibilidad total con progressManager.js y site.js
export const supabase = supabaseClient;

/**
 * Registra una nueva cuenta de estudiante en Supabase Auth y redirige a verify.html
 */
export async function registerNewStudent(email, password, firstName) {
    try {
        const redirectUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'verify.html';

        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectUrl,
                data: {
                    first_name: firstName
                }
            }
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("// Auth Exception durante el registro:", err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Valida las credenciales de un usuario e inicia sesión
 */
export async function logInStudent(email, password) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error("// Auth Exception durante inicio de sesión:", err.message);
        return { success: false, error: err.message };
    }
}

/**
 * Cierra la sesión activa en el servidor
 */
export async function logOutStudent() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        return true;
    } catch (err) {
        console.error("// Auth Exception al cerrar sesión:", err.message);
        return false;
    }
}
