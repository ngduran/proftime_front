import { tooltipCss } from '../css/TooltipStyles.js';

export const TooltipManager = {

    init(shadowRoot) {
        // 1. Injeta o CSS (apenas se não existir)
        if (tooltipCss && !shadowRoot.adoptedStyleSheets.includes(tooltipCss)) {
            shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, tooltipCss];
        }

        // 2. DELEGAÇÃO DE EVENTOS
        // Ouvimos no shadowRoot. Os eventos mouseover/mouseout borbulham.
        shadowRoot.addEventListener('mouseover', (e) => {
            const icon = e.target.closest('.info-question');
            if (icon) {
                this.show(icon, shadowRoot);
            }
        });

        shadowRoot.addEventListener('mouseout', (e) => {
            const icon = e.target.closest('.info-question');
            if (icon) {
                this.hide(icon, shadowRoot);
            }
        });
    },

    show(icon, shadowRoot) {
        const mensagem = icon.getAttribute('data-tooltip');
        const containerCampo = icon.parentElement; 
        if (!mensagem || !containerCampo) return;

        // 1. Busca o elemento de entrada para referência de altura
        const input = containerCampo.querySelector('.field-input, .field-select, .field-time, input, select');
        if (!input) return;

        // 2. Coleta dados geométricos do host (Base_Field)
        const info = shadowRoot.host.getContainerInfo();
        if (info.erro) return;

        // 3. Criação/Recuperação do Tooltip
        let tip = containerCampo.querySelector('.tooltip-container');
        if (!tip) {
            tip = document.createElement('div');
            tip.className = 'tooltip-container';
            containerCampo.appendChild(tip);
        }
        tip.innerText = mensagem;

        // 4. CÁLCULO DE POSICIONAMENTO
        // Meio do container - Início relativo do campo - Metade do balão
        const centroContainer = info.dimensoesContainer.centroX;
        const deslocamentoRelativoX = info.posicaoHorizontal.inicio;
        const metadeTooltip = tip.offsetWidth / 2;
        
        const xFinal = centroContainer - deslocamentoRelativoX - metadeTooltip;
        
        // Alinhado ao centro vertical do input
        const yFinal = input.offsetTop + (input.offsetHeight / 2) - (tip.offsetHeight / 2);

        // 5. Aplicação de Estilos
        Object.assign(tip.style, {
            left: `${xFinal}px`,
            top: `${yFinal}px`,
            right: 'auto'
        });

        tip.classList.remove('tooltip-left', 'tooltip-right');
        
        // Pequeno delay para garantir que a transição CSS ocorra
        requestAnimationFrame(() => tip.classList.add('visible'));
    },

    hide(icon, shadowRoot) {         
        const tip = icon.parentElement?.querySelector('.tooltip-container');
        if (tip) {
            tip.classList.remove('visible');
            // Remove do DOM após a animação de fade-out (300ms definido no seu CSS)
            setTimeout(() => {
                if (!tip.classList.contains('visible')) tip.remove();
            }, 300);
        }
    }
};