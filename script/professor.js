const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8080",
    RESOURCE: "/professor"
};

const ENDPOINTS = {
    CREATE: { path: `${API_CONFIG.RESOURCE}/create`, method: 'POST'  },
    READ:   { path: `${API_CONFIG.RESOURCE}/read`,   method: 'POST'  },
    UPDATE: { path: `${API_CONFIG.RESOURCE}/update`, method: 'PUT'   },
    DELETE: { path: `${API_CONFIG.RESOURCE}/delete`, method: 'DELETE'}
};

/**
 * Coleta todos os dados de um formulário de forma automática
 * Requisito: Os inputs no HTML devem ter o atributo 'name' igual às chaves do DTO.
 */
function coletarDadosForm(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const formData = new FormData(formulario);
    
    // Converte o FormData em um objeto simples { nome: '...', email: '...' }
    return Object.fromEntries(formData.entries());
}

// /**
//  * Popula um formulário automaticamente com base em um objeto de dados.
//  * @param {string} idFormulario - O ID do formulário HTML.
//  * @param {Object} dados - O objeto retornado pelo back-end.
//  */
// function popularFormulario(idFormulario, dados) {
//     const formulario = document.getElementById(idFormulario);
//     if (!formulario || !dados) return;

//     // Percorre cada chave do objeto (ex: nome, email, telefone)
//     Object.keys(dados).forEach(key => {
//         // Procura um elemento dentro do formulário que tenha o atributo 'name' igual à chave
//         const campo = formulario.elements.namedItem(key);

//         if (campo) {
//             // Define o valor do campo com o dado do objeto
//             campo.value = dados[key];
//         }
//     });
// }


/**
 * Popula um formulário automaticamente buscando pelo atributo 'name'.
 */
async function popularFormulario(idFormulario, dados) {
    const formulario = document.getElementById(idFormulario);
    if (!formulario || !dados) return;

    // Iteramos sobre as chaves do objeto JSON (nome, email, etc)
    Object.keys(dados).forEach(key => {
        // Buscamos o input que tenha o atributo name EXATAMENTE igual à chave
        const campo = formulario.querySelector(`[name="${key}"]`);

        if (campo) {
            // Atribuímos o valor. O '?? ""' garante que se vier nulo do banco, o campo fique vazio
            campo.value = dados[key] ?? "";
            console.log(`Sucesso: Campo [${key}] preenchido.`);
        } else {
            console.warn(`Aviso: O JSON trouxe '${key}', mas não existe <input name="${key}"> no HTML.`);
        }
    });
    // Pequena pausa técnica para garantir que o DOM processe as mudanças
    // antes de liberar para o próximo passo (opcional, mas seguro para UX)
    await new Promise(resolve => setTimeout(resolve, 0));
}

async function executarAcao(endpoint, dados, id = null) {

    //const URL = `${API_CONFIG.BASE_URL}${endpoint.path}`;
    const { path, method } = endpoint;

    // Se um ID for passado, ele concatena à URL. Ex: /professor/10
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
            // Não envia body em GET
            body: endpoint.method !== 'GET' ? JSON.stringify(dados) : null
    }
   
    try {
        const response = await fetch(URL, FETCH_CONFIG);
        // Verifica se o status está entre 200-299
        if (!response.ok) {
            const erroStatus = await response.json().catch(() => ({}));
            throw new Error(erroStatus.message || `Erro no servidor: ${response.status}`);
        }

        const data = await response.json();
         console.log("Resposta do servidor:", data);
        return data;
    } catch (error) {
        console.error("Erro ao acessar o servidor:", error);
        throw error; // Repassa o erro para a função salvar()
        
    }

}

async function salvar() {

    const ACAO_BOTAO = { nome: 'Salvar', acao: 'Salvando...'}

    try {
        
        const dados = coletarDadosForm("formProfessor"); // Supondo que seu <form> tenha id="formProfessor"
        console.log(dados);
        const btn = document.querySelector("button"); // Bloqueia o botão para evitar cliques duplos (UX Profissional)
        btn.disabled = true;
        btn.innerText = ACAO_BOTAO.acao;
        
        //const dados = coletarDados();
        const resultado = await executarAcao(ENDPOINTS.CREATE, dados);
        
        // --- ALTERAÇÃO AQUI ---
        // Guardando o ID retornado pelo Spring Boot
        if (resultado && resultado.id) {
            sessionStorage.setItem('professorId', resultado.id);
            console.log("ID guardado na sessão:", resultado.id);
        }
        // ----------------------
        
       alert("Operação realizada com sucesso!");
       document.getElementById("formProfessor").reset(); // Limpa o formulário

    } catch (error) {
        alert(`Falha ao salvar: ${error.message}`);
    } finally {
        // Restaura o botão independente de sucesso ou erro
        const btn = document.querySelector("button");
        btn.disabled = false;
        btn.innerText = ACAO_BOTAO.nome;        
    }
}

async function consultar() {

    const ACAO_BOTAO = { nome: 'Consultar', acao: 'Consultando...'}

    const idLogado = sessionStorage.getItem('professorId');

    if (idLogado) {
        console.log("O ID do professor atual é: " + idLogado);
        // Agora você pode usar esse ID para fazer um GET e carregar os dados
    } else {
        console.log("O ID do professor não localizado");
    }

    try {
        
        const dados = coletarDadosForm("formProfessor"); // Supondo que seu <form> tenha id="formProfessor"
        console.log(dados);
        const btn = document.querySelector("button"); // Bloqueia o botão para evitar cliques duplos (UX Profissional)
        btn.disabled = true;
        btn.innerText = ACAO_BOTAO.acao;

        //const dados = coletarDados();
        const resultado = await executarAcao(ENDPOINTS.READ, dados, null);

        // Popula todos os campos de uma vez só!
        await popularFormulario("formProfessor", resultado);

        // Somente após o término deste bloco, o alert do gerenciarRequisicao aparecerá
        
        alert("Operação realizada com sucesso!");
        //document.getElementById("formProfessor").reset(); // Limpa o formulário

    } catch (error) {
        alert(`Falha ao consultar: ${error.message}`);
    } finally {
        // Restaura o botão independente de sucesso ou erro
        const btn = document.querySelector("button");
        btn.disabled = false;
        btn.innerText = ACAO_BOTAO.nome;        
    }
}