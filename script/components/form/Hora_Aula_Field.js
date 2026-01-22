import { Base_Field } from "../base/Base_Field.js";

class Hora_Aula_Field extends Base_Field {

    constructor() {
        super();
    }

    connectedCallback() {
        super.render();
        super.setupBase();
        super.initTooltip();
        super.initEdition();
        this.configurarValidacao();
    }

    renderControl(p) {
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="time" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>
                    <button type="button" class="edit-button">
                        <i class="${p.icon_edicao}"></i>
                    </button>
                </div>
        `;
    }

    async configurarValidacao() {
        const input = this.shadowRoot.querySelector(".field-input");    
        
        if (input) {
            input.addEventListener('blur', () => {
                this.validarCampoTime();
            });
        }
       
    }



    /**
     * Valida o campo do tipo time do próprio componente
     * @param {string} mensagemErro - A mensagem customizada para o erro
     * @returns {boolean}
     */
    validarCampoTime() {
        const input = this.control; // O getter já busca o .field-time ou .field-input

        if (!input) return false;

        const valor = input.value;

        // Campos do tipo time retornam "" se vazios. 
        // Adicionamos a checagem de "00:00" conforme sua necessidade.
        if (!valor || valor.trim() === "" || valor === "00:00") {
            this.marcarErro("Horário inválido"); // Não precisa passar o elemento!
            return false;
        }

        this.marcarSucesso(); // Limpa erros e aplica classe 'valid'
        return true;
    }
}

customElements.define('hora-aula-field', Hora_Aula_Field);