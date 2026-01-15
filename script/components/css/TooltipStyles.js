export const tooltipCss = new CSSStyleSheet();
tooltipCss.replaceSync(`
    .tooltip-container {  
        
        /* Posicionamento e Fluxo */
        position: absolute;
        bottom: 20%;        
        z-index: 100;
        left: 50%;
        
        /* Dimensões e Alinhamento de Texto */
        width: max-content;
        max-width: 180px;
        text-align: center;
        line-height: 1.4;

        /* Estilização Visual (Cores e Bordas) */
        background-color: #444;
        color: #fff;
        padding: 10px 15px;
        border-radius: 6px;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);        
        transform: translateX(-50%) translateY(10px);      
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s ease;
        white-space: nowrap; /* Evita quebra de linha que deforma o balão */
    }

    /* O estado visível corrige o transform para o lugar original */
    .tooltip-container.visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    /* Triângulo (Seta) do balão */
    .tooltip-container::after {
        content: "";
        position: absolute;
        top: 100%; /* Na parte de baixo do balão */
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #444 transparent transparent transparent;
    }
`);