import { editionCss } from '../css/Edition_Styles.js';

export const EditionManager = {

     init(shadowRoot) {
        
        // Injeta o CSS do tooltip no array de estilos do componente
        if (!shadowRoot.adoptedStyleSheets.includes(editionCss)) {
            shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, editionCss];
        }

        this.show(shadowRoot);
    },

    show(shadowRoot) {        
       
       // 1. Buscamos o input primeiro
        const campo = shadowRoot.querySelector('input, select');       

        if (!campo) return;

        // 2. O container é o pai do input (a div que você criou no renderControl)
        const container = campo.parentElement;      

        if (container) {
            // Garante que o container aceite posicionamento absoluto do botão
            container.style.position = 'relative';
        
            // 3. Busca o botão que já veio no seu HTML do renderControl
            const btn = container.querySelector('.edit-button');

            if (btn) {
                // Remove listeners antigos para não duplicar se o componente re-renderizar
                const novoBtn = btn.cloneNode(true);
                btn.replaceWith(novoBtn);

                // 4. Adiciona o evento de clique
                novoBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Editando campo: ${campo.id}`);
                    campo.focus();
                    
                    // Exemplo: disparar um evento customizado para o formulário pai
                    campo.dispatchEvent(new CustomEvent('field-edit-click', {
                        bubbles: true,
                        composed: true,
                        detail: { id: campo.id }
                    }));
                });
            }
        }


    },

    onEditClick(campo) {
        console.log(`[EditionManager] Editando campo: ${campo.id || campo.name}`);
        // Aqui você pode disparar CustomEvents se quiser que o formulário reaja
        campo.focus();
    }

};