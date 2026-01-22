import { Base_Field } from '../base/Base_Field.js';

class Cidade_Field extends Base_Field {
    constructor() {
        super();         
    }
    
    connectedCallback() {
        super.render(); 
        super.setupBase();
        super.initTooltip();
        super.initEdition();
        this.configurarValidacao();
        this.configurarBusca();
    }

    renderControl(p) {       
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="text" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>
                    <button type="button" class="edit-button">
                        <i class="${p.icon_edicao}"></i>
                    </button>   
                </div>
        `;        
    }

    validar() { // Adicione async aqui
        return this.validarNome();        
    }

    configurarBusca() {
        const campoBusca = this.shadowRoot.getElementById('cidade');
        const scope = this.getAttribute('scope'); // Captura o atributo 'scope'   
        
        if (campoBusca) {
            campoBusca.addEventListener('input', (e) => {
                const termo = e.target.value;

                // REGRA: Só dispara para o servidor a partir de 3 caracteres
                if (termo.length >= 3) {
                    console.log("Enviando termo para busca:", termo);
                    
                    this.dispatchEvent(new CustomEvent('cidade-digitada', {
                        detail: { 
                            termoBusca: termo, 
                            scope:      scope
                        },
                        bubbles: true,
                        composed: true
                    }));
                }
            });
        }
    }

    async configurarValidacao() {
        const input = this.shadowRoot.querySelector(".field-input");    
        
        if (input) {
            input.addEventListener('blur', () => {
                this.validarNome();
            });
        }
       
    }

    async validarNome() {  
        const input = this.control; // Usa o getter da Base_Field
        if (!input) return;

        // Formatação: Primeira letra de cada palavra em maiúscula
        input.value = input.value.toLowerCase().replace(/(?:^|\s)\S/g, a => a.toUpperCase());
        
        const valor = input.value.trim();
        const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;

        if (!regexNome.test(valor)) {
            this.marcarErro("O nome deve conter apenas letras.");
            return false;
        }

        if (valor.length < 3) {
            this.marcarErro("O nome deve ter pelo menos 3 letras.");
            return false;
        }

        this.marcarSucesso(); // Não precisa passar nada!
        return true;
    }

        
}

customElements.define('cidade-field', Cidade_Field);