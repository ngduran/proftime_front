import { apiFetch, apiFetchGet } from "../api/api-client.js";
import { API_MAP } from "../api/api-config.js";

export async function cadastrarUsuario(dados) {    
    return await apiFetch(API_MAP.USUARIO.CREATE, dados);
}

export async function efetuarLogin(dados) {    
    return await apiFetch(API_MAP.AUTH.LOGIN, dados);
}

export async function salvarAulaGradeProfessor(dados) {    
    return await apiFetch(API_MAP.PROFESSOR_GRADE.CREATE_ITEM, dados);
}

export async function cadastrarInstituicao(dados) {
    return await apiFetch(API_MAP.INSTITUICAO.CREATE, dados);
}

export async function initialDataInstituicao() {
    return await apiFetchGet(API_MAP.INSTITUICAO.INITIAL);
}
