import { marcarErro, marcarSucesso } from "../ui/dom-utils.js";

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
        console.log("Uma das senhas vazias")
        return false; 
    }
    
    // 2. Se forem diferentes
    if (inputSenha.value !== inputConfirmarSenha.value) {
        console.log("Senhas diferentes");              
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
    console.log("vai adicionar sucesso no campo senha");   
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