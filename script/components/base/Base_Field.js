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
    connectedCallback() {
        // 1. // Escuta o evento global de troca de idioma e associa à função de tratamento
        window.addEventListener('languageChanged', this._handleLanguageChange);
        
        // 1. Constrói a estrutura visual do componente no DOM
        this.render(); 
        
        // 2. Aplica a tradução inicial baseada no idioma salvo ou padrão        
        queueMicrotask(() => {
            console.log(`%c[SYNC] %c${this.id}: Aplicando tradução segura...`, "color: #007bff; font-size: 10px;", "color: #333;");
            this.translate(); 
        });
    }

    disconnectedCallback() {        
        window.removeEventListener('languageChanged', this._handleLanguageChange);
    }
   
    // 3. RENDERIZAÇÃO
    async render() {

        console.log(`%c[RENDER-START] %c${this.id.toUpperCase()}`, "background: #222; color: #bada55; padding: 2px 5px;", "font-weight: bold;");

        const props = {
            is_required: this.hasAttribute('required') ? 'required' : ''
        };
        
        //console.log(`%c >>> Lendo atributos de: <${this.tagName.toLowerCase()}>`, 'color: blue; font-weight: bold;');
        for (let attr of this.attributes) {
            const propName = attr.name.replace(/-/g, '_'); 
            props[propName] = attr.value;            
        }

        console.log(`%c[RENDER-PROPS] %c${this.id.toUpperCase()} %cPropriedades extraídas:`, 
            "color: #17a2b8; font-weight: bold;", "color: #000;", "color: #666;", props);
        
        // RASTREAMENTO 2: O momento exato da destruição do layout
        console.log(`%c[RENDER-DOM] %c${this.id.toUpperCase()} %cReescrevendo innerHTML...`, 
            "color: #fd7e14; font-weight: bold;", "color: #000;", "color: #666;");



        this.shadowRoot.innerHTML = `            
            <style>
                @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css');
            </style>
            
            ${this.renderControl(props)}           
        `;     

        // RASTREAMENTO 3: Verificação de pós-renderização
        // Se o layout quebra aqui, é porque o translate() não foi chamado ou falhou
        console.log(`%c[RENDER-END] %c${this.id.toUpperCase()} %cDOM reconstruído. Aguardando tradução...`, 
            "color: #28a745; font-weight: bold;", "color: #000;", "color: #666;");


        // IMPORTANTE: Para não quebrar o layout, precisamos re-traduzir após cada render
        this.translate();

    }

    renderControl(p) { return ``; }

    // 4. SISTEMA DE TRADUÇÃO (I18N)    
    _handleLanguageChange = (e) => {
        console.log("CHAMOU O HANDLE LANGUAGE CHANGE");
        //const novoIdioma = e.detail?.language || sessionStorage.getItem('official_language');

        const novoIdioma = e.detail?.language || e.detail?.lang || e.detail;

        // 2. Log de Recebimento (Roxo)
        console.log(
            `%c[I18N-RECEIVE] %c${this.id.toUpperCase()} %crecebeu evento. Dados: %c${JSON.stringify(e.detail)}`,
            "background: #6f42c1; color: #fff; font-weight: bold; border-radius: 3px; padding: 0 5px;",
            "color: #000; font-weight: bold;",
            "color: #666;",
            "color: #6f42c1; font-style: italic;"
        );

        if (novoIdioma) {
            // 3. Log de Sucesso na Identificação (Verde)
            console.log(
                `%c[I18N-VALID] %c${this.id.toUpperCase()} %cidentificou idioma: %c${novoIdioma.toUpperCase()}`,
                "color: #28a745; font-weight: bold;",
                "color: #000; font-weight: bold;",
                "color: #666;",
                "background: #28a745; color: #fff; font-weight: bold; padding: 0 5px; border-radius: 3px;"
            );

            sessionStorage.setItem('official_language', novoIdioma);
            this.translate();
        } else {
            // 4. Log de Erro (Vermelho)
            console.error(
                `%c[I18N-ERROR] %c${this.id.toUpperCase()}: %cEvento recebido sem idioma definido no e.detail!`,
                "background: #dc3545; color: #fff; font-weight: bold;",
                "color: #000; font-weight: bold;",
                "color: #dc3545;"
            );
        }

        console.log(
            `%c[I18N-RECEIVE] %c${this.id.toUpperCase()} %crecebeu evento. Idioma detectado: %c${novoIdioma}`,
            "background: #6f42c1; color: #fff; font-weight: bold; padding: 2px 5px;",
            "color: #000; font-weight: bold;",
            "color: #666;",
            "color: #6f42c1; font-weight: bold;"
        );

        //this.translate(); // Chama o método que aplica as novas strings
    };

    translate() {
        console.log("Foi chamado o translate ao iniciar a página");
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        const dicionario = this.constructor.i18n?.[official_language];
        
        console.log(
            `%c[I18N-PROCESS] %c${this.id.toUpperCase()} %cbuscando dicionário para: %c${official_language}`,
            "color: #fd7e14; font-weight: bold;", 
            "color: #000; font-weight: bold;",
            "color: #666;",
            "color: #fd7e14; font-weight: bold;"
        );
        
        if (!dicionario) {
            console.warn(
                `%c[I18N-WARN] %cDicionário NÃO encontrado para '${official_language}' em ${this.tagName}`, 
                "color: orange; font-weight: bold;", "color: #666;"
            );
            return;
        }

        // 1. Localiza os elementos no Shadow DOM
        const label = this.shadowRoot.querySelector('.field-label');
        const input = this.shadowRoot.querySelector('.field-input');
        const icon  = this.shadowRoot.querySelector('.info-question');
        const select = this.shadowRoot.querySelector('.field-select'); 

        // 2. Traduz a LABEL
        if (label) {
            const chave_label = label.getAttribute('data-translate');
            if (chave_label && dicionario[chave_label]) {
                label.innerText = dicionario[chave_label];
            } else {
                console.log(
                    `%c[I18N-MISSING] %cChave de Label não encontrada: %c${chave_label}`, 
                    "color: red;", "color: #333;", "font-weight: bold;"
                );
            }
        }

        // 3. Traduz o PLACEHOLDER (Tratamento para Input ou Select)
        if (input) {
            const chave_input = input.getAttribute('data-translate');
            if (chave_input && dicionario[chave_input]) {
                input.placeholder = dicionario[chave_input];
            } else {
                console.log(
                    `%c[I18N-MISSING] %cChave de Placeholder (Input) não encontrada: %c${chave_input}`, 
                    "color: red;", "color: #333;", "font-weight: bold;"
                );
            }
        } 
        else if (select) {
            const optPlaceholder = select.querySelector('option[value=""]');
            if (optPlaceholder) {
                const chave_select = optPlaceholder.getAttribute('data-translate');
                if (chave_select && dicionario[chave_select]) {
                    optPlaceholder.innerText = dicionario[chave_select];
                } else {
                    console.log(
                        `%c[I18N-MISSING] %cChave de Placeholder (Select) não encontrada: %c${chave_select}`, 
                        "color: red;", "color: #333;", "font-weight: bold;"
                    );
                }
            }
        }

        // 4. Traduz o TOOLTIP
        if (icon) {
            const chave_icon = icon.getAttribute('data-translate');
            if (chave_icon && dicionario[chave_icon]) {
                icon.setAttribute('data-tooltip', dicionario[chave_icon]);
            } 
        } 

        // CORREÇÃO PONTUAL: Verifica se o elemento de erro existe no DOM para traduzi-lo
        const msgErroExistente = this.container?.querySelector('.error-message');
        if (msgErroExistente) {         
            this.validar(); 
        }
    }













































    // translate() {
    //     console.log("Foi chamado o translate ao iniciar a página");
    //     const official_language = sessionStorage.getItem('official_language') || 'pt';
    //     const dicionario = this.constructor.i18n?.[official_language];
        
    //     console.log(
    //         `%c[I18N-PROCESS] %c${this.id.toUpperCase()} %cbuscando dicionário para: %c${official_language}`,
    //         "color: #fd7e14; font-weight: bold;", 
    //         "color: #000; font-weight: bold;",
    //         "color: #666;",
    //         "color: #fd7e14; font-weight: bold;"
    //     );
        
    //     if (!dicionario) {
    //         console.warn(
    //             `%c[I18N-WARN] %cDicionário NÃO encontrado para '${official_language}' 
    //             em ${this.tagName}`, "color: orange; font-weight: bold;", "color: #666;");
    //         return;
    //     }

    //     // 1. Localiza os elementos no Shadow DOM
    //     const label = this.shadowRoot.querySelector('.field-label');
    //     const input = this.shadowRoot.querySelector('.field-input');
    //     const icon  = this.shadowRoot.querySelector('.info-question');
    //     const select = this.shadowRoot.querySelector('.field-select'); // Novo seletor para Select


    //     let chave_label;
    //     let chave_input;
    //     let chave_icon;

    //     // 2. Traduz a LABEL usando a chave do atributo
    //     if (label) {
    //         chave_label = label.getAttribute('data-translate'); // Ex: "lbl_email"
    //         if (dicionario[chave_label]) label.innerText = dicionario[chave_label];
    //     } else {
    //             console.log(
    //                 `%c[I18N-MISSING] %cChave de Label não encontrada: %c${chave_label}`, 
    //                 "color: red;", "color: #333;", "font-weight: bold;");
    //         }

    //     // 3. Traduz o PLACEHOLDER usando a chave do atributo
    //     if (input) {
    //         chave_input = input.getAttribute('data-translate'); // Ex: "ph_email"
    //         if (dicionario[chave_input]) input.placeholder = dicionario[chave_input];
    //     } else {
    //             console.log(
    //                 `%c[I18N-MISSING] %cChave de Placeholder não encontrada: %c${chave_input}`, 
    //                 "color: red;", "color: #333;", "font-weight: bold;");
    //         }

    //     // 4. Traduz o TOOLTIP usando a chave do atributo
    //     if (icon) {
    //         chave_icon = icon.getAttribute('data-translate'); // Ex: "tp_lbl_email"
    //         if (dicionario[chave_icon]) icon.setAttribute('data-tooltip', dicionario[chave_icon]);
    //     } 

    //     // CORREÇÃO PONTUAL: Verifica se o elemento de erro existe no DOM para traduzi-lo
    //     const msgErroExistente = this.container?.querySelector('.error-message');

    //     if (msgErroExistente) {         
    //         this.validar(); 
    //     }
        
    // }

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

    
}

// 8. DEFINIÇÃO DO WEB COMPONENT
customElements.define('base-input', Base_Field);