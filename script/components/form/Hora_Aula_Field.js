import { Base_Time } from "../base/Base_Time.js";

class Hora_Aula_Field extends Base_Time {

    constructor() {
        super();
    }

    connectedCallback() {
        super.render();
        super.setupBase();
    }
}

customElements.define('hora-aula-field', Hora_Aula_Field);