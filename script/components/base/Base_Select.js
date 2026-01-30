import { Base_Field } from './Base_Field.js';

export class Base_Select extends Base_Field {

    constructor() {
        super();
    }

    connectedCallback() {
        // 1. Executa o ciclo da Base_Field (Render e Tradução)
        super.connectedCallback(); 

        // 2. Inicializa os Managers (Tooltip e Edição)
        this.initTooltip();
        //this.initEdition();

        //3. Configura o evento de validação automático para o Select
        this.setupEventListeners();
    }

    /**
     * SOBREESCRITA: Define o HTML específico do Select.
     * O Base_Field chamará este método dentro do render().
     */
    renderControl(p) {                
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <select id="${p.id}" name="${p.name}" class="field-select"
                        autocomplete="off" ${p.is_required}>
                        <option value="" data-translate="${p.data_translate_op}">${p.placeholder}</option>
                    
                        ${ this.renderOptions(p) }
                    
                    </select>                    
                </div>
        `;     
    }

    /**
     * MÉDITO NOVO: Responsável por gerar as tags <option>.
     * Pode ser sobrescrito pelos componentes filhos para buscar dados de APIs.
     */
    renderOptions(p) {
        // 1. Verifica se a classe filha (ex: Instituicao_Select) definiu a lista
        const listaParaRenderizar = this.optionsList || [];

        // Log de início do processo
        console.log(
            `%c[OPTIONS-PROCESS] %c${this.id.toUpperCase()} %cgerando lista de opções...`,
            "color: #17a2b8; font-weight: bold;", 
            "color: #000; font-weight: bold;",
            "color: #666;"
        );

        // 2. Se houver uma lista de objetos, ela gera as options automaticamente
        if (listaParaRenderizar.length > 0) {
            console.log(
                `%c[OPTIONS-DATA] %c${this.id.toUpperCase()} %cusando optionsList interna. Itens: %c${listaParaRenderizar.length}`,
                "color: #28a745; font-weight: bold;", 
                "color: #000; font-weight: bold;",
                "color: #666;",
                "background: #28a745; color: #fff; padding: 0 5px; border-radius: 3px;"
            );

            return listaParaRenderizar.map(item => 
                `<option value="${item.id || item.sigla}">${item.nome}</option>`
            ).join('');
        }

        // 3. Fallback: Caso as opções venham via atributo HTML (string separada por vírgula)
        if (p.options) {
            console.log(
                `%c[OPTIONS-FALLBACK] %c${this.id.toUpperCase()} %cusando string de atributo 'options'.`,
                "color: #ffc107; font-weight: bold;", 
                "color: #000; font-weight: bold;",
                "color: #666;"
            );

            return p.options.split(',').map(opt => {
                const [value, text] = opt.includes(':') ? opt.split(':') : [opt, opt];
                return `<option value="${value.trim()}">${text.trim()}</option>`;
            }).join('');
        }

        // Caso não encontre nenhuma fonte de dados
        console.warn(
            `%c[OPTIONS-EMPTY] %c${this.id.toUpperCase()} %cNenhuma opção encontrada para renderizar.`,
            "color: #dc3545; font-weight: bold;", 
            "color: #000; font-weight: bold;",
            "color: #666;"
        );

        return '';
    }

    /**
     * SOBREESCRITA: Ajusta o getter para focar no elemento select.
     */
    get control() {
        return this.shadowRoot.querySelector('.field-select');
    }

    /**
     * SOBREESCRITA: Garante que o valor retornado seja o selecionado.
     */
    get value() {
        return this.control?.value || '';
    }

    // 4. EVENTOS E COMPORTAMENTO DE INTERFACE
    setupEventListeners() {
       
        const control = this.control; // Usa o getter genérico da Base_Field
        if (!control) {
            console.error(
            `%c[ERRO] %cControle não encontrado para: ${this.id}`,
            "color: white; background: red; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
            "color: red;"
        );
            return;
        }

        // console.log(
        //     `%c[SETUP] %c${this.id} %c[Scope: ${this.scope}]`,
        //     "color: #007bff; font-weight: bold;", 
        //     "color: #333; font-weight: bold;",
        //     "color: #666; font-style: italic;"
        // );

        // 1. Evento de Mudança (Lógica de Negócio + Validação)
        control.addEventListener('change', (e) => {
            console.log(
                `%c[CHANGE] %c${this.id}: %c"${e.target.value}"`,
                "color: #28a745; font-weight: bold;", 
                "color: #333;",
                "color: #555; font-style: italic;"
            );
            this.validarSelect(); // Chama o método de validação genérico
            //this.emitirMudanca(e.target.value);
        });

        // 2. Evento de Perda de Foco (Validação de interface)
        control.addEventListener('blur', () => {
            console.log(
                `%c[BLUR] %cSaindo de: ${this.id}`, 
                "color: #fd7e14; font-weight: bold;", "color: #333;"
            );
            this.validarSelect();
        });

        // 3. Evento de Entrada (Limpa erros enquanto o usuário tenta corrigir)
        control.addEventListener('input', () => {
            // Logamos apenas que está digitando para não inundar o console com cada letra, 
            // mas confirmamos que o estado de erro está sendo limpo.
            if (this.classList.contains('error')) {
                // console.log(
                //     `%c[LIMPAR] %cUsuário corrigindo erro em: ${this.id}`,
                //     "color: #6f42c1; font-weight: bold;",
                //     "color: #333;"
                // );
            }
            this.limparEstado();
        });
    }
   
    validarSelect() {
        
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        const select = this.control;
        
        // RASTREAMENTO DE VALIDAÇÃO
        console.log(`%c[VALIDATE] %c${this.id}: Valor capturado -> "${select?.value}"`, "color: #e83e8c; font-weight: bold;", "color: #333;");

        if (!select) {
            console.error(`[ERROR] ${this.id}: Elemento select não encontrado.`);
            return false;
        }

        const valor = select.value;

        // Se não houver valor ou for string vazia (comum na opção "Selecione...")
        // Ajuste: Verifique se o valor não é a string do placeholder traduzido
        if (!valor || valor.trim() === "" || valor === "null" || valor === "undefined") {
            this.marcarErro(this.constructor.i18n[official_language].erro);
            return false;
        }

        this.marcarSucesso();
        return true;
    }

















}

// 8. DEFINIÇÃO DO WEB COMPONENT
customElements.define('base-select', Base_Select);