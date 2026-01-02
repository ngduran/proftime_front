// Apenas faz o fetch e traduz a resposta (Erro ou JSON)
export async function apiFetch(endpoint, dados) {
    const response = await fetch(API_CONFIG.BASE_URL + endpoint.path, {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    if (!response.ok) {
        // Pega a mensagem do Java (ex: "E-mail já existe")
        const msg = await response.text(); 
        const erro = new Error(msg || "Erro desconhecido");
        erro.status = response.status;
        throw erro;
    }

    // Se for 201 ou 200, tenta ler o JSON
    return response.status !== 204 ? await response.json() : null;
}