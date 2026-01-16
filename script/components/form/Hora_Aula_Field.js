import { Base_Field } from "../base/Base_Field.js";

class Hora_Aula_Field extends Base_Field {

    constructor() {
        super();
    }

    connectedCallback() {
        super.render();
        super.setupBase();
    }

    renderControl(p) {      //trocado tipo para time - hora ao inves de texto 
        return `<input type="time" id="${p.id}" name="${p.name}" data-translate="${p.data_translate_ph}" 
                    placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                </input>`;        
    }
}

customElements.define('hora-aula-field', Hora_Aula_Field);