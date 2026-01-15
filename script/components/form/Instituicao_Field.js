import { Base_Input } from '../base/Base_Input.js';

class Instituicao_Field extends Base_Input {
    constructor() {
        super(); 
    }
    
    connectedCallback() {
        super.render(); 
        super.setupBase();
    }     
}

customElements.define('instituicao-field', Instituicao_Field);