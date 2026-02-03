import { table_standard_style } from '../css/Table_Standard_Styles.js';

export class Table_Standard extends HTMLElement {

    // 1. INICIALIZAÇÃO
    constructor() {
        
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.adoptedStyleSheets = [table_standard_style];

        // Inicialização de estados internos (Private-like)
        this._linhas = 0;
        this._colunas = 0;
        this._nomesDias = [];
        this._nomesLinhas = [];
        this._rotulo = 'individual'; 
        this._rotuloCabecalho = 'Aula';        
    }

    /**
     * Lista de atributos do HTML que o componente observa.
     */
    static get observedAttributes() {
        return ['linhas', 'colunas', 'colunas-nomes', 'rotulo', 'linhas-nomes', 'rotulo-cabecalho'];
    }


    connectedCallback() {
        // Garantia de idioma conforme requisito do sistema [cite: 2026-01-27]
        if (!sessionStorage.getItem('official_language')) {
            sessionStorage.setItem('official_language', 'pt');
        }
        this.render();
        this.initSortable();
    }

    /**
     * Sincroniza os atributos do HTML com as propriedades internas.
     * Implementa a inteligência de contar itens em strings separadas por vírgula.
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        switch (name) {
            case 'colunas-nomes':
                // Converte string em array e define automaticamente o número de colunas
                this._nomesDias = newValue.split(',').map(n => n.trim());
                this._colunas = this._nomesDias.length; 
                break;

            case 'linhas-nomes':
                // Converte string em array e define automaticamente o número de linhas
                this._nomesLinhas = newValue.split(',').map(n => n.trim());
                this._linhas = this._nomesLinhas.length;
                break;

            case 'linhas':
                // Só define via número se o array de nomes ainda estiver vazio
                if (this._nomesLinhas.length === 0) {
                    this._linhas = parseInt(newValue) || 0;
                }
                break;

            case 'colunas':
                // Só define via número se o array de nomes ainda estiver vazio
                if (this._nomesDias.length === 0) {
                    this._colunas = parseInt(newValue) || 0;
                }
                break;

            case 'rotulo':
                this._rotulo = newValue;
                break;

            case 'rotulo-cabecalho':
                this._rotuloCabecalho = newValue;
                break;
        }

        // Renderiza novamente apenas se o componente já estiver na tela
        if (this.isConnected) {
            this.render();
            this.initSortable();
        }
    }

    /**
     * Renderiza a estrutura da grade baseada nos atributos processados.
     */
    render() {
        let htmlFinal = '';
        const ehFixo = this._rotulo === 'fixo';

        // Geração da Coluna de Horários (Aula) quando em modo FIXO
        if (ehFixo) {
            htmlFinal += `
                <div class="dia-bloco coluna-fixa">
                    <div class="item-header">${this._rotuloCabecalho}</div>
                    ${Array.from({ length: this._linhas }).map((_, idx) => `
                        <div class="item-data cell-key">${this._nomesLinhas[idx] || (idx + 1) + 'º'}</div>
                    `).join('')}
                </div>
            `;
        }

        // Geração das colunas de Dias/Matérias
        // for (let i = 0; i < this._colunas; i++) {
        //     const nomeDia = this._nomesDias[i] || `Dia ${i + 1}`;
            
        //     htmlFinal += `
        //         <div class="dia-bloco">
        //             ${!ehFixo ? `<div class="item-header">${this._rotuloCabecalho}</div>` : ''}
        //             <div class="item-header">${nomeDia}</div>
                    
        //             ${Array.from({ length: this._linhas }).map((_, idx) => `
        //                 ${!ehFixo ? `<div class="item-data cell-key">${this._nomesLinhas[idx] || (idx + 1) + 'º'}</div>` : ''}
        //                 <div class="item-data cell-value"></div>
        //             `).join('')}
        //         </div>
        //     `;
        // }

        for (let i = 0; i < this._colunas; i++) {
            const nomeDia = this._nomesDias[i] || `Dia ${i + 1}`;
            const colunaAtual = i + 1; // Representa a coluna física

            htmlFinal += `
                <div class="dia-bloco">
                    ${!ehFixo ? `<div class="item-header">${this._rotuloCabecalho}</div>` : ''}
                    <div class="item-header">${nomeDia}</div>
                    
                    ${Array.from({ length: this._linhas }).map((_, idx) => {
                        const linhaAtual = idx + 1; // Representa a linha física

                        return `
                            ${!ehFixo ? `<div class="item-data cell-key">${this._nomesLinhas[idx] || linhaAtual + 'º'}</div>` : ''}
                            <div class="item-data cell-value" 
                                data-coluna="${colunaAtual}" 
                                data-linha="${linhaAtual}">
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        this.shadowRoot.innerHTML = `
            <div class="horario-grid-container">
                ${htmlFinal}
            </div>
        `;
    }

    initSortable() {
   
        //const blocosDias = this.shadowRoot.querySelectorAll('.dia-bloco');
        const blocosDias = this.shadowRoot.querySelectorAll('.dia-bloco:not(.coluna-fixa)');

        blocosDias.forEach(bloco => {
            new Sortable(bloco, {
                group: 'horario-escolar',
                animation: 150,
                swap: true, // Ativa a troca de lugar entre duas células
                
                // --- AJUSTE PARA MOBILE (DELAY) ---
                delay: 300,        // Tempo em milissegundos (0.3s) pressionado para começar a arrastar
                delayOnTouchOnly: true, // O delay só será aplicado no celular/touch
                touchStartThreshold: 5, // Quantos pixels o dedo pode "tremer" antes de cancelar o delay


                // REGRA DE OURO 1: Só permite arrastar o que for 'celula-value'
                draggable: '.cell-value', 

                // REGRA DE OURO 2: Ignora cliques em qualquer outra classe
                filter: 'item-header, .cell-key',
                preventOnFilter: true,

                // REGRA DE OURO 3: Só permite soltar se o alvo for 'celula-value'
                onMove: function (evt) {
                    // evt.related é o elemento de destino
                    return evt.related.classList.contains('cell-value');
                }
            });
        });
        
    }

    /**
     * Limpa o conteúdo de todas as células de matéria da grade.
     * Pode ser chamado externamente via: documento.querySelector('grade-horario-professor').limparGrade();
     */
    limparGrade() {
        // Busca todas as células que contêm matérias dentro do Shadow DOM
        const celulasValue = this.shadowRoot.querySelectorAll('.cell-value');
        
        celulasValue.forEach(celula => {
            celula.textContent = ''; // Remove o texto da matéria
            // Se você usar algum atributo de dados ou ID de matéria, limpe-o aqui também:
            // celula.removeAttribute('data-id-value');
        });

        console.log("Grade de horários limpa com sucesso.");
    }

}

customElements.define('table-standard', Table_Standard);