import { sharedStyles } from './SharedStyles.js';

export class BaseInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });       
        this.shadowRoot.adoptedStyleSheets = [sharedStyles];
    }

    BaseInput() {        
        this.inicializarTooltips();
    }
   
    async inicializarTooltips() {        
        this.shadowRoot.querySelectorAll('.info-question').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                const mensagem = icon.getAttribute('data-tooltip');
                const container = this.shadowRoot.querySelector('.input-group');

                // Cria o tooltip se não existir
                let tooltip = container.querySelector('.tooltip-container');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'tooltip-container';
                    tooltip.innerText = mensagem;
                    container.appendChild(tooltip);
                }

                // Exibe com um pequeno frame de atraso para a animação
                requestAnimationFrame(() => tooltip.classList.add('visible'));
            });

            icon.addEventListener('mouseleave', () => {
                // Em vez de usar closest, buscamos direto no shadowRoot do componente
                const container = this.shadowRoot.querySelector('.input-group');
                const tooltip = container ? container.querySelector('.tooltip-container') : null;
                
                if (tooltip) {
                    tooltip.classList.remove('visible');
                    setTimeout(() => {
                        // Verifica se o tooltip ainda existe antes de remover
                        if (tooltip.parentNode) tooltip.remove();
                    }, 300);
                }
            });
              
        });
    }

}
customElements.define('base-input', BaseInput);