import { field_style } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';
import { EditionManager } from '../utils/EditionManager.js';
import { applyTranslations } from '../utils/i18n/login_i18n.js';

export class Base_Field extends HTMLElement {
    
    constructor() {
        
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.adoptedStyleSheets = [field_style];
                
        this._handleLanguageChange = (e) => {
            const novoIdioma = e.detail?.lang || e.detail;
            //console.log(`%c [AÇÃO] <${this.tagName.toLowerCase()}> traduzindo para: ${novoIdioma}`, "background: #27ae60; color: #fff");
            applyTranslations(this.shadowRoot);           
        };
    }

    connectedCallback() {
        //console.log(`%c [Receptor] Ativando ouvido em: <${this.tagName.toLowerCase()}>`, "color: #9b59b6");        
        window.addEventListener('languageChanged', this._handleLanguageChange);
        
        // O render() já chama o applyTranslations internamente via queueMicrotask
        this.render(); 
    }

    disconnectedCallback() {        
        window.removeEventListener('languageChanged', this._handleLanguageChange);
        //console.log(`%c [Faxina] Ouvido removido de: <${this.tagName.toLowerCase()}>`, "color: #e74c3c");
    }
   
    setupBase() { }
    
    initTooltip() {
        TooltipManager.init(this.shadowRoot);        
    }

    initEdition() {
        EditionManager.init(this.shadowRoot);
    }

    renderControl(p) { return ``; }

    get value() {
        const control = this.shadowRoot.querySelector('input, select, textarea');
        return control ? control.value : '';
    }

    get control() {
        return this.shadowRoot.querySelector('.field-input, .field-select, .field-time');
    }

    get container() {
        return this.shadowRoot.querySelector('.campo');        
    }
    
    limparEstado() {
        const input = this.control;
        const container = this.container;
        if (!input || !container) return;

        input.classList.remove("invalid", "valid");
        container.classList.remove('has-error');

        const msgErro = container.querySelector('.error-message');
        if (msgErro) msgErro.remove();
    }

    validar() {
        if (this.shadowRoot && this.shadowRoot.querySelector('select')) {
            return this.validarSelect(); 
        }
        if (this.control && this.control.type === 'time') {
            return this.validarCampoTime("Selecione uma hora válida");
        }
        return this.validarNome(); 
    }

    async render() {
        const props = {
            is_required: this.hasAttribute('required') ? 'required' : ''
        };
        
        //console.log(`%c >>> Lendo atributos de: <${this.tagName.toLowerCase()}>`, 'color: blue; font-weight: bold;');
        for (let attr of this.attributes) {
            const propName = attr.name.replace(/-/g, '_'); 
            props[propName] = attr.value;            
        }
        
        this.shadowRoot.innerHTML = `            
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>
            
            ${this.renderControl(props)}           
        `;
      
        queueMicrotask(() => {
            applyTranslations(this.shadowRoot);
        });

    }

    marcarErro(mensagem) {
        const input = this.control; 
        const container = this.container; 

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

    /**
     * Captura a hierarquia de containers e a posição geométrica exata do elemento.
     * @returns {Object} Dados de estrutura e coordenadas (Relativas ao container).
     */
    getContainerInfo() {
        // 1. Busca os ancestrais
        const fieldContainer = this.closest('.field-container');
        if (!fieldContainer) return { erro: "Fora de um .field-container" };

        const fieldGroup = this.closest('.field-group');

        // 2. Captura Retângulos (Bounding Box)
        const rectElem = this.getBoundingClientRect();
        const rectCont = fieldContainer.getBoundingClientRect();

        // 3. Mapeia Grupos
        const grupos = Array.from(fieldContainer.querySelectorAll('.field-group'));

        // 4. Retorno com Posições Iniciais e Finais (Cálculo Relativo)
        return {
            dimensoesContainer: {
                largura: rectCont.width,
                altura: rectCont.height,
                centroX: rectCont.width / 2 // O meio exato horizontal do container
            },
            estrutura: {
                totalGrupos: grupos.length,
                minhaClasseGrupo: fieldGroup?.className || null
            },
            posicaoHorizontal: {
                inicio: rectElem.left - rectCont.left,
                fim: rectElem.right - rectCont.left,
                largura: rectElem.width
            },
            posicaoVertical: {
                inicio: rectElem.top - rectCont.top,
                fim: rectElem.bottom - rectCont.top,
                altura: rectElem.height
            }
        };
    }
}

customElements.define('base-input', Base_Field);