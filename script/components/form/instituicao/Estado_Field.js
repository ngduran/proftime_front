import { executarOperacao } from '../../../core/api-engine.js';
import { listarEstados } from '../../../services/api_service.js';
import { applyTranslations } from "../../utils/i18n/instituicao_i18n.js";
import { Base_Field } from "../../base/Base_Field.js";


class Estado_Field extends Base_Field {
    
    constructor() {
        super();        
    }
    
    connectedCallback() {   
        super.render(); 

        // Tradução inicial na carga do componente
        applyTranslations(this.shadowRoot);

        // Escuta a mudança global de idioma
        window.addEventListener('languageChanged', () => {
            applyTranslations(this.shadowRoot);            
        });

        super.setupBase();
        super.initTooltip();
        super.initEdition();
        this.readEstados();
        this.configurarValidacao();
    }

    renderControl(p) {                
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <select id="${p.id}" name="${p.name}" class="field-select"
                        autocomplete="off" ${p.is_required}>
                        <option value="" data-translate="${p.data_translate_op}">${p.placeholder}</option>
                    </select>
                    <button type="button" class="edit-button">
                        <i class="${p.icon_edicao}"></i>
                    </button>
                </div>
        `;     
    }

    // Utilizado pelo formulário page intituicao.js
    // Sobrescreve o validar do Bae_Field
    validar() {        
        return this.validarSelect(); 
    }
 
    configurarValidacao() {
        const select = this.shadowRoot.getElementById('estado');
        const scope = this.getAttribute('scope'); // Captura o atributo 'scope'  
        
        // Disparar evento quando o estado mudar
        select.addEventListener('change', (e) => {
            this.validarSelect();
            const estadoId = e.target.value;
            this.dispatchEvent(new CustomEvent('estado-selecionado', {
                detail: { 
                    estadoId: estadoId,
                    scope:    scope // Envia o escopo junto com o ID
                },
                bubbles: true, // Permite que o evento suba na árvore DOM
                composed: true // Permite que o evento atravesse o Shadow DOM
            }));
        });

        select.addEventListener('blur', () => {
            this.validarSelect();
        });
    }


    async readEstados() {
        
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',
            apiCall: listarEstados,
            onSuccess: async (resultado) => {              
                this.preencherSelect(this.id, resultado.data);
            }     
        });
    }

    /**
     * Popula um elemento <select> com uma lista de objetos.
     * @param {string} idSelect - ID do elemento no HTML
     * @param {Array} dados - Lista de estados vinda da API (ex: [{uuid: '...', nome: 'Paraná'}])
     */
    async preencherSelect(idSelect, dados) {     
        const select = this.shadowRoot.getElementById('estado'); 
        
        if (!select) {
            console.error(`Select com ID ${idSelect} não encontrado no Shadow DOM.`);
            return;
        }

        // Preserva apenas a primeira opção (o "Selecione...")
        select.length = 1; 

        dados.forEach(item => {
            const option = document.createElement('option');
            // O value DEVE ser o UUID para bater com o seu banco de dados         
            //option.value = item.id;
            
            option.value = item.uuid;
            
            option.textContent = item.nome; 
            select.appendChild(option);
        });
    }

    /**
     * Valida o próprio componente select/combobox
     * @param {string} mensagemErro - Mensagem exibida em caso de falha
     * @returns {boolean}
     */
    validarSelect() {

        const select = this.control;
        
        if (!select) {
            console.error("Elemento select não encontrado internamente.");
            return false;
        }

        const valor = select.value;

        // Se não houver valor ou for string vazia (comum na opção "Selecione...")
        if (!valor || valor.trim() === "") {
            this.marcarErro("Selecione o estado");
            return false;
        }

        this.marcarSucesso();
        return true;
    }

}

customElements.define('estado-field', Estado_Field);