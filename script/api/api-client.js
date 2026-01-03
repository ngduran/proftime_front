export async function apiFetch(endpoint, dados) {

    console.log("------------------- endpoint -------------------------------------");
    console.log(endpoint);
    console.log("------------------------------------------------------------------");
    console.log("------------------- path -----------------------------------------");
    console.log(endpoint.path);
    console.log("------------------------------------------------------------------");
    console.log("------------------- method ---------------------------------------");
    console.log(endpoint.method);
    console.log("------------------------------------------------------------------");

    try {
        const response = await fetch(endpoint.path, {
            method: endpoint.method,
            headers: { 
                "Content-Type": "application/json",
                // ESSA LINHA RESOLVE O CORS DO NGROK:
                "ngrok-skip-browser-warning": "true"
            },
            body: JSON.stringify(dados)
        });

        // Retornamos o objeto response INTEIRO. 
        // Não tratamos JSON, não tratamos texto, não tratamos erro HTTP aqui.
        return response;
        
    } catch (error) {
        // O único erro que tratamos é se o fetch falhar (ex: sem internet ou servidor offline)
        console.error("Erro crítico de rede:", error);
        throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
    }
}

// Converte a resposta em JSON caso seja sucesso
export async function lerRespostaSucesso(response) {
    if (response.status === 204) return null; // No Content
    return await response.json();
}

// Converte a resposta em texto caso seja erro (mensagem do Java)
export async function lerRespostaErro(response) {
    const texto = await response.text();
    return texto || "Erro inesperado no servidor";
}

// // Apenas faz o fetch e traduz a resposta (Erro ou JSON)
// export async function apiFetch(endpoint, dados) {

//     const response = await fetch(endpoint.path, {
//         method: endpoint.method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(dados)
//     });

//     if (!response.ok) {
//         // Pega a mensagem do Java (ex: "E-mail já existe")
//         const msg = await response.text(); 
//         const erro = new Error(msg || "Erro desconhecido");
//         erro.status = response.status;
//         throw erro;
//     }

//     // Se for 201 ou 200, tenta ler o JSON
//     return response.status !== 204 ? await response.json() : null;
// }