import { table_standard_style } from '../css/Table_Standard_Styles.js';

export class Table_Standard extends HTMLElement {

    // 1. INICIALIZAÇÃO
    constructor() {
        
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.adoptedStyleSheets = [table_standard_style];       
        
    }

    connectedCallback() {
        this.render();
        this.initSortable(); // Ativa o SortableJS após renderizar o HTML
    }

    render() {
        // Exemplo de como os dados devem chegar (pode vir de uma API ou propriedade)
        const diasSemana = this.dados || [
            { nome: 'Segunda',  materias: ['Direito do Trabalho', '', 'Direito Civil', '', '', ''] },
            { nome: 'Terça',    materias: ['', '', 'Direito Penal', '', '', ''                   ] },
            { nome: 'Quarta',   materias: ['', '', '', '', '', ''                                ] },
            { nome: 'Quinta',   materias: ['', '', '', '', '', ''                                ] },
            { nome: 'Sexta',    materias: ['', '', '', '', '', ''                                ] },
            { nome: 'Sábado',   materias: ['', '', '', '', '', ''                                ] },
            { nome: 'Domingo',  materias: ['', '', '', '', '', ''                                ] }
        ];

        // Mapeamos os dados para gerar o HTML
        const htmlGeral = diasSemana.map(dia => `
            <div class="dia-bloco">
                <div class="item-header">Aula</div>
                <div class="item-header">${dia.nome}</div>
                
                ${dia.materias.map((materia, index) => `
                    <div class="item-data cell-aula">${index + 1}º</div>
                    <div class="item-data cell-materia">${materia}</div>
                `).join('')}
            </div>
        `).join('');

        this.shadowRoot.innerHTML = `
            <div class="horario-grid-container">
                ${htmlGeral}
            </div>
        `;
    }

    initSortable() {
   
        const blocosDias = this.shadowRoot.querySelectorAll('.dia-bloco');

        blocosDias.forEach(bloco => {
            new Sortable(bloco, {
                group: 'horario-escolar',
                animation: 150,
                swap: true, // Ativa a troca de lugar entre duas células
                
                // --- AJUSTE PARA MOBILE (DELAY) ---
                delay: 300,        // Tempo em milissegundos (0.3s) pressionado para começar a arrastar
                delayOnTouchOnly: true, // O delay só será aplicado no celular/touch
                touchStartThreshold: 5, // Quantos pixels o dedo pode "tremer" antes de cancelar o delay


                // REGRA DE OURO 1: Só permite arrastar o que for 'celula-materia'
                draggable: '.cell-materia', 

                // REGRA DE OURO 2: Ignora cliques em qualquer outra classe
                filter: 'item-header, .cell-aula',
                preventOnFilter: true,

                // REGRA DE OURO 3: Só permite soltar se o alvo for 'celula-materia'
                onMove: function (evt) {
                    // evt.related é o elemento de destino
                    return evt.related.classList.contains('cell-materia');
                }
            });
        });
        
    }

}

customElements.define('table-standard', Table_Standard);