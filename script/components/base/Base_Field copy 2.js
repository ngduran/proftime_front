import { field_style } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';
import { EditionManager } from '../utils/EditionManager.js';
import { applyTranslations } from '../utils/i18n/login_i18n.js';

export class Base_Field extends HTMLElement {
    
    // 1. Inicialização
    constructor() {
        
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.adoptedStyleSheets = [field_style];
                
        this._handleLanguageChange = (e) => {
          
            const novoIdioma = (e.detail && typeof e.detail === 'object') ? e.detail.lang : e.detail;
            console.log(`%c [EVENTO] <${this.tagName.toLowerCase()}> detectou: ${novoIdioma}`, "color: blue; font-weight: bold;");
                
            sessionStorage.setItem('official_language', novoIdioma);

            this.translate();
        };
    }

    // 2. Ciclo de Vida (Lifecycle)
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
   
    // 3. Renderização
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
            // Chamando dicionario externo
            // Nas próximas refatoração pode verificar a remoção
            applyTranslations(this.shadowRoot);
        });

    }

    renderControl(p) { return ``; }

    get control() {
        return this.shadowRoot.querySelector('.field-input, .field-select, .field-time');
    }

    get container() {
        return this.shadowRoot.querySelector('.campo');        
    }

    get value() {
        const control = this.shadowRoot.querySelector('input, select, textarea');
        return control ? control.value : '';
    }

    // 5. Tradução
    // Dentro da classe Base_Field
    translate() {
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        
        // Acessa o i18n da classe filha (Email_Field ou Senha_Field)
        const dicionario = this.constructor.i18n?.[official_language];

        // LOG 1: Verificar se o dicionário da classe filha foi encontrado
        console.log(`%c [TRANSLATE] <${this.tagName.toLowerCase()}> Lendo dicionário (${official_language}):`, 
                "color: #e67e22; font-weight: bold;", dicionario);
        
        if (!dicionario) {
            console.warn(`%c [AVISO] Dicionário não encontrado para o idioma: ${lang}`, "color: orange");
            return;
        }

        // 1. Localiza os elementos no Shadow DOM
        const label = this.shadowRoot.querySelector('.field-label');
        const input = this.shadowRoot.querySelector('.field-input');
        const icon  = this.shadowRoot.querySelector('.info-question');


        // 2. Traduz a LABEL usando a chave do atributo
        if (label) {
            const chave = label.getAttribute('data-translate'); // Ex: "lbl_email"
            if (dicionario[chave]) label.innerText = dicionario[chave];
        } else {
            console.log(`%c [ERRO CHAVE] Chave "${chave}" não existe no i18n de ${official_language}`, "color: red");
        }

        // 3. Traduz o PLACEHOLDER usando a chave do atributo
        if (input) {
            const chave = input.getAttribute('data-translate'); // Ex: "ph_email"
            if (dicionario[chave]) input.placeholder = dicionario[chave];
        } else {
            console.log(`%c [ERRO CHAVE] Chave "${chave}" não existe no i18n de ${official_language}`, "color: red");
        }

        // 4. Traduz o TOOLTIP usando a chave do atributo
        if (icon) {
            const chave = icon.getAttribute('data-translate'); // Ex: "tp_lbl_email"
            if (dicionario[chave]) icon.setAttribute('data-tooltip', dicionario[chave]);
        } else {
            console.log(`%c [ERRO CHAVE] Chave "${chave}" não existe no i18n de ${official_language}`, "color: red");
        }

        // CORREÇÃO PONTUAL: Verifica se o elemento de erro existe no DOM para traduzi-lo
        const msgErroExistente = this.container?.querySelector('.error-message');

        if (msgErroExistente) {         
            console.log(`%c [VALIDAÇÃO] Erro detectado em <${this.tagName.toLowerCase()}>. Traduzindo mensagem...`, "color: #f39c12;");
            this.validar(); 
        }
        




        // // Se o campo estiver em estado de erro, chama a validação específica do filho
        // if (this.container?.classList.contains('error-message')) {         
           
        //     console.log(" -> Possui 'error-message'?", this.container.classList.contains('error-message'));
        //     // Chamamos 'this.validar()', que por polimorfismo executará 
        //     // validarEmail() ou validarForcaSenha() dependendo do filho.
        //     this.validar(); 
        // } else {
        //     console.log(" -> NÃO Possui 'error-message'?", this.container.classList.contains('error-message'));
            
        // }
    }

    // 6. Métodos de Validação e Estado
    validar() {
        if (this.shadowRoot && this.shadowRoot.querySelector('select')) {
            return this.validarSelect(); 
        }
        if (this.control && this.control.type === 'time') {
            return this.validarCampoTime("Selecione uma hora válida");
        }
        return this.validarNome(); 
    }

    limparEstado() {
        const input = this.control;
        const container = this.container;
        if (!input || !container) return;

        input.classList.remove("invalid", "valid");
        container.classList.remove('error-message');

        const msgErro = container.querySelector('.error-message');
        if (msgErro) msgErro.remove();
    }

     marcarErro(mensagem) {
        const input = this.control; 
        const container = this.container; 

        if (!input || !container) return;

        input.classList.remove("valid");
        input.classList.add("invalid");
        //container.classList.add('has-error');
        
        // 1. Adicionamos uma classe de estado ao container para o translate() saber que há erro
        //container.classList.add('is-invalid');

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
        //container.classList.remove('is-invalid');
        const msgErro = container.querySelector('.error-message');
        if (msgErro) msgErro.remove();
    }

    // 7. Utilitários e Inicializadores de Managers
    setupBase() { }
    
    initTooltip() {
        TooltipManager.init(this.shadowRoot);        
    }

    initEdition() {
        EditionManager.init(this.shadowRoot);
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

// 8. Definição do Web Component
customElements.define('base-input', Base_Field);