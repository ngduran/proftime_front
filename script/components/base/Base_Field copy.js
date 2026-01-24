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

     // Retorna o elemento de controle interno (input, select ou textarea)
    get control() {
        return this.shadowRoot.querySelector('.field-input, .field-select, .field-time');
    }

    // Retorna o container para mensagens de erro
    get container() {
        return this.shadowRoot.querySelector('.campo');        
    }
    
    limparEstado() {
        const input = this.control;
        const container = this.container;

        if (!input || !container) return;

        // Remove as classes de erro e sucesso, voltando ao CSS base
        input.classList.remove("invalid", "valid");
        container.classList.remove('has-error');

        // Remove a mensagem de texto de erro se ela existir
        const msgErro = container.querySelector('.error-message');
        if (msgErro) msgErro.remove();
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