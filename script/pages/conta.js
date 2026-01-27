// 1. DICIONÁRIO DE INTERFACE ESTÁTICA (Textos que não são Web Components)
const dicionarioLogin = {

    pt: {
        lbl_titulo              : "Conta",
        lbl_mostrar_senha       : "Mostrar Senha",
        lbl_voltarBtn           : "Voltar",
        lbl_cadastrarBtn        : "Salvar"        
    },
    
    es: {
        lbl_titulo              : "Cuenta",
        lbl_mostrar_senha       : "Mostrar contraseña",
        lbl_voltarBtn           : "Para volver atrás",
        lbl_cadastrarBtn        : "Ahorrar"
    }
};

// 2. FUNÇÕES DE TRADUÇÃO
function traduzirInterfaceEstatica(lang) {
    const elementos = document.querySelectorAll('[data-translate]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-translate');
        
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