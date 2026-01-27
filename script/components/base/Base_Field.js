import { field_style } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';
import { EditionManager } from '../utils/EditionManager.js';

// Removida pois agora a tradução é feita pelo próprio componente
// Removida a chamada também na função render
//import { applyTranslations } from '../utils/i18n/login_i18n.js';

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
            sessionStorage.setItem('official_language', novoIdioma);
            this.translate();
        };
    }

    // 2. Ciclo de Vida (Lifecycle)
    connectedCallback() {
        // 1. // Escuta o evento global de troca de idioma e associa à função de tratamento
        window.addEventListener('languageChanged', this._handleLanguageChange);
        
        // 1. Constrói a estrutura visual do componente no DOM
        this.render(); 
        
        // 2. Aplica a tradução inicial baseada no idioma salvo ou padrão
        this.translate(); 
    }

    disconnectedCallback() {        
        window.removeEventListener('languageChanged', this._handleLanguageChange);
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
      
        //Removido pois a chamada agora é feita no próprio componente
        // queueMicrotask(() => {
        //     // Chamando dicionario externo
        //     // Nas próximas refatoração pode verificar a remoção
        //     applyTranslations(this.shadowRoot);
        // });

    }

    renderControl(p) { return ``; }

    // 4. Getters de Acesso
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

    /**
     * Retorna o ID do componente (útil para logs e labels)
     */
    get id() {
        return this.getAttribute('id') || 'sem-id';
    }

    /**
     * Retorna o atributo name do componente
     */
    get name() {
        return this.getAttribute('name') || 'sem name';
    }

    /**
     * Retorna o scope do componente para lógica de negócio (ex: "senha", "confirmar_senha")
     */
    get scope() {
        return this.getAttribute('scope') || 'default';
    }

    // 5. Tradução
    translate() {
        console.log("Foi chamado o translate ao iniciar a página");
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        const dicionario = this.constructor.i18n?.[official_language];
        
        if (!dicionario) {
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
        } 

        // 3. Traduz o PLACEHOLDER usando a chave do atributo
        if (input) {
            const chave = input.getAttribute('data-translate'); // Ex: "ph_email"
            if (dicionario[chave]) input.placeholder = dicionario[chave];
        } 

        // 4. Traduz o TOOLTIP usando a chave do atributo
        if (icon) {
            const chave = icon.getAttribute('data-translate'); // Ex: "tp_lbl_email"
            if (dicionario[chave]) icon.setAttribute('data-tooltip', dicionario[chave]);
        } 

        // CORREÇÃO PONTUAL: Verifica se o elemento de erro existe no DOM para traduzi-lo
        const msgErroExistente = this.container?.querySelector('.error-message');

        if (msgErroExistente) {         
            this.validar(); 
        }
        
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