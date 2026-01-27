import { Base_Field } from '../../base/Base_Field.js';

class Telefone_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_telefone    : "Telefone", 
            ph_telefone     : "Adicione um número de telefone",
            tp_lbl_telefone : "Contato com a instituião (Escola)",
            erro            : "Por favor, digite um número de telefone valido"       
        },

        es: {
            lbl_telefone    : "Teléfono", 
            ph_telefone     : "Agregar un número de teléfono",
            tp_lbl_telefone : "Contactar con la institución (Escuela)",
            erro            : "Por favor, introduzca un número de teléfono válido."
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
        return this.validarTelefone(); 
    }

    async configurarValidacao() {
        const input = this.control;  
        if (input) {
            input.addEventListener('blur', () => this.validarTelefone());
            input.addEventListener('input', () => this.limparEstado()); 
        }
    }

    async validarTelefone() {
        const telefone = document.getElementById('telefone');
        const valor = telefone.value.trim();
    
        // (00) 0000-0000 -> 14 caracteres
        // (00) 00000-0000 -> 15 caracteres
        if (valor.length > 0 && valor.length < 14) {
            marcarErro(telefone, "Telefone incompleto.");
            return false;
        }
    
        marcarSucesso(telefone);
    
        return true;
    }
    
}

// 6. Definição do Web Component
customElements.define('telefone-field', Telefone_Field);