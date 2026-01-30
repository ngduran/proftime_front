import { Base_Select } from "../../base/Base_Select.js";

class Turno_Select extends Base_Select {

    static i18n = {
        pt: {
            lbl_turno    : "Turno",           
            ph_turno_op0 : "Turno",
            tp_lbl_turno : "Turno que leciona na instituição",
            erro         : "Selecione um turno"       
        },

        es: {
            lbl_turno    : "Cambio",
            ph_turno_op0 : "Cambio",
            tp_lbl_turno : "Turno que imparte docencia en la institución",
            erro         : "Seleccione un turno."
        }
    };

    optionsList = [
        { id: 1, nome: 'Manhã' },
        { id: 2, nome: 'Tarde' },
        { id: 3, nome: 'Noite' },
    ];

    async connectedCallback() {
        super.connectedCallback();
    }

}

customElements.define('turno-select', Turno_Select);