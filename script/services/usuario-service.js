import { apiFetch } from "../api/api-client.js";
import { API_MAP } from "../api/api-config.js";

// export const API_CONFIG = {
//     BASE_URL: "http://127.0.0.1:8080",
//     RESOURCE: "/usuario"
// };

// export const ENDPOINTS = {
//     CREATE: { path: `${API_CONFIG.BASE_URL.RESOURCE}/create`, method: 'POST'  },
//     READ:   { path: `${API_CONFIG.RESOURCE}/read`,   method: 'POST'  },
//     UPDATE: { path: `${API_CONFIG.RESOURCE}/update`, method: 'PUT'   },
//     DELETE: { path: `${API_CONFIG.RESOURCE}/delete`, method: 'DELETE'}
// };

// export async function cadastrarUsuario(dados) {

//     const resultado = await apiFetch(ENDPOINTS.CREATE, dados);
    
//     // Regra específica: Se o back enviou UUID, guardamos na sessão
//     if (resultado?.uuid) {
//         sessionStorage.setItem("user_uuid", resultado.uuid);
//     }
//     return resultado;
// }

export async function cadastrarUsuario(dados) {
    // Apenas faz a ponte com a API e retorna o objeto puro do Java
    return await apiFetch(API_MAP.USUARIO.CREATE, dados);
}