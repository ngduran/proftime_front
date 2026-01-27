// import { changeLanguage } from "../components/utils/i18n/login_i18n.js";

const formLogin = document.getElementById('loginForm');

// document.addEventListener('DOMContentLoaded', () => {       
    
//     document.getElementById('btn-pt').addEventListener('click', () => {
//         //console.log("%c --- CLIQUE NO BOTÃO ESPANHOL ---", "background: #ff0000; color: #fff; font-weight: bold;");
    
//         // RASTREIO: Antes de traduzir, vamos ver se o componente de email está acessível
//         //const emailField = document.querySelector('email-field');
//         //console.log("Componente encontrado no DOM:", emailField);
//         //console.log("Existe ShadowRoot nele?", emailField ? !!emailField.shadowRoot : "Não");
//         changeLanguage('pt');
//     });
    
//     document.getElementById('btn-es').addEventListener('click', () => {
//         console.log("%c --- CLIQUE NO BOTÃO ESPANHOL ---", "background: #ff0000; color: #fff; font-weight: bold;");
    
//         // RASTREIO: Antes de traduzir, vamos ver se o componente de email está acessível
//         const emailField = document.querySelector('email-field');
//         console.log("Componente encontrado no DOM:", emailField);
//         console.log("Existe ShadowRoot nele?", emailField ? !!emailField.shadowRoot : "Não");

//        changeLanguage('es')        
//     });
    


// });

document.addEventListener('DOMContentLoaded', () => {

    // 1. GARANTIR IDIOMA PADRÃO NO STORAGE
    // Se não houver nada definido, ele seta 'pt' automaticamente
    if (!sessionStorage.getItem('official_language')) {
        sessionStorage.setItem('official_language', 'pt');
        
        console.log(
            "%c[INIT] %c'official_language' inicializado como: %c PT ",
            "color: #007bff; font-weight: bold;", 
            "color: #333;",
            "background: #28a745; color: #fff; font-weight: bold; border-radius: 3px;"
        );
    }

    
    // Função interna simples para substituir a externa que foi removida
    const trocarIdiomaSistema = (lang) => {
        // 1. Salva para persistência (O Base_Field lê daqui no translate)
        sessionStorage.setItem('official_language', lang);

        // --- LOG DE VERIFICAÇÃO DE STORAGE ---
        console.log(
            `%c[CHECKPOINT-STORAGE] %cValor enviado: %c${lang} %c| No Storage: %c${sessionStorage.getItem('official_language')}`,
            "color: #000; font-weight: bold;", 
            "color: #666;", 
            "background: #fffbe6; color: #856404; font-weight: bold; border: 1px solid #ffe58f;", // Destaque Amarelo
            "color: #666;",
            "color: #28a745; font-weight: bold;"
        );

        // 2. Dispara o evento para os Web Components reagirem
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        // Log de rastreio com as cores que você consegue ver bem
        const cor = lang === 'pt' ? '#28a745' : '#dc3545';
        console.log(
            `%c[SISTEMA] %cIdioma definido como: %c ${lang.toUpperCase()} `,
            "color: #333; font-weight: bold;",
            "color: #666;",
            `background: ${cor}; color: #fff; font-weight: bold; border-radius: 3px;`
        );
    };

    // Ouvintes dos botões
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));

});


const dicionarioLogin = {
    pt: {
        lbl_mostrar_senha       : "Mostrar Senha",
        lbl_btn_entrar          : "Entrar",
        lbl_link_esqueceu_senha : "Esqueceu a senha?",
        lbl_btn_criar_conta     : "Criar Conta",
        lbl_link_reenviar_email : "Reenviar email"
    },
    es: {
        lbl_mostrar_senha       : "Mostrar contraseña",
        lbl_btn_entrar          : "Para entrar",
        lbl_link_esqueceu_senha : "¿Olvidaste tu contraseña?",
        lbl_btn_criar_conta     : "Crear una cuenta",
        lbl_link_reenviar_email : "Reenviar correo electrónico"
    }
};

function traduzirInterfaceEstatica(lang) {
    const elementos = document.querySelectorAll('[data-translate]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-translate');
        // Verifica se a chave existe no dicionário para não apagar o texto por erro
        if (dicionarioLogin[lang] && dicionarioLogin[lang][chave]) {
            el.innerText = dicionarioLogin[lang][chave];
        }
    });
}

// Escuta o mesmo evento que os componentes já usam!
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail?.Language || e.detail?.language || e.detail;
    traduzirInterfaceEstatica(lang);
});

// Tradução inicial ao carregar
// document.addEventListener('DOMContentLoaded', () => {
//     const inicial = sessionStorage.getItem('official_language') || 'pt';
//     traduzirInterfaceEstatica(inicial);
// });