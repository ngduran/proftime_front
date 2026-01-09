import { marcarErro, marcarSucesso } from "./dom-utils.js";

export function validarNome() {
    const nome = document.getElementById('nome');
    nome.value = nome.value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
    // Regex: ^[A-Za-zÀ-ÿ ]+$
    // Aceita letras maiúsculas, minúsculas, acentos e espaços.
    const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;

    if (!regexNome.test(nome.value.trim())) {
        marcarErro(nome, "O nome deve conter apenas letras.");
        return false;
    }

    if (nome.value.trim().length < 3) {
        marcarErro(nome, "O nome deve ter pelo menos 3 letras.");
        return false;
    }

    marcarSucesso(nome);
    return true;
}

export function validarUsuario() {    
    const usuario = document.getElementById('usuario');
    // Regex: Apenas letras minúsculas e números, sem espaços, 3 a 20 caracteres
    const regexUsuario = /^[a-z][a-z0-9_]{2,19}$/;

    if (!regexUsuario.test(usuario.value)) {
        marcarErro(usuario, "Verifique as normas na ajuda ao lado");
        return false;
    }

    marcarSucesso(usuario);
    return true;
}

export function validarEmail() {    
    const email = document.getElementById('email');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email.value)) {
        marcarErro(email, "Por favor, insira um e-mail válido.");
        return false;
    }
  
    marcarSucesso(email);

    return true;
}

export function validarSenhasIguais() {    
    const inputSenha = document.getElementById('senha');
    const inputConfirmarSenha = document.getElementById('confirmarSenha');

    // 1. Se estiver vazio, não marca sucesso nem erro (deixa para o validarFormulario)
    if (inputSenha.value === "" || inputConfirmarSenha.value === "") {        
        return false; 
    }
    
    // 2. Se forem diferentes
    if (inputSenha.value !== inputConfirmarSenha.value) {                      
        marcarErro(inputConfirmarSenha, "As senhas não conferem.");
        return false;
    }
   
    marcarSucesso(inputConfirmarSenha);

    return true;
}

export function validarForcaSenha() {
    const inputSenha = document.getElementById('senha');
    
    // Regex completa: Maiúscula, Minúscula, Número, Símbolo e 8+ caracteres
    const regexComplexidade = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

    if (!regexComplexidade.test(inputSenha.value)) {        
        marcarErro(inputSenha, "A senha deve conter: Maiúscula, Minúscula, Número e Símbolo.");
        return false;
    }
    
    marcarSucesso(inputSenha);
    return true;
}

export function validarFormulario(idFormulario) {
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

export function validarTelefone() {
    const telefone = document.getElementById('telefone');
    const valor = telefone.value.trim();

    // (00) 0000-0000 -> 14 caracteres
    // (00) 00000-0000 -> 15 caracteres
    if (valor.length > 0 && valor.length < 14) {
        marcarErro(telefone, "Telefone incompleto.");
        return false;
    }

    marcarSucesso(telefone);

    return true;
}

/**
 * Valida se um ComboBox (select) possui uma opção selecionada.
 * @param {string} id - O ID do elemento select.
 * @param {string} mensagemErro - A mensagem a ser exibida caso esteja vazio.
 * @returns {boolean} - True se for válido, False caso contrário.
 */
export function validarComboBox(id, mensagemErro) {
    const elemento = document.getElementById(id);
    
    if (!elemento) {
        console.error(`Elemento com ID "${id}" não encontrado.`);
        return false;
    }

    // Se o valor for vazio (primeira option), marca erro
    if (!elemento.value || elemento.value.trim() === "") {
        marcarErro(elemento, mensagemErro);
        return false;
    }

    marcarSucesso(elemento);
    return true;
}

/**
 * Valida se um número está dentro de um intervalo e exibe mensagem customizada.
 * @param {string} id - O ID do input.
 * @param {number} min - Valor mínimo.
 * @param {number} max - Valor máximo.
 * @param {string} mensagem - Mensagem personalizada de erro.
 * @returns {boolean}
 */
export function validarPosicaoAula(id, min, max, mensagem) {
    const input = document.getElementById(id);
    if (!input) return false;

    const valor = parseInt(input.value, 10);
    const limiteMin = parseInt(min, 10); // Garante que seja número
    const limiteMax = parseInt(max, 10); // Garante que seja número

    // 1. Verifica se o campo está vazio ou não é número
    if (isNaN(valor)) {
        marcarErro(input, "Informe um valor numérico.");
        return false;
    }

    // 2. Verifica se está fora do intervalo (agora com números reais)
    if (valor < limiteMin || valor > limiteMax) {
        marcarErro(input, mensagem);
        return false;
    }

    // 3. Sucesso
    marcarSucesso(input);
    return true;
}

/**
 * Valida campos HTML do tipo <input type="time">
 * @param {string} id - O ID do elemento no HTML
 * @param {string} mensagemErro - A mensagem a ser exibida em caso de falha
 * @returns {boolean}
 */
export function validarCampoTime(id, mensagemErro) {
    const elemento = document.getElementById(id);

    if (!elemento) {
        console.error(`Elemento com ID "${id}" não encontrado.`);
        return false;
    }

    const valor = elemento.value;

    // Campos do tipo time retornam string vazia "" se não preenchidos
    // Validamos também o "00:00" caso não seja um horário permitido no seu contexto
    if (!valor || valor.trim() === "" || valor === "00:00") {
        marcarErro(elemento, mensagemErro);
        return false;
    }

    marcarSucesso(elemento);
    return true;
}