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
        const containerCampo = icon.parentElement; 
        
        // 1. Busca o elemento de entrada e as informações de hierarquia
        const input = containerCampo.querySelector('input, select, textarea, .field-time');
        if (!input) return;

        // Acessa a função que criamos no Base_Field através da instância do componente
        // shadowRoot.host é o próprio Web Component (ex: <email-field>)
        const info = shadowRoot.host.getContainerInfo();
        if (info.erro) return;

        // 2. Criação/Recuperação do Tooltip
        let tip = containerCampo.querySelector('.tooltip-container');
        if (!tip) {
            tip = document.createElement('div');
            tip.className = 'tooltip-container';
            containerCampo.appendChild(tip);
        }
        tip.innerText = mensagem;

        // 3. CÁLCULO HORIZONTAL (Meio do Tooltip com Meio do Container)
        // Usamos o centroX do container fornecido pela função info
        const centroContainer = info.dimensoesContainer.centroX;
        const metadeTooltip = tip.offsetWidth / 2;
        
        // Precisamos descontar a posição onde o campo começa para achar o 'left' relativo
        const deslocamentoRelativoX = info.posicaoHorizontal.inicio;
        
        // Fórmula: Centro do Container - Início do Campo - Metade do Balão
        const xFinal = centroContainer - deslocamentoRelativoX - metadeTooltip;

        // 4. CÁLCULO VERTICAL (Alinhado ao centro do Input/Select)
        const yFinal = input.offsetTop + (input.offsetHeight / 2) - (tip.offsetHeight / 2);

        // 5. Aplicação Limpa
        tip.style.left = `${xFinal}px`;
        tip.style.top = `${yFinal}px`;
        
        // Reseta estados anteriores
        tip.style.right = "auto";
        tip.classList.remove('tooltip-left', 'tooltip-right');

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