import { Base_Field } from '../../base/Base_Field.js';

class Usuario_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_usuario    : "Usuário", 
            ph_usuario     : "Crie um usuário para utilizar",
            tp_lbl_usuario : "Utilizado para facilitar a sua entrada",
            erro_1         : "O usuário não pode conter espaços.",       
            erro_2         : "Use apenas letras minúsculas, números, '.' ou '_'.",       
            erro_3         : "O usuário deve ter pelo menos 3 caracteres."       
        },

        es: {
            lbl_usuario    : "Usuario", 
            ph_usuario     : "Crea un usuario para utilizar",
            tp_lbl_usuario : "Se utiliza para facilitar su entrada.",
            erro_1         : "El usuario no puede incluir espacios.",
            erro_2         : "Utilice únicamente letras minúsculas, números, '.' o '_'.",
            erro_3         : "El nombre de usuario debe tener al menos 3 caracteres."
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
                    <label  class          ="field-label"  
                            for            ="${p.id}" 
                            data-translate ="${p.data_translate_label}">
                            ${p.label}
                    </label>
                    <i  class          ="${p.icon_question}" 
                        data-tooltip   ="${p.data_tooltip_balao}" 
                        data-translate ="${p.data_translate_tooltip}">
                    </i>
                    <input type        ="text" 
                        id             ="${p.id}" 
                        name           ="${p.name}" 
                        class          ="field-input" 
                        data-translate ="${p.data_translate_ph}" 
                        placeholder    ="${p.placeholder}" 
                        autocomplete   ="off" 
                        ${p.is_required}>
                    </input>                    
                </div>
        `;        
    }

     /** @override */
    validar() {
        return this.validarUsername(); 
    }

    async configurarValidacao() {
        const input = this.control;  
        if (input) {
            input.addEventListener('blur', () => this.validarUsername());
            input.addEventListener('input', () => this.limparEstado()); 
        }
    }

    async validarUsername() { 
        
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        
        const input = this.control;
        if (!input) return;

        // 1. Formatação: Username geralmente é todo em minúsculo e sem espaços nas extremidades
        input.value = input.value.toLowerCase().trim();
        
        const valor = input.value;

        // 2. Regex: Permite letras, números, pontos (.) e underscores (_)
        // Não permite espaços no meio
        const regexUsername = /^[a-z0-9._]+$/;

        if (valor.includes(" ")) {
            const mensagem = Usuario_Field.i18n[official_language].erro_1;
            this.marcarErro( mensagem );
            return false;
        }

        if (!regexUsername.test(valor)) {
            const mensagem = Usuario_Field.i18n[official_language].erro_2;
            this.marcarErro( mensagem );
            return false;
        }

        if (valor.length < 3) {
            const mensagem = Usuario_Field.i18n[official_language].erro_3;
            this.marcarErro( mensagem );
            return false;
        }

        this.marcarSucesso();
        return true;
    }
    
}

customElements.define('usuario-field', Usuario_Field);