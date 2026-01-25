import { Base_Field } from '../base/Base_Field.js';

class Email_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_email    : "Email", 
            ph_email     : "Digite seu melhor email@mail.com",
            tp_lbl_email : "Email utilizado para acessar o aplicativo",
            erro         : "Por favor, insira um e-mail válido"       
        },

        es: {
            lbl_email    : "Correo electrónico",
            ph_email     : "Ingrese su mejor dirección de correo electrónico: email@mail.com",
            tp_lbl_email : "Correo electrónico utilizado para acceder a la aplicación",
            erro         : "Por favor, introduce una dirección de correo electrónico válida."
        }
    };
    
    // 2. Inicialização
    constructor() {
        super();
    }
    
    // 3. Ciclo de Vida (Lifecycle)
    // O connectedCallback agora só chama o render e as validações.
    // A parte de tradução e "faxina" já acontece automaticamente no super (Base_Field).
    connectedCallback() {

        // Adiciona o listner da tradução e chama o render para renderizar o componente
        // Não pode ser removido pois adiciona o listner na classe pai
        super.connectedCallback(); 
       
        super.setupBase(); //Não tem nada no setupBase
        super.initTooltip();
        this.configurarValidacao();
    }

    // 4. Renderização
    renderControl(p) {
        return `<div class="campo">
                    <label  class           ="field-label" 
                            for             ="${p.id}" 
                            data-translate  ="${p.data_translate_label}">
                            ${p.label}
                    </label>
                    <i class            ="${p.icon_question}" 
                       data-tooltip     ="${p.data_tooltip_balao}" 
                       data-translate   ="${p.data_translate_tooltip}">
                    </i>
                    <input type="text" 
                        id              ="${p.id}" 
                        name            ="${p.name}" 
                        class           ="field-input" 
                        data-translate  ="${p.data_translate_ph}" 
                        placeholder     ="${p.placeholder}" 
                        autocomplete    ="off" ${p.is_required}>
                </div>`;         
    }

    // 5. Métodos de Validação
     /** @override */
    validar() {
        return this.validarEmail();
    }

    async configurarValidacao() {
        const input = this.control; 
        if (input) {
            input.addEventListener('blur', () => this.validarEmail());
            input.addEventListener('input', () => this.limparEstado()); 
        }
    }

    validarEmail() {    
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        const valor = this.value; 
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(valor)) {
            const mensagem = Email_Field.i18n[official_language].erro;
            this.marcarErro( mensagem );
            return false;
        }

        this.marcarSucesso();
        return true;
    }
   
}

// 6. Definição do Web Component
customElements.define('email-field', Email_Field);