export const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8080",
    RESOURCE: "/usuario"
};

export const ENDPOINTS = {
    CREATE: { path: `${API_CONFIG.RESOURCE}/create`, method: 'POST'  },
    READ:   { path: `${API_CONFIG.RESOURCE}/read`,   method: 'POST'  },
    UPDATE: { path: `${API_CONFIG.RESOURCE}/update`, method: 'PUT'   },
    DELETE: { path: `${API_CONFIG.RESOURCE}/delete`, method: 'DELETE'}
};

export async function executarAcao(endpoint, dados, id = null) {
    
    const { path, method } = endpoint;
  
    const pathComId = id ? `${endpoint.path}/${id}` : endpoint.path;
    const URL = `${API_CONFIG.BASE_URL}${pathComId}`;

    const HEADERS = new Headers({
        "Content-Type": "application/json"
    });

    const FETCH_CONFIG = {        
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            headers: HEADERS,           
            body: endpoint.method !== 'GET' ? JSON.stringify(dados) : null
    }
   
    try {
        const response = await fetch(URL, FETCH_CONFIG);
        
        if (!response.ok) {
            const erroStatus = await response.json().catch(() => ({}));
            throw new Error(erroStatus.message || `Erro no servidor: ${response.status}`);
        }

        // SOLUÇÃO: Verifica se o status é 204 (No Content) ou se não há corpo
        const contentType = response.headers.get("content-type");
        if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
            console.log("Sucesso, mas sem corpo de resposta.");
            return null; 
        }

        const data = await response.json();
        console.log("Resposta do servidor:", data);
        return data;
    } catch (error) {
        console.error("Erro ao acessar o servidor:", error);
        throw error;
        
    }

}

/**
 * Função genérica para salvar qualquer formulário
 * @param {string} formId - O ID do formulário no HTML (ex: "instituicaoForm")
 * @param {string} btnId - O ID do botão (ex: "cadastrarBtn")
 * @param {string} endpoint - A URL/Endpoint (ex: ENDPOINTS.INSTITUICAO)
 * @param {string} sessionKey - A chave para guardar o ID (ex: "instituicaoId")
 */
export async function salvarGenerico(formId, btnId, endpoint, sessionKey) {
    const ACAO_BOTAO = { nome: 'Salvar', acao: 'Salvando...' };
    const btn = document.getElementById(btnId);
    const form = document.getElementById(formId);

    try {
        const dados = coletarDadosForm(formId);
        console.log(`Dados de ${formId}:`, dados);

        btn.disabled = true;
        btn.innerText = ACAO_BOTAO.acao;

        const resultado = await executarAcao(endpoint, dados);

        // Se houver retorno de ID e uma chave de sessão foi informada
        if (resultado && resultado.id && sessionKey) {
            sessionStorage.setItem(sessionKey, resultado.id);
            console.log(`ID guardado em ${sessionKey}:`, resultado.id);
        }

        alert("Operação realizada com sucesso!");
        form.reset();

    } catch (error) {
        alert(`Falha ao salvar: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.innerText = ACAO_BOTAO.nome;
    }
}