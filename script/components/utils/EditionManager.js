import { editionCss } from '../css/Edition_Styles.js';

export const EditionManager = {

    init(shadowRoot) {
        // 1. Injeta o CSS (apenas se não estiver presente)
        if (editionCss && !shadowRoot.adoptedStyleSheets.includes(editionCss)) {
            shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, editionCss];
        }

        // 2. DELEGAÇÃO DE EVENTO DE CLIQUE
        // Ouvimos no shadowRoot. Não importa se o botão foi renderizado agora ou depois pela API.
        shadowRoot.addEventListener('click', (e) => {
            // Verifica se o clique foi no botão ou em qualquer ícone dentro dele
            const btn = e.target.closest('.edit-button');
            if (btn) {
                this.handleEditAction(btn, shadowRoot);
            }
        });
    },

    handleEditAction(btn, shadowRoot) {
        // 1. Busca o input/select que está no mesmo container que o botão
        const container = btn.parentElement;
        const campo = container?.querySelector('input, select, textarea');

        if (!campo) return;

        console.log(`%c[EDITION] %cAtivando foco: ${campo.id || campo.name}`, "color: #007bff; font-weight: bold;", "color: #333;");

        // 2. Ação de interface: Foco no campo
        campo.focus();

        // 3. Dispara o evento customizado para o formulário pai (se necessário)
        campo.dispatchEvent(new CustomEvent('field-edit-click', {
            bubbles: true,
            composed: true,
            detail: { 
                id: campo.id,
                name: campo.name,
                value: campo.value 
            }
        }));
    }
};