import { executarOperacao } from '../../core/api-engine.js';
import { listarEstados } from '../../services/api_service.js';

import { validarComboBox } from '../../utils/validador.js';
import { Base_Field } from '../base/Base_Field.js';


class Estado_Field extends Base_Field {
    
    constructor() {
        super();        
    }
    
    connectedCallback() {   
        super.render(); 
        super.setupBase(); 
    }

    renderControl(p) {       
        return `<select id="main-select" name="${p.name}" autocomplete="off" ${p.is_required}>
                    <option value="" data-translate="${p.data_translate_op}">Selecione o estado</option>
                </select>`;      
    }



    configurarValidacao() {
        const select = this.shadowRoot.getElementById('main-select');    
        select.addEventListener('blur', () => {
            validarComboBox(this.id, 'Selecione o estado');
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
        const select = this.shadowRoot.getElementById('main-select'); 
        
        if (!select) {
            console.error(`Select com ID ${idSelect} não encontrado no Shadow DOM.`);
            return;
        }

        // Preserva apenas a primeira opção (o "Selecione...")
        select.length = 1; 

        dados.forEach(item => {
            const option = document.createElement('option');
            // O value DEVE ser o UUID para bater com o seu banco de dados         
            option.value = item.id;
            option.textContent = item.nome; 
            select.appendChild(option);
        });
    }

}

customElements.define('estado-field', Estado_Field);