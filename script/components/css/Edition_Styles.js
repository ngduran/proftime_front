export const editionCss = new CSSStyleSheet();

editionCss.replaceSync(`
    
 

    /* ===== 5 =====*/
    .edit-button {
        position: absolute;
        right: 5px;
        top: 65%;
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
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 5;        
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

    /* Tamanho do ícone */
    .edit-button i {
        font-size: 14px;
    }

`);