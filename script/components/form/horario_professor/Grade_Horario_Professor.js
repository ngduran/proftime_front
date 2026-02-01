import { Table_Standard } from "../../base/Table_Standard.js";


export class Grade_Horario_Professor extends Table_Standard {

    async connectedCallback() {
        super.connectedCallback();
    }

}

customElements.define('grade-horario-professor', Grade_Horario_Professor);