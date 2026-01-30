import { Base_Field } from "../../base/Base_Field.js";

class Instituicao_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_nome    : "Nome da Instituição",
            ph_nome     : "Ex: Escola Estadual XXX",
            tp_lbl_nome : "Nome utilizado para identificação",
            erro_1      : "O nome contém caracteres inválidos",
            erro_2      : "O nome deve ter pelo menos 3 caracteres",
            erro_3      : "Este campo é obrigatório" 
        },

        es: {
            lbl_nome    : "Nombre de la Institución",
            ph_nome     : "Ejemplo: Escuela Estatal XXX",
            tp_lbl_nome : "Nombre utilizado para identificación",
            erro_1      : "El nombre contiene caracteres inválidos",
            erro_2      : "El nombre debe tener al menos 3 caracteres",
            erro_3      : "Este campo es obligatorio"  
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
                    <input type="text" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
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
        return this.validarNome(); 
    }

    validarNome() {
    
        const lang = sessionStorage.getItem('official_language') || 'pt';
        const dict = Instituicao_Field.i18n[lang] || Instituicao_Field.i18n['pt'];
        const valor = this.value.trim();

        // 1. Validação de Campo Vazio (Obrigatório)
        if (!valor) {
            this.marcarErro(dict.erro_3);
            return false;           
        }

        // 2. Validação de Caracteres (Letras, Acentos, Números e Espaços)
        // A Regex ^[A-Za-zÀ-ÿ0-9\s]+$ cobre tudo o que você pediu.
        const regexNome = /^[A-Za-zÀ-ÿ0-9\s]+$/;
        if (!regexNome.test(valor)) {
            this.marcarErro(dict.erro_1);
            return false;
        }

        // 3. Validação de Tamanho Mínimo
        if (valor.length < 3) {
            this.marcarErro(dict.erro_2);
            return false;
        }

        this.marcarSucesso();
        return true;
    }
       
}

customElements.define('instituicao-field', Instituicao_Field);