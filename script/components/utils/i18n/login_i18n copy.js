//let currentLanguage = 'pt';

let currentLang = sessionStorage.getItem('lang') || 'pt';

export const translations = {
    pt: {
        // Títulos e Labels
        lbl_titulo: "Login",
        lbl_email: "Email",
        lbl_senha: "Senha",
        lbl_mostrar_senha: "Mostrar Senha",

        // Botões e Links
        btn_entrar: "Entrar",
        btn_criar_conta: "Criar Conta",
        link_esqueceu_senha: "Esqueceu a senha?",
        link_reenviar_email: "Reenviar email",

        // Placeholders
        ph_email: "seu_melhor_email@mail.com",
        ph_senha: "Digite sua senha",

        // Tooltips (Ícones de interrogação)
        tp_lbl_email: "Email utilizado para acessar o aplicativo",
        tp_lbl_senha: "Senha utilizada para acessar o aplicativo. Mínimo de 8 caracteres, com letra maiúscula, minúscula, número e caractere especial (!@#$).",

        // Validações e Erros (Opcional, mas útil)
        err_email_invalido: "Por favor, insira um e-mail válido.",
        err_senha_fraca: "A senha deve conter: Maiúscula, Minúscula, Número, Símbolo e 8+ caracteres."
    },
    es: {
        // Títulos e Labels
        lbl_titulo: "Iniciar Sesión",
        lbl_email: "Correo electrónico",
        lbl_senha: "Contraseña",
        lbl_mostrar_senha: "Mostrar contraseña",

        // Botões e Links
        btn_entrar: "Entrar",
        btn_criar_conta: "Crear cuenta",
        link_esqueceu_senha: "¿Olvidaste tu contraseña?",
        link_reenviar_email: "Reenviar correo electrónico",

        // Placeholders
        ph_email: "tu_mejor_correo@mail.com",
        ph_senha: "Introduce tu contraseña",

        // Tooltips
        tp_lbl_email: "Correo electrónico utilizado para acceder a la aplicación",
        tp_lbl_senha: "Contraseña utilizada para acceder a la aplicación. Mínimo 8 caracteres, con mayúsculas, minúsculas, números y caracteres especiales.",

        err_email_invalido: "Por favor, introduce un correo electrónico válido.",
        err_senha_fraca: "La contraseña debe contener: Mayúsculas, Minúsculas, Números, Símbolos y más de 8 caracteres."
    }
};

export function changeLanguage(newLang) {    
    currentLang = newLang; // Atualiza sua variável global de idioma
    
    // 1. Traduz o que está fora do Shadow DOM (Light DOM)
    applyTranslations(); 

    // 2. Dispara um evento global para os Web Components (Shadow DOM)
    const event = new CustomEvent('languageChanged', { 
        detail: { lang: newLang },
        bubbles: true, 
        composed: true // Permite que o evento atravesse as fronteiras do Shadow DOM
    });
    window.dispatchEvent(event);
}

// Inicialização automática ao carregar o script
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('pt'); 
});

export function getTranslation(key) {
    return translations[currentLang][key] || key;
}

export function setLanguage(lang) {
    currentLang = lang;
    sessionStorage.setItem('lang', lang);
    applyTranslations();
}



export function applyTranslations(root = document) {   
    const tradutor = translations[currentLang];
    if (!tradutor) return;

    // 1. Traduz elementos no root atual (seja Document ou ShadowRoot)
    const elements = root.querySelectorAll('[data-translate]');

    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        const textoTraduzido = tradutor[key];

        if (textoTraduzido) {
            if (el.classList.contains('info-question')) {
                el.setAttribute('data-tooltip', textoTraduzido);
            } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = textoTraduzido;
            } else if (el.tagName === 'SELECT') {
                // Apenas ignora o SELECT para não sobrescrever o texto do pai
                return; 
            } else {
                // Traduz Options, Labels, Botões, etc.
                el.textContent = textoTraduzido;
            }
        }
    });

    // 2. SE o root for o document, precisamos entrar nos Shadow DOMs dos campos
    if (root === document) {
        // Busca todos os seus Custom Elements (Web Components)
        const customFields = document.querySelectorAll('email-field, senha-field');
        customFields.forEach(field => {
            if (field.shadowRoot) {
                // Chamada recursiva para traduzir o interior do componente
                applyTranslations(field.shadowRoot);
            }
        });
    }

}