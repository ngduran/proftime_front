import { BaseInput } from '../base/BaseInput.js';

class HoraInicioInput extends BaseInput {
    constructor() {
        super(); 
    }
    
    connectedCallback() {
        this.render();
        // super.connectedCallback();
    }


    render() {
        const label                  = this.getAttribute('label') || '';
        const data_translate_label   = this.getAttribute('data-translate_label') || '';
        const id                     = this.getAttribute('id') || '';
        const icon_question          = this.getAttribute('icon-question') || '';
        const data_tooltip_balao     = this.getAttribute('data-tooltip_balao') || '';
        const data_translate_tooltip = this.getAttribute('data-translate-tooltip') || '';
        const name                   = this.getAttribute('name') || '';  
        const isRequired             = this.hasAttribute('required') ? 'required' : '';
        const icon_edicao            = this.getAttribute('icon-edicao') || '';

        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>

            <div class="label-container">
                <label for="${id}" data-translate="${data_translate_label}">${label}</label>
                <i class="${icon_question}" data-tooltip="${data_tooltip_balao}" data-translate="${data_translate_tooltip}" ></i>
            </div>
            <div class="input-group">
                <input type="time" id="${id}" name="${name}">
                <button type="button" class="edit-button">
                    <i class="${icon_edicao}"></i>
                </button>
            </div>
        `;
    }
   
}

customElements.define('hora-inicio-input', HoraInicioInput);