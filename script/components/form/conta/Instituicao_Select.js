import { executarOperacao } from '../../../core/api-engine.js';
import { listarEstados } from '../../../services/api_service.js';
import { Base_Field } from "../../base/Base_Field.js";


class Instituicao_Select extends Base_Field {
    
    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_nome    : "Instituição", 
            ph_nome     : "Selecione a instituição",
            tp_lbl_nome : "Utilizado para organizar seu horário",
            erro        : "Por favor, selecione uma instituição"       
        },

        es: {
            lbl_nome    : "Institución", 
            ph_nome     : "Seleccione la institución",
            tp_lbl_nome : "Se utiliza para organizar tu agenda.",
            erro        : "Por favor seleccione una institución.",
        }
    };

    // 2. Inicialização
    constructor() {
        super();        
    }
    
    connectedCallback() {   
        super.initTooltip();

        queueMicrotask(() => {           
            this.setupEventListeners();        
        });

        //window.addEventListener('senha-selecionado', (e) => this.handleSenhaGlobalChange(e));
    }

     // 3. RENDERIZAÇÃO
    renderControl(p) {                
        return `<div class="campo">
                    <label  class          ="field-label"  
                            for            ="${p.id}" 
                            data-translate ="${p.data_translate_label}">
                            ${p.label}
                    </label>
                    <i  class           ="${p.icon_question}" 
                        data-tooltip    ="${p.data_tooltip_balao}" 
                        data-translate  ="${p.data_translate_tooltip}">
                    </i>
                    <select 
                        id           ="${p.id}" 
                        name         ="${p.name}" 
                        class        ="field-select"
                        autocomplete ="off" 
                        ${p.is_required}>
                        <option value="" data-translate="${p.data_translate_op}">${p.placeholder}</option>
                    </select>                    
                </div>
        `;     
    }

    // 4. EVENTOS E COMPORTAMENTO DE INTERFACE
 setupEventListeners() {
        
        const control = this.control;
        if (!control) {           
            return;
        }
        
        control.addEventListener('change', (e) => {            
            this.validar();
            this.emitirMudanca(e.target.value);
        });
        
        control.addEventListener('blur', () => {
            this.validar();
        });
       
        control.addEventListener('input', () => {
            this.limparEstado();
        });
    }

    // 5. COMUNICAÇÃO ENTRE COMPONENTES (EVENT BUS)    
    emitirMudanca(valor) {        
        const eventName = `${this.tagName.toLowerCase().replace('-field', '')}-selecionado`;
        
        this.dispatchEvent(new CustomEvent(eventName, {
            detail: { 
                value: valor,
                scope: this.scope,
                elementId: this.id
            },
            bubbles: true,
            composed: true 
        }));
    }

    // 6. MÉTODOS DE VALIDAÇÃO    
    validarSelect() {

        const select = this.control;
        
        if (!select) {            
            return false;
        }

        const valor = select.value;
       
        if (!valor || valor.trim() === "") {
            this.marcarErro(this.constructor.i18n[official_language].erro);
            return false;
        }

        this.marcarSucesso();
        return true;
    }

//=====================================================================================
//=====================================================================================
//=====================================================================================
//=====================================================================================

    // 7. CALLBACK
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

    

}

customElements.define('instituicao-select', Instituicao_Select);