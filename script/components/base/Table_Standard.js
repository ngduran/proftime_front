import { table_standard_style } from '../css/Table_Standard_Styles.js';

export class Table_Standard extends HTMLElement {

    // 1. INICIALIZAÇÃO
    constructor() {
        
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.adoptedStyleSheets = [table_standard_style];

        // Valores padrão caso não sejam passados no HTML
        this._linhas = 6;
        this._colunas = 7;
        this._nomesDias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
        this._rotulo = 'individual'; // Padrão atual 
        
    }

    // Monitora os atributos definidos no HTML
    static get observedAttributes() {        
        return ['linhas', 'colunas', 'colunas-nomes', 'rotulo'];
    }


    connectedCallback() {
        this.render();
        this.initSortable(); // Ativa o SortableJS após renderizar o HTML
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        if (name === 'rotulo') {
            this._rotulo = newValue;
        } else if (name === 'colunas-nomes') {
            this._nomesDias = newValue.split(',').map(n => n.trim());
        } else {
            this[`_${name}`] = parseInt(newValue) || this[`_${name}`];
        }
        this.render();
        this.initSortable();
    }


    // render() {
    //     // Exemplo de como os dados devem chegar (pode vir de uma API ou propriedade)
    //     const diasSemana = this.dados || [
    //         { nome: 'Segunda',  materias: ['Direito do Trabalho', '', 'Direito Civil', '', '', ''] },
    //         { nome: 'Terça',    materias: ['', '', 'Direito Penal', '', '', ''                   ] },
    //         { nome: 'Quarta',   materias: ['', '', '', '', '', ''                                ] },
    //         { nome: 'Quinta',   materias: ['', '', '', '', '', ''                                ] },
    //         { nome: 'Sexta',    materias: ['', '', '', '', '', ''                                ] },
    //         { nome: 'Sábado',   materias: ['', '', '', '', '', ''                                ] },
    //         { nome: 'Domingo',  materias: ['', '', '', '', '', ''                                ] }
    //     ];

    //     // Mapeamos os dados para gerar o HTML
    //     const htmlGeral = diasSemana.map(dia => `
    //         <div class="dia-bloco">
    //             <div class="item-header">Aula</div>
    //             <div class="item-header">${dia.nome}</div>
                
    //             ${dia.materias.map((materia, index) => `
    //                 <div class="item-data cell-aula">${index + 1}º</div>
    //                 <div class="item-data cell-materia">${materia}</div>
    //             `).join('')}
    //         </div>
    //     `).join('');

    //     this.shadowRoot.innerHTML = `
    //         <div class="horario-grid-container">
    //             ${htmlGeral}
    //         </div>
    //     `;
    // }


    // render() {
    //     // Gera os dados dinamicamente com base nos atributos
    //     const gradeDinamica = [];
    //     for (let i = 0; i < this._colunas; i++) {
    //         gradeDinamica.push({
    //             nome: this._nomesDias[i] || `Dia ${i + 1}`,
    //             materias: Array(this._linhas).fill('') // Cria as linhas vazias
    //         });
    //     }

    //     const htmlGeral = gradeDinamica.map(dia => `
    //         <div class="dia-bloco">
    //             <div class="item-header">Aula</div>
    //             <div class="item-header">${dia.nome}</div>
    //             ${dia.materias.map((materia, index) => `
    //                 <div class="item-data cell-aula">${index + 1}º</div>
    //                 <div class="item-data cell-materia">${materia}</div>
    //             `).join('')}
    //         </div>
    //     `).join('');

    //     this.shadowRoot.innerHTML = `
    //         <div class="horario-grid-container">
    //             ${htmlGeral}
    //         </div>
    //     `;
    // }

    // render() {
    //     const htmlGeral = [];
        
    //     // Usamos o número de colunas definido, mas buscamos o nome no array _nomesDias
    //     for (let i = 0; i < this._colunas; i++) {
    //         const nomeDia = this._nomesDias[i] || `Dia ${i + 1}`;
            
    //         htmlGeral.push(`
    //             <div class="dia-bloco">
    //                 <div class="item-header">Aula</div>
    //                 <div class="item-header">${nomeDia}</div>
    //                 ${Array.from({ length: this._linhas }).map((_, idx) => `
    //                     <div class="item-data cell-aula">${idx + 1}º</div>
    //                     <div class="item-data cell-materia"></div>
    //                 `).join('')}
    //             </div>
    //         `);
    //     }

    //     this.shadowRoot.innerHTML = `
    //         <div class="horario-grid-container">
    //             ${htmlGeral.join('')}
    //         </div>
    //     `;
    // }

    render() {
        let htmlFinal = '';
        const ehFixo = this._rotulo === 'fixo';

        // 1. COLUNA FIXA (Aparece apenas uma vez à esquerda)
        if (ehFixo) {
            htmlFinal += `
                <div class="dia-bloco coluna-fixa-aula">
                    <div class="item-header">Aula</div>
                    ${Array.from({ length: this._linhas }).map((_, idx) => `
                        <div class="item-data cell-aula">${idx + 1}º</div>
                    `).join('')}
                </div>
            `;
        }

        // 2. BLOCOS DOS DIAS
        for (let i = 0; i < this._colunas; i++) {
            const nomeDia = this._nomesDias[i] || `Dia ${i + 1}`;
            
            htmlFinal += `
                <div class="dia-bloco">
                    ${!ehFixo ? '<div class="item-header">Aula</div>' : ''}
                    <div class="item-header">${nomeDia}</div>
                    
                    ${Array.from({ length: this._linhas }).map((_, idx) => `
                        ${!ehFixo ? `<div class="item-data cell-aula">${idx + 1}º</div>` : ''}
                        <div class="item-data cell-materia"></div>
                    `).join('')}
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
        const blocosDias = this.shadowRoot.querySelectorAll('.dia-bloco:not(.coluna-fixa-aula)');

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