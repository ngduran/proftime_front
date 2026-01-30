import { Base_Field } from "../../base/Base_Field.js";

class Cidade_Field extends Base_Field {
  
    static i18n = {
        pt: {
            lbl_cidade    : "Cidade",
            ph_cidade     : "Digite 3 letras iniciais",
            tp_lbl_cidade : "Digite 3 letras iniciais do nome da cidade para filtrar",
            erro_1        : "O nome contém caracteres inválidos",
            erro_2        : "O nome deve ter pelo menos 3 caracteres",
            erro_3        : "Este campo é obrigatório" 
        },

        es: {
            lbl_cidade    : "Ciudad",
            ph_cidade     : "Escriba las primeras 3 letras.",
            tp_lbl_cidade : "Introduzca las primeras 3 letras del nombre de la ciudad para filtrar.",
            erro_1        : "El nombre contiene caracteres no válidos.",
            erro_2        : "El nombre debe tener al menos 3 caracteres.",
            erro_3        : "Este campo es obligatorio."  
        }
    };

    connectedCallback() {
        super.connectedCallback();      
    }

    renderControl(p) {       
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="text" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>
                    ${p.icon_edicao ? `
                        <button type="button" class="edit-button">
                            <i class="${p.icon_edicao}"></i>
                        </button>
                        ` : ''}    
                </div>
        `;        
    }

    validar() {
        return this.validarNome(); 
    }


    validarNome() {
    
        const input = this.control; // Usa o getter da Base_Field
        if (!input) return;

        // Formatação: Primeira letra de cada palavra em maiúscula
        input.value = input.value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
        
        const valor = input.value.trim();
        const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;

        if (!regexNome.test(valor)) {
            this.marcarErro("O nome deve conter apenas letras.");
            return false;
        }

        if (valor.length < 3) {
            this.marcarErro("O nome deve ter pelo menos 3 letras.");
            return false;
        }

        this.marcarSucesso(); // Não precisa passar nada!
        return true;
    }

    // No Cidade_Field.js
    // Esta função agora é apenas um "filtro" lógico, sem pendurar eventos novos
    processarBusca(valor) {
        // 1. REGRA: Só dispara a partir de 3 caracteres
        if (valor.length >= 3) {
            
            // 2. Rastreamento de Log (conforme padrão que definimos)
            console.log(
                `%c[SEARCH-EMIT] %c${this.id.toUpperCase()} %c-> cidade-digitada | Termo: %c"${valor}"`,
                "color: #007bff; font-weight: bold;", 
                "color: #6f42c1; font-weight: bold;", 
                "color: #666;",                       
                "color: #28a745; font-weight: bold;"
            );

            // 3. Disparo do Evento Customizado
            this.dispatchEvent(new CustomEvent('filtro-cidade-digitado', {
                detail: { 
                    termoBusca: valor, 
                    scope: this.scope // Usa o getter da Base_Field
                },
                bubbles: true,
                composed: true
            }));
        }
    }
       
}

customElements.define('cidade-field', Cidade_Field);