import { Base_Input } from "../base/Base_Input.js";

class Hora_Aula_Time extends Base_Input {

    constructor() {
        super();
    }

    connectedCallback() {
        super.render();
        super.setupBase();
    }
}

customElements.define('hora-aula-time', Hora_Aula_Time);