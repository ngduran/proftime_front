export const fieldCss = new CSSStyleSheet();

fieldCss.replaceSync(`

    /* ===== 1 =====*/
    .input-group {
        position: relative; 
        width: 100%;
        display: flex;
        align-items: center;
    }

    input {
        width: 100%;
        padding: 12px 45px 12px 15px; /* 45px à direita reserva espaço para o botão de 32px */
        border: 1px solid var(--color-accent);
        border-radius: 8px;
        font-size: 1rem;
        color: var(--color-text-dark);
        background-color: var(--color-input-bg);
        transition: border-color 0.2s, box-shadow 0.2s;
        appearance: none !important;
        -webkit-appearance: none !important;        
        cursor: pointer;        
    }

     /* ===== 2 =====*/
    input:focus {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px rgba(175, 126, 23, 0.2);
        outline: none;
    }

      /* ===== 3 =====*/
    /* Este talves possa retirar pois não vi nada de diferente */
    input {
        background-image: url("data:image/svg+xml,..."); 
        background-repeat: no-repeat;
        background-position: right 15px center;
    }

      /* ===== 4 =====*/
    input.invalid {
        border: 1px solid #ff4d4d !important;
        background-color: #fffafa !important;
    }

    input.valid {
        border: 1px solid #28a745 !important; 
        background-color: #f8fff9 !important;
    }

    /* ===== 5 =====*/
    .edit-button {
        position: absolute;
        right: 5px;
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
        transition: background-color 0.2s;        
    }

     /* ===== 6 =====*/
    .edit-button:hover {    
        background-color: var(--color-primary);
        color: var(--color-accent);
    }

     /* ===== 7 =====*/
    .edit-button:active {
        transform: translateY(-50%) scale(0.95);
    }

     /* ===== 8 =====*/
    .edit-button svg {
        width: 16px;
        height: 16px;
    }

    /* ===== 9 =====*/
    label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-dark);       
    }

    .label-container {
        position: relative;    /* CRUCIAL: O tooltip vai se basear aqui */ 
        display: flex;
        align-items: center; /* Alinha o texto e o ícone pela base da escrita */
        gap: 4px;              /* Espaçamento horizontal levemente aumentado para melhor respiro */
        margin-top: 15px;      /* Espaço superior do bloco */
        margin-bottom: 5px;    /* Espaço entre o rótulo e o campo de input/select */
    }

    .info-question {        
        color: var(--color-primary);
        position: relative;
    }

    .edit-button svg {
        width: 16px;
        height: 16px;
    }
        
`);