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
        this.configurarBusca();
    }

    renderControl(p) {       
        return `<div>
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
        
}

customElements.define('cidade-field', Cidade_Field);