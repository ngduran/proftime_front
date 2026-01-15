import { tooltipCss } from '../css/TooltipStyles.js';

export const TooltipManager = {
    init(shadowRoot) {
        // Injeta o CSS do tooltip no array de estilos do componente
        if (!shadowRoot.adoptedStyleSheets.includes(tooltipCss)) {
            shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, tooltipCss];
        }

        shadowRoot.querySelectorAll('.info-question').forEach(icon => {
            icon.addEventListener('mouseenter', () => this.show(icon, shadowRoot));
            icon.addEventListener('mouseleave', () => this.hide(icon, shadowRoot));
        });
    },

    show(icon, shadowRoot) {
        const mensagem = icon.getAttribute('data-tooltip');
        const container = icon.closest('.label-container');
        if (!container || !mensagem) return;

        let tooltip = container.querySelector('.tooltip-container');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip-container';
            tooltip.innerText = mensagem;
            container.appendChild(tooltip);
        }

        requestAnimationFrame(() => tooltip.classList.add('visible'));
    },

    hide(icon, shadowRoot) {
        // const container = icon.closest('.label-container');
        // const tooltip = container?.querySelector('.tooltip-container');
        // if (tooltip) {
        //     tooltip.classList.remove('visible');
        //     setTimeout(() => tooltip.remove(), 300);
        // }
    }
};