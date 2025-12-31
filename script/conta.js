const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8080",
    RESOURCE: "/usuario"
};

const ENDPOINTS = {
    CREATE: { path: `${API_CONFIG.RESOURCE}/create`, method: 'POST'  },
    READ:   { path: `${API_CONFIG.RESOURCE}/read`,   method: 'POST'  },
    UPDATE: { path: `${API_CONFIG.RESOURCE}/update`, method: 'PUT'   },
    DELETE: { path: `${API_CONFIG.RESOURCE}/delete`, method: 'DELETE'}
};

function coletarDadosForm(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const formData = new FormData(formulario);
    
    // Converte o FormData em um objeto simples { nome: '...', email: '...' }
    return Object.fromEntries(formData.entries());
}

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
    
    await new Promise(resolve => setTimeout(resolve, 0));
}

async function executarAcao(endpoint, dados, id = null) {
    
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
async function salvarGenerico(formId, btnId, endpoint, sessionKey) {
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

// --- NOVAS FUNCIONALIDADES DE UI ---

// 1. Lógica para Mostrar/Esconder Senha
document.getElementById('mostrarSenha').addEventListener('change', function() {
    const tipo = this.checked ? 'text' : 'password';
    document.getElementById('senha').type = tipo;
    document.getElementById('confirmarSenha').type = tipo;
});

// // 2. Lógica para Tooltips (Ícones de Interrogação)
// // Adiciona um alerta simples ao clicar no ícone
// document.querySelectorAll('.info-question').forEach(icon => {
//     icon.addEventListener('click', function() {
//         const campo = this.previousElementSibling.placeholder;
//         alert(`Ajuda: O campo "${campo}" é necessário para a segurança e identificação da sua conta.`);
//     });
// });

document.querySelectorAll('.info-question').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        const mensagem = icon.getAttribute('data-tooltip');
        const container = icon.closest('.input-group');

        // Cria o tooltip se não existir
        let tooltip = container.querySelector('.tooltip-container');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip-container';
            tooltip.innerText = mensagem;
            container.appendChild(tooltip);
        }

        // Exibe com um pequeno frame de atraso para a animação
        requestAnimationFrame(() => tooltip.classList.add('visible'));
    });

    icon.addEventListener('mouseleave', () => {
        const container = icon.closest('.input-group');
        const tooltip = container.querySelector('.tooltip-container');
        if (tooltip) {
            tooltip.classList.remove('visible');
            // Remove do DOM após a transição para economizar memória
            setTimeout(() => tooltip.remove(), 300);
        }
    });
});

function validarFormulario(idFormulario) {
    const form = document.getElementById(idFormulario);
    const inputs = form.querySelectorAll("[required]");
    let todosValidos = true;

    // Limpa mensagens de erro anteriores
    form.querySelectorAll(".error-message").forEach(el => el.remove());

    inputs.forEach(input => {
        if (!input.value.trim()) {
            marcarErro(input, "Este campo é obrigatório.");
            todosValidos = false;
        } else {
            input.classList.remove("invalid");
        }
    });

    return todosValidos;
}

function marcarErro(input, mensagem) {
    // 1. Precisamos achar o container e definir a variável
    const container = input.closest(".input-group");
    
    input.classList.add("invalid");
    
    const spanErro = document.createElement("span");
    spanErro.className = "error-message";
    spanErro.innerText = mensagem;
    
    // 2. Agora o container existe e o appendChild vai funcionar
    container.appendChild(spanErro);

    input.addEventListener('input', () => {
        input.classList.remove("invalid");
        if(spanErro) spanErro.remove();
    }, { once: true });
}

// Função para aplicar a máscara de telefone (formato brasileiro)
function aplicarMascaraTelefone(valor) {
    if (!valor) return "";
    valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses
    valor = valor.replace(/(\d{5})(\d)/, "$1-$2"); // Coloca o hífen (celular 9 dígitos)
    return valor.substring(0, 15); // Limita o tamanho máximo
}

// Evento para formatar enquanto o usuário digita
document.getElementById('telefone').addEventListener('input', (e) => {
    e.target.value = aplicarMascaraTelefone(e.target.value);
});






async function salvar() {
    // Agora a validação é genérica para o formulário
    if (!validarFormulario("contaForm")) {
        return; // Para a execução aqui e mostra os erros na tela
    }

    // Se passar na validação, segue para o salvar que já testamos ontem
    await salvarGenerico("contaForm", "cadastrarBtn", ENDPOINTS.CREATE, "contaId");
}









// function salvar() {
//     salvarGenerico("contaForm", "cadastrarBtn", ENDPOINTS.CREATE, "contaId");
// }


// async function salvar() {

//     const ACAO_BOTAO = { nome: 'Salvar', acao: 'Salvando...'}

//     try {
        
//         const dados = coletarDadosForm("contaForm");
//         console.log(dados);
//         const btn = document.getElementById("cadastrarBtn");
//         btn.disabled = true;
//         btn.innerText = ACAO_BOTAO.acao;        
       
//         const resultado = await executarAcao(ENDPOINTS.CREATE, dados);        
      
//         if (resultado && resultado.id) {
//             sessionStorage.setItem('instituicaoId', resultado.id);
//             console.log("ID guardado na sessão:", resultado.id);
//         }        
        
//        alert("Operação realizada com sucesso!");
//        document.getElementById("instituicaoForm").reset();

//     } catch (error) {
//         alert(`Falha ao salvar: ${error.message}`);
//     } finally {
//         // Restaura o botão independente de sucesso ou erro
//         const btn = document.getElementById("cadastrarBtn");
//         btn.disabled = false;
//         btn.innerText = ACAO_BOTAO.nome;        
//     }
// }







































function voltarAoInicio() {
    window.location.href='../page/login.html'
}