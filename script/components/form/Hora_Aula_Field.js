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
    }

    renderControl(p) {
        return `<div>
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
}

customElements.define('hora-aula-field', Hora_Aula_Field);