import { field_style } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';
import { EditionManager } from '../utils/EditionManager.js';

export class Base_Field extends HTMLElement {
    
    constructor() {
        super();
       
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }       
        
        this.shadowRoot.adoptedStyleSheets = [field_style];  
    }

    setupBase() {     
        
    }
    
    initTooltip() {
        TooltipManager.init(this.shadowRoot);        
    }

    initEdition() {
        EditionManager.init(this.shadowRoot);
    }

    // O "Buraco" que será preenchido
    renderControl(p) {
        return ``;
    }


   async render() {
        const props = {
            label                  : this.getAttribute('label') || '',
            data_translate_label   : this.getAttribute('data-translate_label') || '',
            id                     : this.getAttribute('id') || '',
            name                   : this.getAttribute('name') || '',
            icon_question          : this.getAttribute('icon-question') || '',
            data_translate_ph      : this.getAttribute('data_translate_ph') || '',
            data_tooltip_balao     : this.getAttribute('data-tooltip_balao') || '',
            data_translate_tooltip : this.getAttribute('data-translate-tooltip') || '',
            data_translate_op      : this.getAttribute('data-translate_op') || '',
            placeholder            : this.getAttribute('placeholder') || '',
            icon_edicao            : this.getAttribute('icon-edicao') || '',
            is_required            : this.hasAttribute('required') ? 'required' : ''
        }
        
        this.shadowRoot.innerHTML = `            
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>
            
            ${this.renderControl(props)}        
           
        `;
        
    }

}
customElements.define('base-input', Base_Field);

/* Retirado pois é adicionado dinamicamente */
/* <button type="button" class="edit-button">
    <i class="${props.icon_edicao}"></i>
</button>   */