import { fieldCss } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';

export class Base_Select extends HTMLElement {
    
    constructor() {
        super();
       
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }       
        
        this.shadowRoot.adoptedStyleSheets = [fieldCss];   
    }

    setupBase() {     
        TooltipManager.init(this.shadowRoot);
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
                    <select id="main-select" name="${name_select}" autocomplete="off" ${is_required}>
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
}

customElements.define('base-select', Base_Select);