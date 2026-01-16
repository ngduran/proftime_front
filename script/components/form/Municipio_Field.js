import { Base_Field } from '../base/Base_Field.js';


class Municipio_Field extends Base_Field {
   
    constructor() {
        super();               
    }
   
    connectedCallback() {
         super.render();
         super.setupBase();
    }

    renderControl(p) {       
        return `<select id="main-select" name="${p.name}" autocomplete="off" ${p.is_required}>
                    <option value="" data-translate="${p.data_translate_op}">Selecione o estado</option>
                </select>`;      
    }

}

customElements.define('municipio-field', Municipio_Field);