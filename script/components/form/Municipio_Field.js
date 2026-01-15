import { Base_Select } from '../base/Base_Select.js';


class Municipio_Field extends Base_Select {
   
    constructor() {
        super();               
    }
   
    connectedCallback() {
         super.render();
         super.setupBase();
    }

}

customElements.define('municipio-select', Municipio_Field);