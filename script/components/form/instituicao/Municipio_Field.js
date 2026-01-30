import { executarOperacao } from "../../../core/api-engine.js";
import { listarMunicipiosPorEstado } from '../../../services/api_service.js';
import { Base_Select } from "../../base/Base_Select.js";

class Municipio_Select extends Base_Select {
   
    static i18n = {
        pt: {
            lbl_cidade       : "Cidade",           
            ph_municipio_op0 : "Selecione uma cidade",
            tp_lbl_municipio : "Utilizado para organizar seu horário",
            erro_1           : "Por favor, selecione uma cidade",      
            erro_2           : "Primeiro selecione um Estado"      
        },

        es: {
            lbl_instituicao    : "Ciudad",           
            ph_instituicao_op0 : "Seleccione una ciudad",
            tp_lbl_instituicao : "Se utiliza para organizar tu agenda.",
            erro_1             : "Por favor seleccione una ciudad.",
            erro_2             : "Primero, seleccione un estado.",
        }
    };
    
    connectedCallback() {
        super.connectedCallback();
        this.registrarEscutas();               
    }

    registrarEscutas() {
        // Escuta 1: Quando o usuário digita na Cidade
        document.addEventListener('filtro-cidade-digitado', (e) => this._handleFiltroCidade(e));

        // Escuta 2: Quando o usuário seleciona um Estado
        document.addEventListener('estado-select-selecionado', (e) => this._handleEstadoSelecionado(e));
    }

    // Handler para Digitação de Cidade
    async _handleFiltroCidade(e) {
        
        if (e.detail.scope !== this.scope) return;

        const letras = e.detail.termoBusca;       
        const lang = sessionStorage.getItem('official_language') || 'pt';

        console.log(`%c[EVENT] %c${this.id.toUpperCase()} %c<- filtro-cidade-digitado: "${letras}"`, 
            "color: #fd7e14; font-weight: bold;", "color: #6f42c1; font-weight: bold;", "color: #666;");

        debugger
        if (this.estadoSelecionadoId && letras) {           
            await this.readMunicipios(this.estadoSelecionadoId, letras);
        } else if (!this.estadoSelecionadoId) {
            this.marcarErro(Municipio_Select.i18n[lang].erro_1);
            this.limparInputCidade(e.target);
        }
    }

    // Handler para Mudança de Estado
    _handleEstadoSelecionado(e) {
        
        if (e.detail.scope !== this.scope) return;

        // Guardamos o ID do estado para futuras buscas de cidade
        this.estadoSelecionadoId = e.detail.estadoId;        
        
        // Opcional: Limpar o erro do município se ele selecionou um estado agora
        this.limparEstado(); 
    }

    limparInputCidade(target) {
        if (target && target.shadowRoot) {
            const input = target.shadowRoot.querySelector('input');
            if (input) input.value = '';
        }
    }
    
    escutarBuscaCidade() {
       
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        
        document.addEventListener('filtro-cidade-digitado', async (e) => {
            
            if (e.detail.scope !== this.scope) return;

            const letras = e.detail.termoBusca;
            const estadoId = this.elementId;
           
            if (estadoId && letras) {
                // Dispara a consulta para a API
                await this.readMunicipios(estadoId, letras);
            } else if (!estadoId) {
                const mensagem = Municipio_Select.i18n[official_language].erro_1;
                this.marcarErro( mensagem );                
                this.limparInputCidade(e.target);
            }
        });
    }
   
    limparInputCidade(target) {
        if (target && target.shadowRoot) {
            const input = target.shadowRoot.querySelector('input');
            if (input) input.value = '';
        }
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

    alternarComponentes() {       
        
        // Buscamos os elementos no DOM principal (fora do shadow)
        const busca = document.querySelector('cidade-field');
        const selecao = document.querySelector('municipio-select');       

        if (busca && selecao) {
            busca.style.display = 'none';    // Esconde o input de digitação
            selecao.style.display = 'block'; // Mostra o select populado
            
            // Foca no select para facilitar a navegação do usuário
            const selectInterno = selecao.shadowRoot.querySelector('select');
            if (selectInterno) selectInterno.focus();
        }
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

}

customElements.define('municipio-select', Municipio_Select);