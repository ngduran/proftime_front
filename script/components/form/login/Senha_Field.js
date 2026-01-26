import { Base_Field } from '../../base/Base_Field.js';

class Senha_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_senha    : "Senha", 
            ph_senha     : "Digite sua senha",
            tp_lbl_senha : "Senha utilizada para acessar o aplicativo",
            erro         : "Por favor, digite sua senha"       
        },

        es: {
            lbl_senha    : "Contraseña",
            ph_senha     : "Introduzca su contraseña.",
            tp_lbl_senha : "Contraseña utilizada para acceder a la aplicación.",
            erro         : "Por favor, introduzca su contraseña."
        }
    };

    // 2. Inicialização
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.connectedCallback();
        super.initTooltip();
        this.configurarValidacao();
    }

    // 4. Renderização
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
                    <input type        ="password" 
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

    // 5. Métodos de Validação
     /** @override */
    validar() {
        return this.validarForcaSenha(); 
    }

    async configurarValidacao() {
        const input = this.control;  
        if (input) {
            input.addEventListener('blur', () => this.validarForcaSenha());
            input.addEventListener('input', () => this.limparEstado()); 
        }
    }

    async configurarMostrarSenha(idCheckbox = 'mostrarSenha') {
        // 1. O checkbox está no documento principal (fora do Shadow DOM)
        const checkbox = document.getElementById(idCheckbox);
        
        // 2. O input de senha está dentro do seu componente (Shadow DOM)
        // Usamos o getter 'control' que você já definiu no Base_Field
        const inputSenha = this.control;

        if (!checkbox || !inputSenha) return;

        // Ouvimos a mudança no checkbox externo
        checkbox.addEventListener('change', (event) => {
            // Se marcado 'text' (visível), se desmarcado 'password' (bolinhas)
            inputSenha.type = event.target.checked ? 'text' : 'password';
        });
    }

    // Dentro da classe Senha_Field que estende Base_Field
    async validarForcaSenha() {
        // 1. Obtém o valor através do getter 'value' da Base_Field
        const senha = this.value;

        // 2. Regex completa: Maiúscula, Minúscula, Número, Símbolo e 8+ caracteres
        const regexComplexidade = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        // 3. Validação lógica
        if (!regexComplexidade.test(senha)) {
            const mensagem = Email_Field.i18n[official_language].erro;
            this.marcarErro( mensagem );
            return false;
        }

        // 4. Caso passe, marca sucesso usando a estrutura da base
        this.marcarSucesso();
        return true;
    }
        
}

// 6. Definição do Web Component
customElements.define('senha-field', Senha_Field);