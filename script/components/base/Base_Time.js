import { fieldCss } from '../css/Input_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';

export class Base_Time extends HTMLElement {
    
    constructor() {
        super();
       
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }       
        
        this.shadowRoot.adoptedStyleSheets = [fieldCss];  
    }

     setupBase() {
        // Aqui os elementos já foram renderizados pelo renderBase()
        TooltipManager.init(this.shadowRoot);
    }

   async render() {
        const label                  = this.getAttribute('label');
        const data_translate_label   = this.getAttribute('data-translate_label');
        const id                     = this.getAttribute('id');
        const name                   = this.getAttribute('name');        
        const icon_question          = this.getAttribute('icon-question');
        const data_translate_ph      = this.getAttribute('data_translate_ph');
        const data_tooltip_balao     = this.getAttribute('data-tooltip_balao');
        const data_translate_tooltip = this.getAttribute('data-translate-tooltip');
        const placeholder            = this.getAttribute('placeholder');
        const icon_edicao            = this.getAttribute('icon-edicao');
        const is_required            = this.hasAttribute('required') ? 'required' : '';        
        
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
                    <input type="time" id="${id}" name="${name}" data-translate="${data_translate_ph}" placeholder="${placeholder}" autocomplete="off" ${is_required}>  
                    <button type="button" class="edit-button">
                        <i class="${icon_edicao}"></i>
                    </button>   
                </div>
            </div>
        `;
        
    }     
}
customElements.define('base-time', Base_Time);