import { Base_Select } from "../../base/Base_Select.js";

class Turma_Select extends Base_Select {

    static i18n = {
        pt: {
            lbl_turma    : "Turma",           
            ph_turma_op0 : "Turma",
            tp_lbl_turma : "Selecione a turma",
            erro_1       : "Campo obrigatório",      
            erro_2       : "Selecione uma turma"
        },

        es: {
            lbl_turma    : "Clase",           
            ph_turma_op0 : "Clase",
            tp_lbl_turma : "Seleccione la clase",
            erro_1       : "Campo obligatorio",      
            erro_2       : "Seleccione una clase"
        }
    };

    optionsList = [
        { id: 1, nome: '1º Técnico em Desenvolvimento de Sistemas' },
        { id: 2, nome: '2º Técnico em Desenvolvimento de Sistemas' },
        { id: 3, nome: '3º Técnico em Desenvolvimento de Sistemas' },
        { id: 4, nome: '1º Técnico em Administração'               },
        { id: 5, nome: '8º Série Ensino Fundamental'               },
        { id: 6, nome: '1º Série Ensino Fundamental'               },
        { id: 7, nome: '2º Série Ensino Fundamental'               },
    ];

    async connectedCallback() {
        super.connectedCallback();
    }

    validar() {
        return this.validarTurma(); 
    }

    validarTurma() {
        const lang = sessionStorage.getItem('official_language') || 'pt';
        const dict = this.constructor.i18n[lang] || this.constructor.i18n['pt'];
        const valorRaw = this.value.trim();
        
        if (!valorRaw) {
            this.marcarErro(dict.erro_1);
            return false;
        }
            
        if (valorRaw === undefined || valorRaw === null || valorRaw.trim() === "") {
            this.marcarErro(dict.erro_2);
            return false;
        }

        this.marcarSucesso();
        return true;
    }

}

customElements.define('turma-select', Turma_Select);