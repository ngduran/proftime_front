// Recupera o idioma salvo ou define o padrão
let currentLang = sessionStorage.getItem('lang') || 'pt';

export const translations = {
    pt: {
        lbl_titulo: "Login",
        lbl_email: "Email",
        lbl_senha: "Senha",
        lbl_mostrar_senha: "Mostrar Senha",
        btn_entrar: "Entrar",
        btn_criar_conta: "Criar Conta",
        link_esqueceu_senha: "Esqueceu a senha?",
        link_reenviar_email: "Reenviar email",
        ph_email: "seu_melhor_email@mail.com",
        ph_senha: "Digite sua senha",
        tp_lbl_email: "Email utilizado para acessar o aplicativo",
        tp_lbl_senha: "Senha utilizada para acessar o aplicativo. Mínimo de 8 caracteres, com letra maiúscula, minúscula, número e caractere especial (!@#$).",
        err_email_invalido: "Por favor, insira um e-mail válido.",
        err_senha_fraca: "A senha deve conter: Maiúscula, Minúscula, Número, Símbolo e 8+ caracteres."
    },
    es: {
        lbl_titulo: "Iniciar Sesión",
        lbl_email: "Correo electrónico",
        lbl_senha: "Contraseña",
        lbl_mostrar_senha: "Mostrar contraseña",
        btn_entrar: "Para entrar",
        btn_criar_conta: "Crear cuenta",
        link_esqueceu_senha: "¿Olvidaste tu contraseña?",
        link_reenviar_email: "Reenviar correo electrónico",
        ph_email: "tu_mejor_correo@mail.com",
        ph_senha: "Introduce tu contraseña",
        tp_lbl_email: "Correo electrónico utilizado para acceder a la aplicación",
        tp_lbl_senha: "Contraseña utilizada para acceder a la aplicación. Mínimo 8 caracteres, con mayúsculas, minúsculas, números y caracteres especiales.",
        err_email_invalido: "Por favor, introduce un correo electrónico válido.",
        err_senha_fraca: "La contraseña debe contener: Mayúsculas, Minúsculas, Números, Símbolos y más de 8 caracteres."
    }
};

/**
 * Altera o idioma global, salva e avisa os componentes.
 */
export function changeLanguage(newLang) {
   
    currentLang = newLang;
    sessionStorage.setItem('lang', newLang); 
    
    // Traduz o Light DOM (o que não é Web Component)
    applyTranslations(document);

    
    // Dispara o evento para os Shadow DOMs se auto-atualizarem
    const event = new CustomEvent('languageChanged', { 
        detail: { lang: newLang },
        bubbles: true, 
        composed: true 
    });
    //console.log(`%c [Transmissor] Disparando evento languageChanged para: ${newLang}`, "color: blue; font-weight: bold;");
    window.dispatchEvent(event);
    
}

/**
 * Aplica as traduções em um determinado escopo (document ou shadowRoot).
 */
export function applyTranslations(root = document) {   

    const tradutor = translations[currentLang];
    if (!tradutor) return;

    // 1. RASTREIO: Qual idioma a função acha que deve usar agora?
    //console.log(`%c >>> [applyTranslations] Idioma Ativo: ${currentLang}`, 'background: #000; color: #fff; padding: 2px 5px;');

    // 1. RASTREIO DE ALVO: Quem é a raiz da busca?
    //const alvoBusca = root === document ? "Documento (Lado de fora)" : (root instanceof ShadowRoot ? "ShadowRoot (Lado de dentro)" : root.tagName);
    
    // 2. RASTREIO DE QUANTIDADE: Quantos elementos com data-translate existem aqui?
    const elements = root.querySelectorAll('[data-translate]');
    
    //console.log(`%c [Passo 5] Executando em: ${alvoBusca} | Elementos encontrados: ${elements.length}`, "color: #e67e22; font-weight: bold;");

    elements.forEach((el, index) => {
        const key = el.getAttribute('data-translate');
        console.log(`   -> Alvo ${index + 1}: <${el.tagName.toLowerCase()}> | Chave: ${key}`);
        
        // const texto = tradutor[key];
        // if (texto) {
        //     if (el.tagName === 'INPUT') el.placeholder = texto;
        //     else el.textContent = texto;
        // }


        // Dentro do loop elements.forEach em applyTranslations
        const texto = tradutor[key];
        if (texto) {
            if (el.tagName === 'INPUT') {
                el.placeholder = texto;
            } else if (el.hasAttribute('data-tooltip')) {
                // CORREÇÃO: Traduz o atributo de dica em vez de inserir texto no HTML
                el.setAttribute('data-tooltip', texto);

                el.textContent = ''; // Garante que o ícone fique vazio por dentro
                
                // Se você usa o TooltipManager, talvez precise reinicializá-lo
                //TooltipManager.update(el, texto); 
            } else {
                el.textContent = texto;
            }
        }




    });    

    // const elements = root.querySelectorAll('[data-translate]');

    // console.log("==========================================================");
    // console.log(elements);
    // console.log("==========================================================");

    // elements.forEach(el => {
    //     const key = el.getAttribute('data-translate');
    //     const texto = tradutor[key];
        
    //     console.log("---------------------------------------------------------");
    //     console.log("key ----> " + key);
    //     console.log("texto --> " + texto);
    //     console.log("---------------------------------------------------------");

    //     if (texto) {
    //         // Lógica específica por tipo de elemento
    //         if (el.classList.contains('info-question')) {
    //             el.setAttribute('data-tooltip', texto);
    //         } else if (['INPUT', 'TEXTAREA'].includes(el.tagName)) {
    //             el.placeholder = texto;
    //         } else if (el.tagName !== 'SELECT') {
    //             el.textContent = texto;
    //         }
    //     }
    // });
}

/**
 * Função utilitária para buscar uma tradução específica via código.
 */
export function getTranslation(key) {
    return translations[currentLang][key] || key;
}