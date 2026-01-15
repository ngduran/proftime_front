export const sharedStyles = new CSSStyleSheet();

sharedStyles.replaceSync(` 
    /* ==========================================================================
       1. BASE DO COMPONENTE (:host e Layout)
       ========================================================================== */
    :host {
        display: block !important;
        width: 100%;
        margin-bottom: 15px; 
        contain: layout; 
    }

    /* Garante que o container interno não corte tooltips ou sombras */
    .input-group {    
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;
        width: 100%;
        overflow: visible !important; 
    }

    /* ==========================================================================
       2. LABELS E ÍCONES DE INFORMAÇÃO
       ========================================================================== */
    .label-container {
        display: flex;
        align-items: center;
        gap: 6px; 
        margin-bottom: 5px;
    }

    label:not(.ignore-base) {
        display: block;
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-dark);
        margin-top: 15px;
    }

    .info-question {
        margin-top: 15px; /* Alinha com o margin-top do label */
        color: var(--color-primary);
        font-size: 0.9rem;
        cursor: help;
        transition: color 0.2s;
    }

    .info-question:hover {
        color: var(--color-accent);
    }

    /* ==========================================================================
       3. ESTILOS COMUNS (INPUT, SELECT, TIME)
       ========================================================================== */
    input, select {
        width: 100%;
        padding: 12px 45px 12px 15px; /* Padding extra à direita para o botão de editar */
        border: 1px solid var(--color-accent);
        border-radius: 8px;
        font-size: 1rem;
        color: var(--color-text-dark);
        background-color: var(--color-input-bg);
        transition: border-color 0.2s, box-shadow 0.2s;
        appearance: none !important;
        -webkit-appearance: none !important;
    }

    input:focus, select:focus {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px rgba(175, 126, 23, 0.2);
        outline: none;
    }

    /* Estados de Validação */
    input.invalid, select.invalid {
        border: 1px solid #ff4d4d !important;
        background-color: #fffafa !important;
    }

    input.valid, select.valid {
        border: 1px solid #28a745 !important; 
        background-color: #f8fff9 !important;
    }

    /* ==========================================================================
       4. ESPECÍFICOS: SELECT
       ========================================================================== */
    select {
        cursor: pointer;
        /* Adicione aqui um ícone customizado de seta se desejar, 
           já que o appearance: none remove a seta padrão */
        background-image: url("data:image/svg+xml,..."); 
        background-repeat: no-repeat;
        background-position: right 15px center;
    }

    /* ==========================================================================
       5. ESPECÍFICOS: INPUT TIME
       ========================================================================== */
    input[type="time"] {
        cursor: pointer;
        font-family: inherit;
    }

    /* Estiliza o ícone do relógio nativo (Chrome/Edge) */
    input[type="time"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        filter: invert(0.5); /* Ajuste a cor conforme seu tema */
    }

    /* ==========================================================================
       6. BOTÃO DE EDIÇÃO E TOOLTIP
       ========================================================================== */
    .edit-button {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background-color: var(--color-accent);
        color: var(--color-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .edit-button:hover {    
        background-color: var(--color-primary);
        color: var(--color-accent);
    }

    .error-message {
        position: absolute;
        top: 100%;
        left: 0;
        font-size: 11px;
        color: #ff4d4d;
        margin-top: 2px;
    }

    .tooltip-container {
        position: absolute;
        background-color: #444;
        color: #fff;
        padding: 8px 12px;
        border-radius: 8px 8px 0px 8px; 
        font-size: 12px;
        z-index: 1000;
        bottom: 100%; 
        right: 0;
        margin-bottom: 10px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(5px);
        transition: all 0.3s ease;
    }

    .tooltip-container.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
`);