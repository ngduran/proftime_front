import { field_style } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';
import { EditionManager } from '../utils/EditionManager.js';
import { applyTranslations } from '../utils/i18n/login_i18n.js'; // Importe o tradutor aqui

export class Base_Field extends HTMLElement {
    
    constructor() {
        super();
        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }       
        this.shadowRoot.adoptedStyleSheets = [field_style];
        
        // Referência estável da função para o EventListener
        // Usamos .bind(this) para que o 'this' dentro da função seja sempre o componente
        this._handleLanguageChange = () => {
            console.log(`Componente ${this.tagName} reagindo à mudança de idioma...`);
            applyTranslations(this.shadowRoot); 
        };
    }

    /**
     * Ciclo de vida: Chamado quando o componente entra no DOM
     */
    connectedCallback() {
        
        console.log(`%c [Receptor] Ativando ouvido em: <${this.tagName.toLowerCase()}>`, "color: #9b59b6");


        // 1. Escuta o evento global de troca de idioma
        window.addEventListener('languageChanged', this._handleLanguageChange = (e) => {

            console.log(`%c [Passo 6] Componente <${this.tagName.toLowerCase()}> recebeu sinal de mudança para: ${e.detail}`, "background: #2ecc71; color: #000; font-weight: bold;");
            console.log(`%c [AÇÃO] O componente <${this.tagName.toLowerCase()}> ouviu o sinal! Traduzindo...`, "background: #27ae60; color: #fff");

            // RASTREIO: Ele vai tentar se traduzir agora?
            console.log(`   -> Chamando applyTranslations para meu próprio ShadowRoot...`);
            
            // --- ESTA LINHA É A QUE ESTAVA FALTANDO ---
            applyTranslations(this.shadowRoot);
        });
    }

    /**
     * Ciclo de vida: Chamado quando o componente sai do DOM (Faxina)
     */
    disconnectedCallback() {
        // 2. Remove o ouvinte para evitar Memory Leaks
        window.removeEventListener('languageChanged', this._handleLanguageChange);
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
        

        console.log(`%c >>> Lendo atributos de: <${this.tagName.toLowerCase()}>`, 'color: blue; font-weight: bold;');


        for (let attr of this.attributes) {
            const propName = attr.name.replace(/-/g, '_'); 
            props[propName] = attr.value;

            // DEBUG: Se o label não traduz, veja se este log mostra a chave correta
            // if (propName.includes('translate')) {
            //     console.log(`Atributo mapeado: ${propName} = ${attr.value}`);
            // }

            // Este log mostra cada atributo saindo do HTML e entrando no objeto 'p' (props)
            //console.log(`   [Mapeamento]: Atributo HTML "${attr.name}" -> Propriedade Objeto "${propName}" = "${attr.value}"`);
        }

        // Verifica se a chave de tradução do label foi capturada
        // if (!props.data_translate_label) {
        //     console.warn(`   [ALERTA]: A propriedade "data_translate_label" não foi encontrada em <${this.tagName.toLowerCase()}>!`);
        // } else {
        //     console.log("A chave foi capturada --> " + props.data_translate_label);
        // }
        
        this.shadowRoot.innerHTML = `            
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>
            
            ${this.renderControl(props)}           
        `;
        
        
        // 3. Tradução imediata após o render
        //applyTranslations(this.shadowRoot);

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
}

customElements.define('base-input', Base_Field);