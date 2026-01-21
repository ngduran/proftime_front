export const tooltipCss = new CSSStyleSheet();
tooltipCss.replaceSync(`
    
    /**
     * @section Tooltip Layout
     * Define a estrutura de ancoragem para os balões de informação.
     * Nota: Deve respeitar o 'overflow: visible' do container pai para evitar cortes.
     */

    .info-question {
        margin-left: 4px;
        color: var(--color-primary);   
    }

    .info-question:hover {
        color: var(--color-accent)
    }

    .tooltip-container {
        position: absolute;
        background-color: #444;
        color: #fff;
        padding: 10px 15px;
        /* Canto arredondado invertido para a ponta do balão */
        border-radius: 12px 12px 0px 12px; 
        font-size: 13px;
        line-height: 1.4;
        z-index: 10000;
        width: max-content;
        max-width: 180px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4); 
        pointer-events: none;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateY(10px);
    }

    /* Estado visível */
    .tooltip-container.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    /* Seta genérica (pseudo-elemento) */
    /*
    .tooltip-container::after {
        content: "";
        position: absolute;
        top: 100%;
        border-width: 8px;
        border-style: solid;
        border-color: #444 transparent transparent transparent;
    }
    */

    /* Estilo quando o balão está à ESQUERDA do campo (Seta na direita) */
    .tooltip-left { 
        border-radius: 12px 12px 0px 12px; 
    }
    .tooltip-left::after { 
        right: 10px; 
    }

    /* Estilo quando o balão está à DIREITA do campo (Seta na esquerda) */
    .tooltip-right { 
        border-radius: 12px 12px 12px 0px; 
    }
    .tooltip-right::after { 
        left: 10px; 
    }

`);