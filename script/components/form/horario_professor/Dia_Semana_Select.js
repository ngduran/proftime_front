import { Base_Select } from "../../base/Base_Select.js";

class Dia_Semana_Select extends Base_Select {

    static i18n = {
        pt: {
            lbl_diaSemana    : "Dia Semana",           
            ph_diaSemana_op0 : "Dia",
            tp_lbl_diaSemana : "Dia da semana",
            erro_1           : "Campo obrigatório",      
            erro_2           : "Selecione um dia"
        },

        es: {
            lbl_diaSemana    : "Día la semana",           
            ph_diaSemana_op0 : "Día",
            tp_lbl_diaSemana : "Día la semana",
            erro_1           : "Campo obligatorio",      
            erro_2           : "Seleccione un día"
        }
    };

    optionsList = [
        { id: 1, nome: 'Segunda' },
        { id: 2, nome: 'Terça'   },
        { id: 3, nome: 'Quarta'  },
        { id: 4, nome: 'Quinta'  },
        { id: 5, nome: 'Sexta'   },
        { id: 6, nome: 'Sábado'  },
        { id: 7, nome: 'Domingo' },
    ];

    async connectedCallback() {
        super.connectedCallback();
    }

    validar() {
        return this.validarDiaSemana(); 
    }

    validarDiaSemana() {
        const lang = sessionStorage.getItem('official_language') || 'pt';
        const dict = this.constructor.i18n[lang] || this.constructor.i18n['pt'];
        const valorRaw = this.value.trim();

        // 1. Validação de Campo Vazio (Obrigatório)
        if (!valorRaw) {
            this.marcarErro(dict.erro_1); // Campo obrigatório
            return false;
        }
    
        // 1. Validação de Existência (Obrigatório / Undefined / Null / Vazio)
        // No JS, "if (!valor)" captura: "", null, undefined e 0.
        if (valorRaw === undefined || valorRaw === null || valorRaw.trim() === "") {
            this.marcarErro(dict.erro_2); // Mensagem de campo obrigatório
            return false;
        }

        this.marcarSucesso();
        return true;
    }

}

customElements.define('dia-semana-select', Dia_Semana_Select);