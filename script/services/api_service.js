import { apiFetch, apiFetchGet, apiFetchGetWithId } from "../api/api-client.js";
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

export async function listarEstados() {
    return await apiFetchGet(API_MAP.ESTADO.FINDALL);
}

export async function listarMunicipiosPorEstado(idEstado, termoBusca) {
    return await apiFetchGetWithId(API_MAP.MUNICIPIO.POR_ESTADO, idEstado, termoBusca);

}

export async function listarInstituicoes() {
    return await apiFetchGet(API_MAP.INSTITUICAO.FINDALL);

}