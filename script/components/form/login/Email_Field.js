import { applyTranslations } from '../../utils/i18n/login_i18n.js';
import { Base_Field } from '../../base/Base_Field.js';

class Email_Field extends Base_Field {
    constructor() {
        super();
    }
    
    // connectedCallback() {
    //     super.render(); 

    //     // Tradução inicial na carga do componente
    //     applyTranslations(this.shadowRoot);

    //     // Escuta a mudança global de idioma
    //     window.addEventListener('languageChanged', () => {
    //         applyTranslations(this.shadowRoot);            
    //     });

    //     super.setupBase();
    //     super.initTooltip();
    //     //super.initEdition();
    //     this.configurarValidacao();
    // }

    connectedCallback() {
        super.render(); 

        // 1. Define a função do listener como uma referência fixa
        // O .bind(this) é necessário para que o 'this' dentro da função continue sendo o componente
        this._handleLanguageChange = () => applyTranslations(this.shadowRoot);

        // Tradução inicial na carga
        applyTranslations(this.shadowRoot);

        // 2. Escuta o evento global usando a referência salva
        window.addEventListener('languageChanged', this._handleLanguageChange);

        super.setupBase();
        super.initTooltip();
        this.configurarValidacao();
    }

    // 3. O "faxineiro" do componente
    disconnectedCallback() {
        // Remove o listener exatamente com a mesma referência criada no connected
        // Isso evita que o componente continue "vivo" na memória após ser removido da tela
        window.removeEventListener('languageChanged', this._handleLanguageChange);
        
        console.log("Listener de idioma removido para evitar memory leak.");
    }



    renderControl(p) {       
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="text" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>                    
                </div>
        `;        
    }

    // Sobreescrevendo o validar da Base_Field
    /** @override */
    async validar() {        
        return this.validarEmail(); 
    }

    async configurarValidacao() {
        // Usamos o getter 'control' da Base_Field para pegar o input
        const input = this.control; 
        
        if (input) {
            // Valida quando o usuário sai do campo
            input.addEventListener('blur', () => {
                this.validarEmail();
            });

            // Opcional: Limpa o erro enquanto o usuário digita
            input.addEventListener('input', () => {
                this.limparEstado(); 
            });
        }
    }

    validarEmail() {    
        // Pega o valor diretamente do componente
        const valor = this.value; 
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(valor)) {
            // Usa o método da Base_Field que já lida com as classes CSS de erro
            this.marcarErro("Por favor, insira um e-mail válido.");
            return false;
        }

        // Usa o método da Base_Field para mostrar o estado verde/válido
        this.marcarSucesso();
        return true;
    }
        
}

customElements.define('email-field', Email_Field);