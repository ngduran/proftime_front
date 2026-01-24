import { Base_Field } from '../../base/Base_Field.js';

class Email_Field extends Base_Field {
    
    constructor() {
        super();
    }
    
    // O connectedCallback agora só chama o render e as validações.
    // A parte de tradução e "faxina" já acontece automaticamente no super (Base_Field).
    connectedCallback() {

        // ESTA LINHA ACIONA O LOG ROXO E O ESCUTADOR DE EVENTOS
        //Essa linha pode ser retirada?
        super.connectedCallback();
        
        //console.log("%c [Rastreio] Filho (Email_Field) agora está sintonizado!", "color: purple");
        //super.render();
        super.setupBase();
        super.initTooltip();
        this.configurarValidacao();

        console.log(this.tagName, this.getContainerInfo());
    }

    renderControl(p) {
        return `<div class="campo">
                    <label class="field-label" for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="text" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                </div>`; 

        // const htmlGerado = `<div class="campo">
        //             <label class="field-label" for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
        //             <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
        //             <input type="text" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
        //         </div>`; 

        // RASTREIO: Verifica se o HTML final contém a chave correta
        //console.log(`%c >>> HTML Gerado para Shadow DOM:`, 'color: green; font-weight: bold;');
        ///console.log(htmlGerado);        
                
        //return htmlGerado;        
    }

    /** @override */
    async validar() {        
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
        const valor = this.value; 
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regexEmail.test(valor)) {
            this.marcarErro("Por favor, insira um e-mail válido.");
            return false;
        }

        this.marcarSucesso();
        return true;
    }
}

customElements.define('email-field', Email_Field);