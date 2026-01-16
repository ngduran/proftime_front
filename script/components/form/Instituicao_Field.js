import { Base_Field } from '../base/Base_Field.js';

class Instituicao_Field extends Base_Field {
    constructor() {
        super();         
    }
    
    connectedCallback() {
        super.render(); 
        super.setupBase();
    }

    renderControl(p) {       
        return `<input type="text" id="${p.id}" name="${p.name}" data-translate="${p.data_translate_ph}" 
                    placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                </input>`;        
    }
        
}

customElements.define('instituicao-field', Instituicao_Field);