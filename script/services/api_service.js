import { apiFetch } from "../api/api-client.js";
import { API_MAP } from "../api/api-config.js";

export async function cadastrarUsuario(dados) {    
    return await apiFetch(API_MAP.USUARIO.CREATE, dados);
}

export async function efetuarLogin(dados) {
    console.log("Chamou o efetuar login");
    return await apiFetch(API_MAP.AUTH.LOGIN, dados);
}