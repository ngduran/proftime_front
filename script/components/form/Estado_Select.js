import { executarOperacao } from '../../core/api-engine.js';
import { listarEstados } from '../../services/api_service.js';

import { validarComboBox } from '../../utils/validador.js';
import { Base_Select } from '../base/Base_Select.js';


class Estado_Select extends Base_Select {
    
    constructor() {
        super();  
    }
    
    connectedCallback() {   
        super.render(); 
        super.setupBase(); 
    }

    configurarValidacao() {
        const select = this.shadowRoot.getElementById('main-select');    
        select.addEventListener('blur', () => {
            validarComboBox(this.id, 'Selecione o estado');
        });
    }

    async readEstados() {
        // Usamos a lógica que você já tem, mas adaptada para o componente
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',
            apiCall: listarEstados,
            onSuccess: async (resultado) => {
                // Em vez de preencherSelect('estado', ...), usamos o método interno
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
            //option.value = item.uuid; 
            option.value = item.id; 
            
            // O texto que o usuário vê
            option.textContent = item.nome; 
            select.appendChild(option);
        });
    }

}

customElements.define('estado-select', Estado_Select);