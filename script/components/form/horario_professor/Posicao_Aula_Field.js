import { Base_Field } from "../../base/Base_Field.js";

class Posicao_Aula_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_posicaoAula    : "Posição",            
            tp_lbl_posicaoAula : "Posição da Aula no horário. Ex: 1º, 2º etc.",
            erro_1             : "Números entre 1 e 6",
            erro_2             : "Digite apenas números",
            erro_3             : "Campo obrigatório"
        },

        es: {
            lbl_posicaoAula    : "Posición",
            ph_posicaoAula     : "Posición de la clase en el horario. Ej.: 1.º, 2.º, etc.",
            tp_lbl_posicaoAula : "Números entre 1 y 6",
            erro_1             : "Números entre 1 e 6",
            erro_2             : "Introduzca sólo números.",
            erro_3             : "Campo obligatorio"
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
                    <input type="number" value="1" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>
                    ${p.icon_edicao ? `
                        <button type="button" class="edit-button">
                            <i class="${p.icon_edicao}"></i>
                        </button>
                        ` : ''}     
                </div>
        `;        
    }

    validar() {
        return this.validarPosicaoAula(); 
    }

    validarPosicaoAula() {
        const lang = sessionStorage.getItem('official_language') || 'pt';
        // Ajuste o nome da classe abaixo para a classe onde esta função residir
        const dict = this.constructor.i18n[lang] || this.constructor.i18n['pt'];
        const valorRaw = this.value.trim();

        // 1. Validação de Campo Vazio (Obrigatório)
        if (!valorRaw) {
            this.marcarErro(dict.erro_3);
            return false;
        }

        // Converte para número para validação lógica
        const numero = Number(valorRaw);

        // 2. Validação se é um número válido (Evita letras ou símbolos)
        if (isNaN(numero)) {
            this.marcarErro(dict.erro_4);
            return false;
        }

        // 3. Validação do Intervalo (1 a 6)
        // Não pode ser menor que 1 (cobre o zero e negativos) e não pode ser maior que 6
        if (numero < 1 || numero > 6) {
            this.marcarErro(dict.erro_1);
            return false;
        }

        this.marcarSucesso();
        return true;
    }
       
}

customElements.define('posicao-aula-field', Posicao_Aula_Field);