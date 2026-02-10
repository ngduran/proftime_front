import { field_style } from '../css/Field_Styles.js';
import { TooltipManager } from '../utils/TooltipManager.js';
import { EditionManager } from '../utils/EditionManager.js';

export class Base_Field extends HTMLElement {
    
    // 1. INICIALIZAÇÃO
    constructor() {
        
        super();

        if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
        }

        this.shadowRoot.adoptedStyleSheets = [field_style];       
        
    }

    // 2. CICLO DE VIDA (LIFECYCLE)   
    // No connectedCallback, registramos os ouvintes UMA ÚNICA VEZ no shadowRoot
    connectedCallback() {
        // Escutas Globais
        window.addEventListener('languageChanged', this._handleLanguageChange);
        
        // Escutas Delegadas (Input, Blur e Click)
        // 1. OUVINTE MESTRE (Delegação)
        // 'input' limpa o erro enquanto digita
        // 'blur' e 'change' disparam a validação final
        this.shadowRoot.addEventListener('input', this._handleDelegatedEvent);
        this.shadowRoot.addEventListener('blur', this._handleDelegatedEvent, true);
        this.shadowRoot.addEventListener('change', this._handleDelegatedEvent);

        
        this.render(); 

        queueMicrotask(() => {
            this.translate(); 
            // Estes inits agora apenas configuram o "vigia" no shadowRoot uma única vez
            TooltipManager.init(this.shadowRoot);
            EditionManager.init(this.shadowRoot);
        });
    }

    disconnectedCallback() {         
        window.removeEventListener('languageChanged', this._handleLanguageChange);
        // Boa prática: remover os ouvintes do shadowRoot também
        this.shadowRoot.removeEventListener('change', this._handleDelegatedEvent);
        this.shadowRoot.removeEventListener('blur', this._handleDelegatedEvent, true);
    }
   
    // 3. RENDERIZAÇÃO
    async render() {

        const props = {
            is_required: this.hasAttribute('required') ? 'required' : ''
        };
        
        for (let attr of this.attributes) {
            const propName = attr.name.replace(/-/g, '_'); 
            props[propName] = attr.value;            
        }

        const fontAwesome = `<style>
                                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
                            </style>`;

        this.shadowRoot.innerHTML = `            
            
            ${fontAwesome}    

            ${this.renderControl(props)}           
        `;     
        
        this.translate();

    }

    renderControl(p) { return ``; }

    // Handler central que decide o que fazer dependendo do elemento que disparou o evento
    // Handlers como Arrow Functions para garantir o 'this' correto automaticamente
    _handleLanguageChange = (e) => {
        const novoIdioma = e.detail?.language || e.detail?.lang || e.detail;
        if (novoIdioma) {
            sessionStorage.setItem('official_language', novoIdioma);
            this.translate();
        }
    }

    // _handleDelegatedEvent = (event) => {
    //     const target = event.target;

    //     // Se o usuário está digitando, limpamos o estado de erro
    //     if (event.type === 'input') {
    //         this.limparEstado();
    //     }
        
    //     // Só executa se o filho tiver definido essa função específica
    //     if (typeof this.processarBusca === 'function') {
    //         this.processarBusca(target.value);
    //         return;
    //     }
        

    //     // O matches garante que só validamos se o alvo for um dos nossos campos
    //     if (target.matches('.field-input, .field-select, .field-time')) {
    //         console.log(`%c[DELEGATED-${event.type.toUpperCase()}] %c${this.id}`, "color: #28a745;");
    //         this.validar();
    //     }
    // }

    _handleDelegatedEvent = (event) => {
        const target = event.target;

        // 1. FLUXO DE DIGITAÇÃO (Input)
        if (event.type === 'input') {
            this.limparEstado();
            // A busca só deve rodar no input
            if (typeof this.processarBusca === 'function') {
                this.processarBusca(target.value);
            }
            return; // No input, paramos por aqui
        }

        // 2. FLUXO DE MUDANÇA (Change - Selects)
        if (event.type === 'change') {
            // Log para confirmar que a Base capturou a mudança
            //console.log(`%c[DELEGATED-CHANGE] %c${this.id}`, "color: #28a745; font-weight: bold;");
            
            this.validar(); // Valida o select

            // Executa a emissão de mudança APENAS se o componente tiver a função e o atributo
            if (this.hasAttribute('emit-change') && typeof this.emitirMudanca === 'function') {
                this.emitirMudanca(target.value);
            }
        }

        // 3. FLUXO DE SAÍDA (Blur)
        if (event.type === 'blur') {
            if (target.matches('.field-input, .field-select, .field-time')) {
                this.validar();
            }
        }
    }



    translate() {
        const lang = sessionStorage.getItem('official_language') || 'pt';
        const dicionario = this.constructor.i18n?.[lang];

        if (!dicionario) return;

        // 1. Mapeamento declarativo de alvos (Elemento -> Chave -> Onde aplicar)
        const alvos = [
            { 
                el: this.shadowRoot.querySelector('.field-label'), 
                attr: 'data-translate', 
                target: 'innerText' 
            },
            { 
                el: this.shadowRoot.querySelector('.field-input'), 
                attr: 'data-translate', 
                target: 'placeholder' 
            },
            { 
                el: this.shadowRoot.querySelector('.field-select option[value=""]'), 
                attr: 'data-translate', 
                target: 'innerText' 
            },
            { 
                el: this.shadowRoot.querySelector('.info-question'), 
                attr: 'data-translate', 
                target: 'data-tooltip', 
                isAttribute: true 
            }
        ];

        // 2. Execução simplificada da tradução
        alvos.forEach(({ el, attr, target, isAttribute }) => {
            if (!el) return;

            const chave = el.getAttribute(attr);
            const traducao = dicionario[chave];

            if (chave && traducao) {
                if (isAttribute) {
                    el.setAttribute(target, traducao);
                } else {
                    el[target] = traducao;
                }
            }
        });

        // 3. Atualização de estado de erro (se houver mensagem visível)
        const msgErroExistente = this.shadowRoot.querySelector('.error-message');
        if (msgErroExistente && msgErroExistente.innerText !== "") {
            this.validar(); 
        }
    }
   
    // 5. GETTERS DE ACESSO
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

    // 6. VALIDAÇÃO E ESTADO VISUAL  
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

    // 7. MANAGERS E POSICIONAMENTO
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
    
    inspectEvents() {        
        
        // 1. Identifica os eventos delegados no ShadowRoot
        const masterEvents = ['input', 'blur', 'change']; // Os que você definiu no connectedCallback
        
        console.log("%cOuvintes Mestres (ShadowRoot):", "font-weight: bold; color: #007bff;");
        masterEvents.forEach(evt => {
            console.log(` - %c${evt}%c: Gerenciado por _handleDelegatedEvent`, "color: #28a745; font-weight: bold;", "color: #666;");
        });

        // 2. Identifica escutas globais
        console.log("%cEscutas Globais (window):", "font-weight: bold; color: #007bff;");
        console.log(" - %clanguageChanged%c: Gerenciado por _handleLanguageChange", "color: #28a745; font-weight: bold;", "color: #666;");

        // 3. Verifica se o componente é 'searchable' (Busca ativa)
        if (this.hasAttribute('searchable')) {
            console.log("%cFluxos Customizados:", "font-weight: bold; color: #007bff;");
            console.log(" - %cBusca Ativa%c: Dispara 'filtro-cidade-digitado' (min: 3 chars)", "color: #fd7e14; font-weight: bold;", "color: #666;");
        }

        console.groupEnd();
    }
}

// 8. DEFINIÇÃO DO WEB COMPONENT
customElements.define('base-input', Base_Field);