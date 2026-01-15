// SharedStyles.js
export const sharedStyles = new CSSStyleSheet();

// Aqui você coloca o CSS que é igual para todos os seus componentes
sharedStyles.replaceSync(` 

    :host {
        display: block !important;
        margin-bottom: 1.2rem;
        height: 78px; /* Altura exata para evitar o pulo */
        margin-bottom: 15px; /* Espaçamento entre os campos */
        contain: layout size; /* Trava o tamanho no motor do navegador */
    }

    /* Labels e Inputs */
    label:not(.ignore-base) {
        display: block;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-dark);
        margin-top: 15px;
        margin-bottom: 5px;

        
    }

    .input-group:not(.ignore-base) {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        margin-bottom: 10px;
        width: 100%;

       
    }

    input, select {
        width: 100%;
        padding: 10px;
        border: 1px solid var(--color-border);
        border-radius: 6px;
    }
    
    /* Mantenha o vermelho assim para comparar o peso */
    .input-group input.invalid,
    .input-group select.invalid {
        border: 1px solid #ff4d4d !important;
        outline: none;
        background-color: #fffafa; /* Um fundinho avermelhado leve opcional */
    }

    /* Ajuste para garantir que o verde apareça */
    .input-group input.valid,
    .input-group select.valid {
        border: 1px solid #28a745 !important; 
        background-color: #f8fff9 !important;
        outline: none;
    }

    .input-group input {
        width: 100%;
        padding: 12px 40px 12px 15px; /* Espaço para o ícone de informação */
        //border: 1px solid var(--color-border);
        border: 1px solid var(--color-accent);
        border-radius: 8px;
        font-size: 1rem;
        color: var(--color-text-dark);
        background-color: var(--color-input-bg);
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .input-group select {
        width: 100%;
        padding: 12px 40px 12px 15px; /* Espaço para o ícone de informação */
        //border: 1px solid var(--color-border);
        border: 1px solid var(--color-accent);
        border-radius: 8px;
        font-size: 1rem;
        color: var(--color-text-dark);
        background-color: var(--color-input-bg);
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    /* Efeito de Foco Aplicando a Cor de Destaque */
    .input-group input:focus {
        border-color: var(--color-accent); /* Borda fica Ouro */
        box-shadow: 0 0 0 2px rgba(175, 126, 23, 0.2);
        outline: none;
    }

    .input-group select:focus {
        border-color: var(--color-accent); /* Borda fica Ouro */
        box-shadow: 0 0 0 2px rgba(175, 126, 23, 0.2);
        outline: none;
    }

    .info-icon {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        //color: var(--color-border); /* Cor Cinza para o ícone de informação */
        font-size: 1rem;
        cursor: help;   
    }
    
    .info-question {
        margin-left: 04px;
        color: var(--color-primary);   
    }

    .info-question:hover {
        color: var(--color-accent)
    }

    /* Checkbox */
    .checkbox-group {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        margin-top: 10px;
    }

    .checkbox-group input[type="checkbox"] {
        width: 18px;
        height: 18px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        margin-right: 8px;
        appearance: none; /* Esconde o estilo nativo */
        cursor: pointer;
        transition: background-color 0.2s, border-color 0.2s;
    }

    .checkbox-group input[type="checkbox"]:checked {
        background-color: var(--color-primary); /* Checkbox marcado usa Azul Escuro */
        border-color: var(--color-primary);
    }

    .checkbox-group label {
        margin: 0;
        font-weight: 400;
    }

    .error-message {
        position: absolute;
        top: 100%;
        margin-top: 2px;
        //z-index: 10; //Não precisava pois já estava acima do fundo
    
        left: 0px;    
        font-size: 12px;
        color: #ff4d4d;
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
        z-index: 1000;
        width: max-content;
        max-width: 180px;
        text-align: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        
        /* Posicionamento inicial acima do ícone */
        bottom: 100%; 
        right: 0;
        margin-bottom: 10px;
        
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease;
        transform: translateY(10px);
    }

    /* Adicione isso para garantir que o texto venha do atributo traduzido */
    .tooltip-container::before {
        content: attr(data-tooltip); 
        display: block;
    }

    .tooltip-container.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    /* Pequena seta para o balão */
    .tooltip-container::after {
        content: "";
        position: absolute;
        top: 100%;
        right: 5px;
        border-width: 8px;
        border-style: solid;
        border-color: #444 transparent transparent transparent;
    }

    .input-group input, .input-group select {    
        -webkit-appearance: none !important; 
        -moz-appearance: none !important; 
        appearance: none !important;
    }

    /* Dica visual: mudar o cursor para indicar que o campo é clicável em toda área */
    input[type="time"] {
        cursor: pointer !important;
    }

    /* Garante que o container tenha espaço e não esconda o menu */
    .input-group {    
        overflow: visible !important; /* Essencial para o pop-up não ser cortado */
    }

    .edit-button {
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        //background-color: var(--color-primary);
        background-color: var(--color-accent);
        //background-color: var(--color-primary); /* Cor Principal: Azul Escuro */ 
        color: var(--color-primary);
        //color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
        //z-index: 10;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }


    .edit-button:hover {    
        background-color: var(--color-primary);
        color: var(--color-accent);

    }

    .edit-button:active {
        transform: translateY(-50%) scale(0.95);
    }

    .edit-button svg {
        width: 16px;
        height: 16px;
    }


    /* Container para alinhar label e ícone na mesma linha */
    .label-container {
        display: flex;
        align-items: center;
        gap: 2px; /* Espaço entre o texto e a interrogação */
    }

    /* Estilo do ícone de interrogação agora ao lado do label */
    .label-container .info-question {
        margin-top: 10px; /* Compensa o margin-top do label para alinhar verticalmente */
        color: var(--color-primary);
        font-size: 0.9rem;
        cursor: help;
    }

    /* Remova o position absolute antigo que jogava ele para dentro do input */
    .info-question {
        position: static !important; 
        transform: none !important;
    }

 
`);