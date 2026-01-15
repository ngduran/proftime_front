import { selectCss } from '../css/SelectStyles.js';

export class BaseSelect extends HTMLElement {
    constructor() {
        super();
       
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }       
        
        this.shadowRoot.adoptedStyleSheets = [selectCss];

        this.render();
        this.inicializarTooltips();

    }
     
    setupBase() {
        //this.inicializarTooltips();
    }

    async render() {
        const label                  = this.getAttribute('label');
        const data_translate_label   = this.getAttribute('data-translate_label');
        const id                     = this.getAttribute('id');
        const name_select            = this.getAttribute('name_select');
        const data_translate_op      = this.getAttribute('data-translate_op');
        const icon_question          = this.getAttribute('icon-question');
        const data_tooltip_balao     = this.getAttribute('data-tooltip_balao');
        const data_translate_tooltip = this.getAttribute('data-translate-tooltip');
        const button_edicao          = this.getAttribute('button-edicao');
        const is_required            = this.hasAttribute('required') ? 'required' : '';
        
        // Note que agora o innerHTML não tem mais a tag <style>!
        // Ele está muito mais limpo.
        this.shadowRoot.innerHTML = `            
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>
            
            <div class="form-item">
                <div class="label-container">                              
                    <label for="${id}" data-translate="${data_translate_label}">${label}</label>
                    <i class="${icon_question}" data-tooltip="${data_tooltip_balao}" data-translate="${data_translate_tooltip}"></i>
                </div>
                <div class="input-group">
                    <select id="main-select" name="${name_select}" ${is_required}>
                        <option value="" data-translate="${data_translate_op}">Selecione o estado</option>
                    </select>


                    <button type="button" class="edit-button">
                        <i class="${button_edicao}"></i>
                    </button>   
                </div>
            </div>
        `;

        this.shadowRoot.getElementById('main-select').addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('change-value', {
                detail: { value: e.target.value },
                composed: true
            }));
        });
    } 

    async inicializarTooltips() {        
        this.shadowRoot.querySelectorAll('.info-question').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                const mensagem = icon.getAttribute('data-tooltip');
                
                // Garantimos que o container do label seja o pai relativo
                const container = icon.closest('.label-container');
                if (!container) return;

                let tooltip = container.querySelector('.tooltip-container');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = 'tooltip-container';
                    tooltip.innerText = mensagem;
                    container.appendChild(tooltip);
                }

                // Força o cálculo de layout antes de mostrar
                requestAnimationFrame(() => tooltip.classList.add('visible'));
            });

            icon.addEventListener('mouseleave', () => {
                const container = icon.closest('.label-container');
                const tooltip = container?.querySelector('.tooltip-container');
                if (tooltip) {
                    tooltip.classList.remove('visible');
                    // Remove do DOM após a animação de fade-out
                    setTimeout(() => tooltip.remove(), 300);
                }
            });
        });
    }
}

customElements.define('base-select', BaseSelect);