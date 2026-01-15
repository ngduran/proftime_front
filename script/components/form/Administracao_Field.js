import { Base_Select } from "../base/Base_Select.js";

class Administracao_Field extends Base_Select {

    constructor() {
        super();
    }

    connectedCallback() {
        super.render();
        super.setupBase();
    }

}

customElements.define('administracao-field', Administracao_Field);