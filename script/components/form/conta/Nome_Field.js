import { Base_Field } from '../../base/Base_Field.js';

class Nome_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_nome    : "Nome", 
            ph_nome     : "Digite seu nome completo",
            tp_lbl_nome : "Utilizado para sua identificação nos sistema",
            erro_1      : "O nome deve conter apenas letras.",       
            erro_2      : "O nome deve ter pelo menos 3 letras."       
        },

        es: {
            lbl_nome    : "Nombre", 
            ph_nome     : "Introduzca su nombre completo.",
            tp_lbl_nome : "Se utiliza para su identificación en el sistema.",
            erro_1      : "El nombre debe contener sólo letras.",
            erro_2      : "El nombre debe tener al menos 3 letras."
        }
    };

    // 2. Inicialização
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.connectedCallback();
        super.initTooltip();
        this.configurarValidacao();
    }

    // 4. Renderização
    renderControl(p) {       
        return `<div class="campo">
                    <label  class          ="field-label"  
                            for            ="${p.id}" 
                            data-translate ="${p.data_translate_label}">
                            ${p.label}
                    </label>
                    <i  class          ="${p.icon_question}" 
                        data-tooltip   ="${p.data_tooltip_balao}" 
                        data-translate ="${p.data_translate_tooltip}">
                    </i>
                    <input type        ="password" 
                        id             ="${p.id}" 
                        name           ="${p.name}" 
                        class          ="field-input" 
                        data-translate ="${p.data_translate_ph}" 
                        placeholder    ="${p.placeholder}" 
                        autocomplete   ="off" 
                        ${p.is_required}>
                    </input>                    
                </div>
        `;        
    }

    // 5. Métodos de Validação
     /** @override */
    validar() {
        return this.validarNome(); 
    }

    async configurarValidacao() {
        const input = this.control;  
        if (input) {
            input.addEventListener('blur', () => this.validarNome());
            input.addEventListener('input', () => this.limparEstado()); 
        }
    }

    async validarNome() {  
        const input = this.control; // Usa o getter da Base_Field
        if (!input) return;

        // Formatação: Primeira letra de cada palavra em maiúscula
        input.value = input.value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
        
        const valor = input.value.trim();
        const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;

        if (!regexNome.test(valor)) {
            const mensagem = Email_Field.i18n[official_language].erro_1;
            this.marcarErro( mensagem );
            return false;
        }

        if (valor.length < 3) {
            const mensagem = Email_Field.i18n[official_language].erro_2;
            this.marcarErro( mensagem );
            return false;
        }

        this.marcarSucesso(); // Não precisa passar nada!
        return true;
    }

}

// 6. Definição do Web Component
customElements.define('nome-field', Nome_Field);