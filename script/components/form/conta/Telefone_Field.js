import { Base_Field } from '../../base/Base_Field.js';

class Telefone_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_telefone    : "Telefone", 
            ph_telefone     : "Adicione um número de telefone",
            tp_lbl_telefone : "Contato com a instituião (Escola)",
            erro            : "Por favor, digite um número de telefone válido"       
        },

        es: {
            lbl_telefone    : "Teléfono", 
            ph_telefone     : "Agregar un número de teléfono",
            tp_lbl_telefone : "Contactar con la institución (Escuela)",
            erro            : "Por favor, introduzca un número de teléfono válido."
        }
    };
 
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.connectedCallback();
        
        // Listener específico para a máscara (não delegamos 'input' para evitar lentidão global)
        this.control?.addEventListener('input', (e) => {
            e.target.value = this.aplicarMascaraTelefone(e.target.value);
            this.limparEstado(); 
        });
    }
  
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
                    <input type        ="text" 
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

    // 3. Lógica de Validação com Early Return
    /** @override */
    validar() {
        const lang = sessionStorage.getItem('official_language') || 'pt';
        const dict = Telefone_Field.i18n[lang] || Telefone_Field.i18n['pt'];
        const valor = this.value;
        const valorLimpo = valor.replace(/\D/g, "");

        // REGRA 1: Vazio / Obrigatório
        if (!valorLimpo) {            
            this.marcarErro(dict.erro);
            return false;            
        }

        // REGRA 2: Tamanho Mínimo (DDD + 8 ou 9 dígitos)
        // Mínimo 10 dígitos: (11) 4444-4444
        if (valorLimpo.length < 10) {
            this.marcarErro(dict.erro);
            return false;
        }

        this.marcarSucesso();
        return true;
    }

    aplicarMascaraTelefone(valor) {
        if (!valor) return "";
        valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
        valor = valor.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses no DDD
        
        // Lógica dinâmica para o hífen:
        if (valor.length > 13) {
            // Celular: (00) 00000-0000 (14 ou 15 caracteres com máscara)
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        } else {
            // Fixo: (00) 0000-0000
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        }
        
        return valor.substring(0, 15); // Limita ao tamanho máximo de celular
    }
    
}

// 6. Definição do Web Component
customElements.define('telefone-field', Telefone_Field);