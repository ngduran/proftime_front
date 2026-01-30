const dicionarioHorario = {

    pt: {
        lbl_titulo       : "Horário",
        lbl_cadastrarBtn : "Salvar",
        lbl_voltarBtn    : "Voltar",
    },
    
    es: {
        lbl_titulo       : "Tiempo",
        lbl_cadastrarBtn : "Ahorrar",
        lbl_voltarBtn    : "Para volver atrás",
    }
};

// 2. FUNÇÕES DE TRADUÇÃO
function traduzirInterfaceEstatica(lang) {
    const elementos = document.querySelectorAll('[data-translate]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-translate');
        // Verifica se a chave existe no dicionário para não apagar o texto por erro
        if (dicionarioHorario[lang] && dicionarioHorario[lang][chave]) {
            el.innerText = dicionarioHorario[lang][chave];
        }
    });
}

// 3. EVENTOS GLOBAIS
// Escuta o evento global para traduzir o que for estático na página
// Escuta o mesmo evento que os componentes já usam!
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail?.Language || e.detail?.language || e.detail;
    traduzirInterfaceEstatica(lang);
});

// 4. INICIALIZAÇÃO E CONTROLE DE UI
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

    
    // 4.3 FUNÇÃO DE TROCA DE IDIOMA DO SISTEMA
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

    // 4.4 OUVINTES DOS BOTÕES DE BANDEIRA
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));

});