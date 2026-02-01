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

}

customElements.define('table-standard', Table_Standard);