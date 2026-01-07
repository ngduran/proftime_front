export function marcarSucesso(input) {
    // 1. Verificação de segurança: Se não for um elemento, sai sem dar erro
    if (!input || !(input instanceof HTMLElement)) return;

    const container = input.closest('.input-group');

    // 2. Limpeza total: remove o 'invalid' e adiciona o 'valid'
    input.classList.remove("invalid");
    input.classList.add("valid");

    // 3. Limpeza do container (mensagens de erro)
    if (container) {
        container.classList.remove('has-error');
        const msgErro = container.querySelector('.error-message');
        if (msgErro) msgErro.remove();
    }
}

export function marcarErro(input, mensagem) {
    
    if (!input || !(input instanceof HTMLElement)) return;

    const container = input.closest('.input-group');

    // 1. Troca as classes de sucesso por erro
    input.classList.remove("valid");
    input.classList.add("invalid");

    // 2. Gerencia a mensagem de erro
    if (container) {
        container.classList.add('has-error');
        
        let msgErro = container.querySelector('.error-message');
        if (!msgErro) {
            msgErro = document.createElement('span');
            msgErro.className = 'error-message';
            container.appendChild(msgErro);
        }
        msgErro.innerText = mensagem;
    }
}

export async function popularFormulario(idFormulario, dados) {
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

export async function inicializarTooltips() {
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
}

// export async function configurarMostrarSenha() {
//     document.getElementById('mostrarSenha').addEventListener('change', function() {
//         const tipo = this.checked ? 'text' : 'password';
//         document.getElementById('senha').type = tipo;
//         document.getElementById('confirmarSenha').type = tipo;
//     });
// }

/**
 * Configura a lógica de mostrar/esconder senha para qualquer formulário.
 * @param {string} idCheckbox - O ID do checkbox (ex: 'mostrarSenha')
 * @param {string[]} idsInputs - Array com os IDs dos inputs de senha
 */
export function configurarMostrarSenha(idCheckbox, idsInputs) {
    const checkbox = document.getElementById(idCheckbox);
    
    // Safety check: só executa se o checkbox existir na página atual
    if (!checkbox) return;

    checkbox.addEventListener('change', function() {
        const tipo = this.checked ? 'text' : 'password';
        
        idsInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.type = tipo;
            }
        });
    });
}