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

    get value() {
        // Busca o input, select ou textarea que está dentro do Shadow DOM
        const control = this.shadowRoot.querySelector('input, select, textarea');
        return control ? control.value : '';
    }

    // Dentro da classe Base_Field
    validar() {
        // Se o componente tiver um select interno, usa a validação de select
        if (this.shadowRoot && this.shadowRoot.querySelector('select')) {
            return this.validarSelect(); 
        }
        
        // Se for um input de tempo (como Hora Início), usa a de tempo
        if (this.control && this.control.type === 'time') {
            return this.validarCampoTime("Selecione uma hora válida");
        }

        // Caso contrário, valida como um campo de texto normal (Nome, etc.)
        return this.validarNome(); 
    }


    async render() {
        // 1. Criamos um objeto com os valores padrão que você já usa
        const props = {
            is_required: this.hasAttribute('required') ? 'required' : ''
        };

        // 2. Automatizamos a captura de TODOS os atributos do componente
        // Isso transforma 'data-translate_op1' em 'data_translate_op1' no objeto props
        for (let attr of this.attributes) {
            const propName = attr.name.replace(/-/g, '_'); 
            props[propName] = attr.value;
        }

        // Agora o props já contém data_translate_op1, op2, etc., automaticamente!
        
        this.shadowRoot.innerHTML = `            
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>
            ${this.renderControl(props)}           
        `;
    }



//    async render() {
//         const props = {
//             label                  : this.getAttribute('label') || '',
//             data_translate_label   : this.getAttribute('data-translate_label') || '',
//             id                     : this.getAttribute('id') || '',
//             name                   : this.getAttribute('name') || '',
//             icon_question          : this.getAttribute('icon-question') || '',
//             data_translate_ph      : this.getAttribute('data_translate_ph') || '',
//             data_tooltip_balao     : this.getAttribute('data-tooltip_balao') || '',
//             data_translate_tooltip : this.getAttribute('data-translate-tooltip') || '',
//             data_translate_op      : this.getAttribute('data-translate_op') || '',
//             placeholder            : this.getAttribute('placeholder') || '',
//             icon_edicao            : this.getAttribute('icon-edicao') || '',
//             is_required            : this.hasAttribute('required') ? 'required' : ''
//         }
        
//         this.shadowRoot.innerHTML = `            
//             <style>
//                 @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
//             </style>
            
//             ${this.renderControl(props)}        
           
//         `;
        
//     }


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





}
customElements.define('base-input', Base_Field);

/* Retirado pois é adicionado dinamicamente */
/* <button type="button" class="edit-button">
    <i class="${props.icon_edicao}"></i>
</button>   */