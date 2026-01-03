export function bloquearButton(btnId, textoButton) {
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.innerText = textoButton;
}

export function desbloquearButton(btnId, textoButton) {
    const btn = document.getElementById(btnId);
    btn.disabled = false;
    btn.innerText = textoButton;
}

export function limparFormulario(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    document.getElementById(formulario).reset();
}


export function coletarDadosForm(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const formData = new FormData(formulario);
    
    // Converte o FormData em um objeto simples { nome: '...', email: '...' }
    return Object.fromEntries(formData.entries());
}

export function aplicarMascaraTelefone(valor) {
    if (!valor) return "";
    valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses no DDD
    
    // Lógica dinâmica para o hífen:
    if (valor.length > 13) {
        // Celular: (00) 00000-0000 (14 ou 15 caracteres com máscara)
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    } else {
        // Fixo: (00) 0000-0000
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }
    
    return valor.substring(0, 15); // Limita ao tamanho máximo de celular
}

// Função que "ataca" o DOM
export function configurarMascaraTelefone(id) {
    const campo = document.getElementById(id);
    if (campo) {
        campo.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraTelefone(e.target.value);
        });
    }
}

// // Evento para formatar enquanto o usuário digita
// document.getElementById('telefone').addEventListener('input', (e) => {
//     e.target.value = aplicarMascaraTelefone(e.target.value);
// });