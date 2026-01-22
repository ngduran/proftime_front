import { applyTranslations } from "../../utils/i18n.js";
import { Base_Field } from "../base/Base_Field.js";

class Administracao_Field extends Base_Field {

    constructor() {
        super();
    }

    connectedCallback() {
        super.render();

        // Tradução inicial na carga do componente
        applyTranslations(this.shadowRoot);

        // Escuta a mudança global de idioma
        window.addEventListener('languageChanged', () => {
            applyTranslations(this.shadowRoot);            
        });

        super.setupBase();
        super.initTooltip();
        super.initEdition();
        this.configurarValidacao();
    }

    renderControl(p) {       
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <select id="${p.id}" name="${p.name}" class="field-select"
                        autocomplete="off" ${p.is_required}>
                        <option value="" data-translate="${p.data_translate_op}">${p.placeholder}</option>

                        <option value="FEDERAL">Federal</option>
                        <option value="ESTADUAL">Estadual</option>
                        <option value="MUNICIPAL">Municipal</option>
                        <option value="PRIVADA">Privada</option>
                        <option value="PUBLICO_PRIVADA">Público Privada</option>
                        <option value="PARTICULAR">Particular</option>
                    </select>
                    <button type="button" class="edit-button">
                        <i class="${p.icon_edicao}"></i>
                    </button>
                </div>
        `;       
    }

    // Utilizado pelo formulário page intituicao.js
    // Sobrescreve o validar do Bae_Field
    validar() {        
        return this.validarSelect(); 
    }


    async configurarValidacao() {
        const input = this.shadowRoot.querySelector(".field-select");    
        
        if (input) {
            input.addEventListener('blur', () => {
                this.validarSelect();
            });
        }
       
    }

    /**
     * Valida o próprio componente select/combobox
     * @param {string} mensagemErro - Mensagem exibida em caso de falha
     * @returns {boolean}
     */
    async validarSelect() {

        const select = this.control;
        
        if (!select) {
            console.error("Elemento select não encontrado internamente.");
            return false;
        }

        const valor = select.value;

        // Se não houver valor ou for string vazia (comum na opção "Selecione...")
        if (!valor || valor.trim() === "") {
            this.marcarErro("Selecione a administração");
            return false;
        }

        this.marcarSucesso();
        return true;
    }



}

customElements.define('administracao-field', Administracao_Field);