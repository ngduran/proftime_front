import { executarOperacao } from '../../core/api-engine.js';
import { listarMunicipiosPorEstado } from '../../services/api_service.js';
import { applyTranslations } from '../../utils/i18n.js';
import { Mensagem } from '../../utils/mensageiro.js';
import { Base_Field } from '../base/Base_Field.js';


class Municipio_Field extends Base_Field {
   
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
         
        // Inicia a escuta de eventos externos
        this.adicionarListenersGlobais();
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
        const select = this.control; // Use o getter da Base_Field em vez de getElementById
        if (!select) return;
        const scope = this.getAttribute('scope'); // Captura o atributo 'scope'  
        
        // Disparar evento quando o estado mudar
        select.addEventListener('change', (e) => {
            this.validarSelect();
            const municipioId = e.target.value;
            this.dispatchEvent(new CustomEvent('municipio-selecionado', {
                detail: { 
                    municipioId: municipioId,
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
            this.marcarErro("Selecione a cidade");
            return false;
        }

        this.marcarSucesso();
        return true;
    }


    async adicionarListenersGlobais() {        
        
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
        window.addEventListener('cidade-digitada', async (e) => {

            if (e.detail.scope === scopeHere) {
                const letras = e.detail.termoBusca;
    
                if (this.estadoSelecionadoId && letras) {
                    console.log(`Buscando no Estado ${this.estadoSelecionadoId} as letras: ${letras}`);
                    this.readMunicipios(this.estadoSelecionadoId, letras);
                } else if (!this.estadoSelecionadoId) {
                    //alert("Por favor, selecione um estado primeiro.");
                    
                    await Mensagem.aviso("Por favor, selecione um estado primeiro!");
                    
                    // Tenta limpar o alvo do evento (o componente que disparou a digitação)
                    if (e.target && e.target.shadowRoot) {
                        const inputInterno = e.target.shadowRoot.querySelector('input');
                        if (inputInterno) inputInterno.value = "";

                    }
   
                }            
            } else {
                return;
            }

        });
    }

    async readMunicipios(termoCidade, letras) {
            
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',          
            apiCall: () => listarMunicipiosPorEstado(termoCidade, letras),
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
       //const select = this.shadowRoot.getElementById('municipio');
       
        const select = this.shadowRoot.getElementById(idSelect); // USE O PARÂMETRO idSelect

        if (!select) {
            console.error(`Select com ID ${idSelect} não encontrado no Shadow DOM.`);
            return;
        }

        // Preserva apenas a primeira opção (o "Selecione...")
        select.length = 1; 

        dados.forEach(item => {
            const option = document.createElement('option');
            // Estava utilizando id
            // O value DEVE ser o UUID para bater com o seu banco de dados       
            //option.value = item.UUID;
            //option.value = item.id;
            
            option.value = item.uuid;
            
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