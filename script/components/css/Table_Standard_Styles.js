export const table_standard_style = new CSSStyleSheet();

table_standard_style.replaceSync(`

    /* NOVIDADE: Faz o componente se comportar como um bloco de largura total */
    :host {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }

    * { 
        box-sizing: border-box; 
    }

    /* ===================================================================================*/
    /* Grid de Horário */
    /* Container que segura todos os dias */
    .horario-grid-container {
        display: flex;
        flex-wrap: nowrap; /* Impede que os dias pulem para baixo */
        gap: 15px;
        width: 100%;
        
        /* Ativa o scroll horizontal */
        overflow-x: auto; 
        padding-bottom: 15px; /* Espaço para a barra de scroll não cobrir o conteúdo */
        
        /* Garante um deslize suave em dispositivos touch */
        -webkit-overflow-scrolling: touch;

        align-items: stretch; /* Força todas as colunas (dia-bloco) a terem a mesma altura total */
    }

    /* No seu Table_Standard_Styles.js */
    .dia-bloco {
        display: grid;
        grid-template-columns: min-content 1fr; 
        flex: 0 0 300px; /* Mantém cada dia com 300px de largura */
        min-width: 280px;
        gap: 2px;
        align-content: start; /* Garante que os itens comecem no topo */
    }

    /* MODO INDIVIDUAL (image_fc4857.png) */
    /* Se o bloco contém a célula de key, divide em duas colunas */
    .dia-bloco:has(.cell-key) {
        grid-template-columns: min-content 1fr;
    }

    /* MODO FIXO (image_fc4933.png) */
    /* Se o bloco NÃO contém a célula de key, a matéria ocupa tudo */
    .dia-bloco:not(:has(.cell-key)) {
        grid-template-columns: 1fr;
    }

    /* Ajuste fino para o scrollbar ficar mais elegante (opcional) */
    .horario-grid-container::-webkit-scrollbar {
        height: 8px;
    }

    .horario-grid-container::-webkit-scrollbar-thumb {
        background: var(--color-primary);
        border-radius: 10px;
    }

    .horario-grid-container::-webkit-scrollbar-track {
        background: #e0e0e0;
    }
    
    .item-header {
        width: 100%;
        padding: 0.5rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-size: 0.85rem;
        background-color: #fff;
        background-color: var(--color-primary);
        color: var(--color-accent);
        font-weight: bold;
        border: none;
        grid-column: span 1; 
    }

    .item-data {
        padding: 0.5rem;
        height: 100%;
        min-height: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        font-size: 0.85rem;
        background-color: #fff;
        margin-bottom: -1px;      /* Colapsa as bordas */
        box-sizing: border-box;
        background-color: #fff;
    }

    .coluna-fixa {
        flex: 0 0 60px !important;
        min-width: 60px !important;
        grid-template-columns: 1fr !important; /* Coluna fixa é sempre simples */
    }

    /* Coluna Key (1º, 2º...) */
    .cell-key {
        background-color: var(--color-cell-key);       
        font-weight: bold;
        min-width: 50px; /* Largura mínima para o número da key */
        color: #504f4f;
    }

    /* Estilo do item enquanto ele é arrastado */
    .sortable-ghost {
        opacity: 0.4;
        background-color: var(--color-primary) !important;
        border: 2px dashed #666 !important;
    }

    /* Indica que o item pode ser pego (opcional) */
    .item-data:not(.cell-key) {
        cursor: grab;
    }

    .item-data:not(.cell-key):active {
        cursor: grabbing;
    }

    /* Quando o item é selecionado (durante o delay) */
    .sortable-chosen {
        background-color: var(--color-cell-key) !important;
        transform: scale(1.02); /* Dá uma leve aumentada para mostrar que "desgrudou" */
        transition: transform 0.2s;
        z-index: 10;
    }

    /*============== Adicionado para não quebrar a celula em celulares ===*/
    
    /* Garante que a célula cresça com o conteúdo e o fundo acompanhe */
    .item-data.cell-value {
        height: auto;             /* Permite expandir verticalmente */
        min-height: 3.5rem;       /* Mantém uma altura mínima estética */
        display: flex;
        flex-direction: column;
        padding: 0;               /* Remove padding para o fundo interno encostar nas bordas */
        overflow: hidden;
    }

    /* Estilização dos textos internos */
    .aula-preenchida {
        background: #e1f5fe;
        border-left: 4px solid var(--color-primary, #1748AF);
        padding: 6px;
        height: 100%;             /* Ocupa toda a altura da célula */
        width: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;  /* Centraliza o conteúdo verticalmente */
        word-break: break-word;   /* Força quebra de palavras longas no mobile */
    }
    
    .materia-nome { 
        font-weight: bold; 
        font-size: 0.85em; 
        color: #1748AF; 
        line-height: 1.2; 
    }
       
    .turma-nome { 
        font-size: 0.95em; 
        color: #7813b3; 
        margin-top: 2px; 
    }
    
    .instituicao-nome { 
        font-size: 1.0em; 
        color: #176617; 
        text-transform: uppercase; 
        margin-top: 0px;
        ///border-top: 1px dotted #ccc;
        padding-top: 0px;
    }



    /*====================================================================*/

    /* RESPONSIVIDADE (Mobile) */
    @media screen and (max-width: 720px) {
        .horario-grid-container {
            flex-direction: column; /* Empilha os blocos de dias */
            gap: 20px; /* Espaço maior entre um dia e outro (Efeito Bloco) */
        }

        .dia-bloco {
            border: 2px solid var(--color-primary);
            border-radius: 8px;
            padding: 8px;
            background-color: #fff;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    }

    /* ===================================================================================*/
    
               
`);
