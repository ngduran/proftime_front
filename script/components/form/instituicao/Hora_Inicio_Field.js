import { Base_Field } from "../../base/Base_Field.js";

class Hora_Inicio_Field extends Base_Field {

    static i18n = {
        pt: {
            lbl_horario_inicial    : "Hora de Início",           
            tp_lbl_horario_inicial : "Informe a hora inicial da aula",
            erro_1                 : "Obrigatório",
            erro_2                 : "Não pode ser zero",
        },

        es: {
            lbl_horario_inicial    : "Hora de inicio",            
            tp_lbl_horario_inicial : "Por favor especifique la hora de inicio de la clase.",
            erro_1                 : "Obligatorio.",
            erro_2                 : "No puede ser cero."            
        }
    };

    constructor() {
        super();        
    }
    
    connectedCallback() {
        super.connectedCallback();        
    }

    renderControl(p) {       
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="time" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>
                    <button type="button" class="edit-button">
                        <i class="${p.icon_edicao}"></i>
                    </button>
                </div>
        `;                  
    }
    
    validar() {        
        return this.validarCampoTime(); 
    }
      
    validarCampoTime() {

        const lang = sessionStorage.getItem('official_language') || 'pt';        
        const dict = this.constructor.i18n[lang] || this.constructor.i18n['pt'];
        const valor = this.value; // Usa o getter da Base_Field

        // 1. REGRA: Campo Vazio (Erro 1)
        // Inputs do tipo 'time' retornam string vazia "" quando não preenchidos
        if (!valor || valor.trim() === "") {
            this.marcarErro(dict.erro_1);
            return false;
        }

        // 2. REGRA: Hora Zero (Erro 2)
        // Caso o usuário selecione 00:00, tratamos como inválido conforme sua regra
        if (valor === "00:00") {
            this.marcarErro(dict.erro_2);
            return false;
        }

        // Se passou pelas validações acima, é sucesso
        this.marcarSucesso();
        return true;
    }

}

customElements.define('hora-inicio-field', Hora_Inicio_Field);