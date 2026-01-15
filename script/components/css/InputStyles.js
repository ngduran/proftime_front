export const inputCss = new CSSStyleSheet();

inputCss.replaceSync(`

    /* ==========================================================================
       3. ESTILOS COMUNS (INPUT, SELECT, TIME)
    =========================================================================== */
    input {
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

`);