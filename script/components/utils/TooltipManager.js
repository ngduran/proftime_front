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
        // Seleciona qualquer ícone que tenha o atributo de tooltip
        const mensagem = icon.getAttribute('data-tooltip');
        
        // Alteração: Usa o pai imediato ou o container relativo mais próximo
        // para ser independente de nomes de classe como .field_col
        const container = icon.parentElement; 
        container.style.position = 'relative'; // Garante que o absoluto funcione

        // Busca qualquer elemento de entrada vinculado no mesmo container
        const input = container.querySelector('input, select, textarea');
        if (!input) return;

        // Criação do Tooltip (Reutilizável)
        let tip = container.querySelector('.tooltip-container');
        if (!tip) {
            tip = document.createElement('div');
            tip.className = 'tooltip-container';
            container.appendChild(tip);
        }
        tip.innerText = mensagem;

        // Medições
        const rectInput = input.getBoundingClientRect();
        const rectTip = tip.getBoundingClientRect();
        
        // Cálculo de alinhamento vertical centralizado
        const meioAlturaInput = rectInput.height / 2;
        const meioAlturaTip = rectTip.height / 2;
        const deslocamentoY = meioAlturaInput - meioAlturaTip;

        // Aplica alinhamento vertical
        tip.style.bottom = `${deslocamentoY}px`;

        // Lógica de Posicionamento Horizontal Genérica
        // Usamos a viewport como referência caso não haja um field-container
        const bodyWidth = document.body.clientWidth;
        const inputCentroX = rectInput.left + (rectInput.width / 2);

        // Reseta classes e estilos
        tip.classList.remove('tooltip-left', 'tooltip-right');
        tip.style.left = "auto";
        tip.style.right = "auto";

        // Se o centro do input está na metade esquerda da tela, 
        // posiciona o tooltip à direita do campo
        if (inputCentroX < bodyWidth / 2) {
            tip.classList.add('tooltip-right');
            // Alinha o início do balão com o fim do ícone ou uma margem fixa
            tip.style.left = `${icon.offsetLeft + icon.offsetWidth + 5}px`;
        } else {
            // Posiciona o tooltip à esquerda do campo
            tip.classList.add('tooltip-left');
            // Alinha o fim do balão antes do ícone
            tip.style.right = `${container.offsetWidth - icon.offsetLeft + 5}px`;
        }

        requestAnimationFrame(() => tip.classList.add('visible'));
    
    },

    hide(icon, shadowRoot) {        
        const container = icon.parentElement;
        const tip = container.querySelector('.tooltip-container');
        if (tip) {
            tip.classList.remove('visible');
            // Opcional: remover do DOM ou apenas esconder
            setTimeout(() => tip.remove(), 300);
        }
        
    }

};