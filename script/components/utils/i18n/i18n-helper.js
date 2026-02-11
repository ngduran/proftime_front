/**
 * Traduz elementos que possuem o atributo [data-translate]
 * @param {string} lang - Idioma (pt, es, etc)
 * @param {Object} dicionario - O dicionário específico da tela atual
 */
export function traduzirInterfaceEstatica(lang, dicionario) {
    const elementos = document.querySelectorAll('[data-translate]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-translate');
        // Verifica se a chave existe no dicionário para não apagar o texto por erro
        if (dicionario[lang] && dicionario[lang][chave]) {
            el.innerText = dicionario[lang][chave];
        }
    });
}

/**
 * Inicializa os ouvintes de bandeiras e o idioma padrão
 * @param {Object} dicionario - Dicionário da tela para a tradução inicial
 */
export function inicializarI18n(dicionario) {
    // 1. Garante idioma padrão
    if (!sessionStorage.getItem('official_language')) {
        sessionStorage.setItem('official_language', 'pt');
    }

    const langAtual = sessionStorage.getItem('official_language');

    // 2. Ouvinte do evento global
    window.addEventListener('languageChanged', (e) => {
        const lang = e.detail?.language || e.detail;
        traduzirInterfaceEstatica(lang, dicionario);
    });

    // 3. Função de troca
    const trocarIdioma = (lang) => {
        sessionStorage.setItem('official_language', lang);
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    };

    // 4. Binds nos botões de bandeira (se existirem na tela)
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdioma('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdioma('es'));

    // 5. Tradução inicial imediata
    traduzirInterfaceEstatica(langAtual, dicionario);
}