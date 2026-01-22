import { executarOperacao } from '../../core/api-engine.js';
import { listarMunicipiosPorEstado } from '../../services/api_service.js';
import { coletarDadosForm } from '../../utils/form-helper.js';

import { validarComboBox } from '../../utils/validador.js';

import { Base_Field } from '../base/Base_Field.js';


class Municipio_Field extends Base_Field {
   
    constructor() {
        super();               
    }
   
    connectedCallback() {
         super.render();
         super.setupBase();
         super.initTooltip();
         super.initEdition();
         this.configurarValidacao();

        // Inicia a escuta de eventos externos
        this.adicionarListenersGlobais();
    }

    renderControl(p) {       
        return `<div>
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

    configurarValidacao() {
        const select = this.shadowRoot.getElementById('cidade');    
        select.addEventListener('blur', () => {
            // Passamos o elemento 'select' diretamente em vez de apenas o ID
            validarComboBox(select, 'Selecione a cidade');
        });
    }

    adicionarListenersGlobais() {
        
        const scopeHere = this.getAttribute('scope');


        // 1. Escuta quando o Estado mudar
        window.addEventListener('estado-selecionado', (e) => {

            if (e.detail.scope === scopeHere) {
                this.estadoSelecionadoId = e.detail.estadoId;
                console.log("Municipio guardou o Estado ID:", this.estadoSelecionadoId);
                
                // Opcional: Se mudar o estado, talvez queira limpar o input de cidade
                const inputBusca = this.shadowRoot.getElementById('cidade'); 
                if (inputBusca) inputBusca.value = "";            
            } else {
                return;
            }

        });

        // 2. Escuta quando as letras forem digitadas no Cidade_Field
        window.addEventListener('cidade-digitada', (e) => {

            if (e.detail.scope === scopeHere) {
                const letras = e.detail.termoBusca;
    
                if (this.estadoSelecionadoId && letras) {
                    console.log(`Buscando no Estado ${this.estadoSelecionadoId} as letras: ${letras}`);
                    this.readMunicipios(this.estadoSelecionadoId, letras);
                } else if (!this.estadoSelecionadoId) {
                    alert("Por favor, selecione um estado primeiro.");
                }            
            } else {
                return;
            }

        });
    }

    async readMunicipios(termoCidade) {
            
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',          
            apiCall: () => listarMunicipiosPorEstado(termoCidade, "CAS"),
            onSuccess: async (resultado) => {              
                this.preencherSelect(this.id, resultado.data);
                
                // 3. FAZ A TROCA VISUAL
                this.alternarComponentes();
            }     
        });
    }

    /**
     * Popula um elemento <select> com uma lista de objetos.
     * @param {string} idSelect - ID do elemento no HTML
     * @param {Array} dados - Lista de municípios vinda da API (ex: [{uuid: '...', nome: 'Cascavel'}])
     */
    async preencherSelect(idSelect, dados) {     
        const select = this.shadowRoot.getElementById('cidade');

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

    alternarComponentes() {       
        
        // Buscamos os elementos no DOM principal (fora do shadow)
        const busca = document.querySelector('cidade-field');
        const selecao = document.querySelector('municipio-field');       

        if (busca && selecao) {
            busca.style.display = 'none';    // Esconde o input de digitação
            selecao.style.display = 'block'; // Mostra o select populado
            
            // Foca no select para facilitar a navegação do usuário
            const selectInterno = selecao.shadowRoot.querySelector('select');
            if (selectInterno) selectInterno.focus();
        }
    }

}

customElements.define('municipio-field', Municipio_Field);