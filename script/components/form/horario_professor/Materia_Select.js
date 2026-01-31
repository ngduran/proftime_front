import { Base_Select } from "../../base/Base_Select.js";

class Materia_Select extends Base_Select {

    static i18n = {
        pt: {
            lbl_materia    : "Matéria",           
            ph_materia_op0 : "Matéria",
            tp_lbl_materia : "Selecione uma Matéria",
            erro_1         : "Campo obrigatório",      
            erro_2         : "Selecione uma Matéria"
        },

        es: {
            lbl_materia    : "Asunto",           
            ph_materia_op0 : "Asunto",
            tp_lbl_materia : "Seleccione un tema",
            erro_1         : "Campo obligatorio",      
            erro_2         : "Seleccione un tema"
        }
    };

    optionsList = [
        { id: 1, nome: 'Análise e Projeto de Sistemas' },
        { id: 2, nome: 'Banco de dados'                },
        { id: 3, nome: 'Programação Mobile'            },
        { id: 4, nome: 'Marketing'                     },
        { id: 5, nome: 'Datilografia'                  },
        { id: 6, nome: 'Matemática'                    },
        { id: 7, nome: 'História'                      },
    ];

    async connectedCallback() {
        super.connectedCallback();
    }

    validar() {
        return this.validarMateria(); 
    }

    validarMateria() {
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

customElements.define('materia-select', Materia_Select);