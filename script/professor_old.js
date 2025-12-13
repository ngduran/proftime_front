/**
 * =================================================================
 * CONFIGURAÇÕES GLOBAIS
 * Você SÓ precisa alterar esta seção para reutilizar o código.
 * =================================================================
 */

// URL base da API (ex: "http://localhost:8080")
const API_BASE_URL = "http://localhost:8080"; 

// Segmento do recurso (ex: "/loja", "/produto", "/cliente")
const API_RESOURCE = "/professor"; 

// Chave para armazenar o ID do recurso (ex: "id_loja", "id_produto")
const LOCAL_STORAGE_ID_KEY = "id_professor"; 

// Lista dos IDs dos campos do formulário para iteração fácil
const FORM_FIELDS = ['nome', 'email', 'telefone', 'senha'];

// ID do elemento para mensagens globais de sucesso/erro
const GLOBAL_MESSAGE_ID = 'erro-mensagem';

// Configurações dos ENDPOINTS e MÉTODOS
const ENDPOINTS = {
    SALVAR: { path: `${API_RESOURCE}/salvar`, method: 'POST', successMsg: 'Cadastro realizado com sucesso!' },
    CONSULTAR: { path: `${API_RESOURCE}/consultar`, method: 'POST', successMsg: 'Registro encontrado!' },
    ALTERAR: { path: `${API_RESOURCE}/alterar`, method: 'PUT', successMsg: 'Registro alterado com sucesso!' }, // Alterado para PUT (padrão REST)
    DELETAR: { path: `${API_RESOURCE}/deletar`, method: 'DELETE', successMsg: 'Registro deletado com sucesso!' } // Alterado para DELETE (padrão REST)
};

// Mensagens padrão para tratamento de UI
const MESSAGES = {
    REQUIRED_FIELDS: "⚠️ Por favor, preencha os campos obrigatórios.",
    MISSING_ID: "⚠️ Consulte e carregue o registro antes de tentar esta operação.",
    VALIDATION_ERROR: "⚠️ Por favor, corrija os erros destacados no formulário.",
    CONNECTION_FAILURE: "❌ Falha ao conectar com o servidor."
};


/**
 * =================================================================
 * FUNÇÕES AUXILIARES DE UI E DOM
 * =================================================================
 */

function getElement(id) {
    return document.getElementById(id);
}

function mostrarErro(idElemento, mensagem) {
    const elemento = getElement(idElemento);
    if (elemento) {
        elemento.textContent = mensagem;
    }
}

function mostrarMensagem(texto, tipo) {
    const mensagemDiv = getElement(GLOBAL_MESSAGE_ID);
    if (mensagemDiv) {
        mensagemDiv.innerHTML = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
    }
}

function limparErros() {
    const erros = document.querySelectorAll('.erro');
    erros.forEach(e => e.textContent = '');
}

function limparMensagem() {
    const mensagem = getElement(GLOBAL_MESSAGE_ID);
    if (mensagem) {
        mensagem.textContent = '';
        mensagem.className = 'mensagem'; 
    }
}

function limparCampos() {
    console.log("Iniciando limpeza dos campos do formulário...");
    FORM_FIELDS.forEach(id => {
        const input = getElement(id);
        if (input) input.value = "";
    });
    // Uso da chave centralizada
    localStorage.removeItem(LOCAL_STORAGE_ID_KEY); 
    limparErros();
    limparMensagem();
    console.log("Limpeza concluída.");
}

function popularDados(data) {
    if (!data) {
        console.error("Dados inválidos ou nulos para popular o formulário.");
        return;
    }

    FORM_FIELDS.forEach(campo => {
        const input = getElement(campo);
        if (input) input.value = data[campo] || "";
    });

    // Uso da chave centralizada
    if (data.id) {
        localStorage.setItem(LOCAL_STORAGE_ID_KEY, data.id);
    }
}


/**
 * =================================================================
 * FUNÇÕES DE VALIDAÇÃO E COLETA DE DADOS
 * =================================================================
 */

function coletarDados() {
    const dados = {};
    FORM_FIELDS.forEach(campo => {
        const input = getElement(campo);
        // Garante que o ID do recurso seja incluído se estiver no localStorage
        if (campo === 'id') return; // Evita pegar "id" de um campo não existente
        dados[campo] = input ? input.value.trim() : '';
    });
    return dados;
}

function validarFormulario() {
    let ok = true;
    const dados = coletarDados();

    // Validação genérica (necessita que os campos de erro sigam o padrão 'erro-' + campo)
    FORM_FIELDS.forEach(campo => {
        if (!dados[campo]) {
            mostrarErro(`erro-${campo}`, `O ${campo} é obrigatório.`);
            ok = false;
        }
    });

    return ok;
}


/**
 * =================================================================
 * FUNÇÃO CENTRAL DE API
 * =================================================================
 */

function executarAcao(endpointConfig, dados = {}) {
    limparErros();
    limparMensagem();
    
    // Constrói a URL usando as configurações centralizadas
    const url = `${API_BASE_URL}${endpointConfig.path}`;
    const { method, successMsg } = endpointConfig;

    const headers = new Headers({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    });
   
    try {
        const response = fetch(url, {
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            headers: headers,
            body: Object.keys(dados).length > 0 ? JSON.stringify(dados) : undefined 
        });

        let data = {};
        try {
            // 1. Verifica se há cabeçalho Content-Type e Content-Length
            const contentType = response.headers.get("content-type");
            const contentLength = response.headers.get("content-length");
            
            // 2. Se a resposta for 204 (No Content) ou o corpo for vazio, não tente JSON.
            if (response.status === 204 || (contentLength && parseInt(contentLength) === 0) || !contentType || !contentType.includes("application/json")) {
                data = { message: "Ação concluída com sucesso (sem conteúdo de retorno)." };
            } else {
                // Se houver JSON esperado, tente consumir
                data = response.json();
                console.log("Imprimir a data");
                console.log('--------------------------------------');
                console.log(data);
                console.log('--------------------------------------');
            }
        } catch (e) {
            // Captura erros de parsing JSON (SyntaxError)
            console.error("Erro ao analisar resposta JSON:", e);
            data = { message: "Resposta do servidor não pôde ser lida ou é inválida." };
        }

        if (!response.ok) {
            console.error(`Erro ${response.status} na API:`, data);

            if (typeof data === "object" && data !== null && Object.keys(data).length > 0) {
                
                let erroGlobalEncontrado = false;
                
                for (const [campo, mensagem] of Object.entries(data)) {
                    const idElementoErro = "erro-" + campo; 

                    if (getElement(idElementoErro)) {
                        mostrarErro(idElementoErro, mensagem);
                    } else {
                        mostrarMensagem(`⚠️ ${mensagem}`, "erro");
                        erroGlobalEncontrado = true;
                    }
                }
                
                if (!erroGlobalEncontrado) {
                   mostrarMensagem(MESSAGES.VALIDATION_ERROR, "erro");
                }

            } else {
                const msg = data.message || `Erro do servidor: ${response.statusText || response.status}.`;
                mostrarMensagem(`⚠️ ${msg}`, "erro");
            }
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        // --- TRATAMENTO DE SUCESSO ---
        if (data.id) {
            // Uso da chave centralizada
            console.log("Uso da chave centralizada");
            localStorage.setItem(LOCAL_STORAGE_ID_KEY, data.id); 
        }
        
        // Exibe a mensagem de sucesso (usa a mensagem do backend se existir)
        mostrarMensagem(data.message || `✅ ${successMsg}`, "sucesso");
        
        return data; 
        
    } catch (error) {
        console.error("Falha na comunicação ou processamento:", error);
        // Garante que uma mensagem de erro genérica seja exibida se o erro não for tratado acima
        if (!getElement(GLOBAL_MESSAGE_ID).textContent) {
            mostrarMensagem(MESSAGES.CONNECTION_FAILURE, "erro");
        }
        return null; 
    }
}


/**
 * =================================================================
 * FUNÇÕES DE AÇÃO PRINCIPAIS
 * =================================================================
 */

function salvar() {
    if (!validarFormulario()) {
        mostrarMensagem(MESSAGES.REQUIRED_FIELDS, "erro");
        return;
    }

    const dados = coletarDados();

    const resultado = executarAcao(ENDPOINTS.SALVAR, dados);
    
    if (resultado) {
       limparCampos();
    }
}

async function consultar() {
    const dados = coletarDados();
    
    // Uso da chave centralizada
    const idSalvo = localStorage.getItem(LOCAL_STORAGE_ID_KEY); 
    if (idSalvo) {
        dados.id = idSalvo;
    }

    const resultado = await executarAcao(ENDPOINTS.CONSULTAR, dados);

    if (resultado) {
        popularDados(resultado);
    }
}

async function alterar() {
    if (!validarFormulario()) {
        mostrarMensagem(MESSAGES.REQUIRED_FIELDS, "erro");
        return;
    }
    
    // Uso da chave centralizada
    const idSalvo = localStorage.getItem(LOCAL_STORAGE_ID_KEY); 
    if (!idSalvo) {
        mostrarMensagem(MESSAGES.MISSING_ID, "erro");
        return;
    }
    
    const dados = coletarDados();
    dados.id = idSalvo; 
    
    await executarAcao(ENDPOINTS.ALTERAR, dados);
} 

async function deletar() {
    // Uso da chave centralizada
    const idSalvo = localStorage.getItem(LOCAL_STORAGE_ID_KEY); 
    if (!idSalvo) {
        mostrarMensagem(MESSAGES.MISSING_ID, "erro");
        return;
    }
    
    // Envia o ID para deleção
    const dados = { id: idSalvo }; 
    
    const resultado = await executarAcao(ENDPOINTS.DELETAR, dados);
    
    if (resultado) {
       limparCampos();
    }
}