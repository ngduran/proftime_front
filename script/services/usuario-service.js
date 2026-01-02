export async function cadastrarUsuario(dados) {
    const resultado = await apiFetch(ENDPOINTS.USUARIO_CREATE, dados);
    
    // Regra específica: Se o back enviou UUID, guardamos na sessão
    if (resultado?.uuid) {
        sessionStorage.setItem("user_uuid", resultado.uuid);
    }
    return resultado;
}