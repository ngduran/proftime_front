// 1. DICIONÁRIO DE INTERFACE ESTÁTICA (Textos que não são Web Components)
const dicionarioLogin = {

    pt: {
        lbl_titulo              : "Login",
        lbl_mostrar_senha       : "Mostrar Senha",
        lbl_btn_entrar          : "Entrar",
        lbl_link_esqueceu_senha : "Esqueceu a senha?",
        lbl_btn_criar_conta     : "Criar Conta",
        lbl_link_reenviar_email : "Reenviar email"
    },
    
    es: {
        lbl_titulo              : "Acceso",
        lbl_mostrar_senha       : "Mostrar contraseña",
        lbl_btn_entrar          : "Para entrar",
        lbl_link_esqueceu_senha : "¿Olvidaste tu contraseña?",
        lbl_btn_criar_conta     : "Crear una cuenta",
        lbl_link_reenviar_email : "Reenviar correo electrónico"
    }
};

// 2. FUNÇÕES DE TRADUÇÃO
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

// 3. EVENTOS GLOBAIS
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail?.Language || e.detail?.language || e.detail;
    traduzirInterfaceEstatica(lang);
});

// 4. INICIALIZAÇÃO E CONTROLE DE UI
document.addEventListener('DOMContentLoaded', () => {

    // 1. GARANTIR IDIOMA PADRÃO NO STORAGE   
    if (!sessionStorage.getItem('official_language')) {
        sessionStorage.setItem('official_language', 'pt');
    }
    
    // 4.3 FUNÇÃO DE TROCA DE IDIOMA DO SISTEMA
    const trocarIdiomaSistema = (lang) => {
      
        sessionStorage.setItem('official_language', lang);

        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        
    };

    // 4.4 OUVINTES DOS BOTÕES DE BANDEIRA
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));

});