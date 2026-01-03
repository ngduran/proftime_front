export async function apiFetch(endpoint, dados) {
    try {
        const response = await fetch(endpoint.path, {
            method: endpoint.method,
            headers: { 
                "Content-Type": "application/json",               
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify(dados)
        });
      
        return response;
        
    } catch (error) {
        // O único erro que tratamos é se o fetch falhar (ex: sem internet ou servidor offline)
        console.error("Erro crítico de rede:", error);
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }
}

export async function lerRespostaSucesso(response) {
    return await extrairDados(response);
}

export async function lerRespostaErro(response) {
    return await extrairDados(response);
}

async function extrairDados(response) {    
    const contentType = response.headers.get("content-type");
    const status = response.status;
    
    if (status === 204) return null;

    try {
        
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        const texto = await response.text();
                
        if (texto && (texto.startsWith('{') || texto.startsWith('['))) {
            try {
                return JSON.parse(texto);
            } catch (e) {
                return texto;
            }
        }

        return texto || null;

    } catch (erro) {
        console.error("[API CLIENT] Erro ao extrair dados da resposta:", erro);
        // Retorna um objeto de erro padronizado para não quebrar o fluxo superior
        return { error: "Falha ao processar resposta do servidor", detalhe: erro.message };
    }
}