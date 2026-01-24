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

    // Dicionário estático dentro do componente
    static i18n = {
        pt: {
            label:       "Email",
            placeholder: "seu_melhor_email@mail.com",
            tooltip:     "Email utilizado para acessar o aplicativo",
            erro:        "Por favor, insira um e-mail válido."
        },
        es: {
            label:       "Correo electrónico",
            placeholder: "tu_mejor_correo@mail.com",
            tooltip:     "Correo electrónico utilizado para acceder a la aplicación",
            erro:        "Por favor, introduce un correo electrónico válido."
        }
    };

    // translate() {
        
    //     // 1. Define a prioridade: 
    //     // Primeiro o parâmetro (evento), depois o sessionStorage oficial, por fim 'pt'
    //     const officila_language = sessionStorage.getItem('official_language') || 'pt';

    //     console.log(
    //         `%c [Tradução] <${this.tagName.toLowerCase()}> aplicando: ${idiomaParaUsar.toUpperCase()}`, 
    //         "color: #b70cce; font-weight: bold; border: 1px solid #b70cce; padding: 2px;"
    //     );

    //     // Se o filho (ex: Email_Field) tiver o método updateLabels, ele executa.
    //     if (typeof this.updateLabels === 'function') {
    //         this.updateLabels(lang);
    //     }
    // }

    // updateLabels(lang) {
       
    //     // 1. Recupera o idioma atual (ajuste conforme seu sistema de troca de idiomas)
    //     //const lang = localStorage.getItem('selectedLanguage') || 'pt';
        
    //     // LINHA DE LOG PARA VERIFICAÇÃO
    //     //console.log(`%c [Tradução] Email_Field executando updateLabels para: ${lang.toUpperCase()}`, "color: #00ff00; font-weight: bold; border: 1px solid #00ff00; padding: 2px;");
        
    //     const t = Email_Field.i18n[lang];

    //     if (!t) return;

    //     // 2. Localiza os elementos dentro do Shadow DOM
    //     const label = this.shadowRoot.querySelector('.field-label');
    //     const input = this.shadowRoot.querySelector('.field-input');
    //     const icon  = this.shadowRoot.querySelector('.info-question');

    //     // 3. Aplica as traduções específicas deste campo
    //     if (label) label.innerText = t.lbl_email;
    //     if (input) input.placeholder = t.ph_email;
        
    //     // 4. Sincroniza o tooltip (o Manager lerá este atributo depois)
    //     if (icon) icon.setAttribute('data-tooltip', t.tp_lbl_email);
    // }

    translate(lang) {
        const t = Email_Field.i18n[lang];
        if (!t) return;

        const label = this.shadowRoot.querySelector('.field-label');
        const input = this.shadowRoot.querySelector('.field-input');
        const icon  = this.shadowRoot.querySelector('.info-question');

        if (label) label.innerText = t.label;
        if (input) input.placeholder = t.placeholder;
        if (icon) icon.setAttribute('data-tooltip', t.tooltip);

        // Se houver erro, já atualiza a mensagem de erro traduzida
        if (this.container.classList.contains('has-error')) {
            this.validarEmail(lang); 
        }
    }

}

customElements.define('email-field', Email_Field);