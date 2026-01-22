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


    // Retorna o elemento de controle interno (input, select ou textarea)
    get control() {
        return this.shadowRoot.querySelector('.field-input, .field-select, .field-time');
    }

    // Retorna o container para mensagens de erro
    get container() {
        return this.shadowRoot.querySelector('.campo');        
    }

    marcarErro(mensagem) {
        const input = this.control; // Já pega o input automaticamente
        const container = this.container; // Já pega a div .field-col automaticamente

        if (!input || !container) return;

        input.classList.remove("valid");
        input.classList.add("invalid");

        container.classList.add('has-error');
        
        let msgErro = container.querySelector('.error-message');
        if (!msgErro) {
            msgErro = document.createElement('span');
            msgErro.className = 'error-message';
            container.appendChild(msgErro);
        }
        msgErro.innerText = mensagem;
    }

    marcarSucesso() {
        const input = this.control;
        const container = this.container;

        if (!input || !container) return;

        input.classList.remove("invalid");
        input.classList.add("valid");

        container.classList.remove('has-error');
        const msgErro = container.querySelector('.error-message');
        if (msgErro) msgErro.remove();
    }


































    // marcarErro(input, mensagem) {
       
    //     console.log("Chamou o marcar Erro...");        

    //     const container = this.container;

    //     console.log("---------------------------------------------------------");
    //     console.log(container);
    //     console.log("---------------------------------------------------------");

    //     if (!input) return;

    //     input.classList.remove("valid");
    //     input.classList.add("invalid");
       
    //     if (container) {
    //         container.classList.add('has-error');
    //         let msgErro = container.querySelector('.error-message');
    //         if (!msgErro) {
    //             msgErro = document.createElement('span');
    //             msgErro.className = 'error-message';
    //             container.appendChild(msgErro);
    //         }
    //         msgErro.innerText = mensagem;
    //     }
    // }

    // marcarSucesso() {
    //     const input = this.control;
    //     const container = this.container;

    //     if (!input) return;

    //     input.classList.remove("invalid");
    //     input.classList.add("valid");

    //     if (container) {
    //         container.classList.remove('has-error');
    //         const msgErro = container.querySelector('.error-message');
    //         if (msgErro) msgErro.remove();
    //     }
    // }


}
customElements.define('base-input', Base_Field);

/* Retirado pois é adicionado dinamicamente */
/* <button type="button" class="edit-button">
    <i class="${props.icon_edicao}"></i>
</button>   */