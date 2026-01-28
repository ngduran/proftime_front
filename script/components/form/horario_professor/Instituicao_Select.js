import { executarOperacao } from "../../../core/api-engine.js";
import { listarEstados, listarInstituicoes } from "../../../services/api_service.js";
import { Base_Select } from "../../base/Base_Select.js";

export class Instituicao_Select extends Base_Select {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_instituicao    : "Instituição", 
            ph_instituicao     : "Selecione a instituição",
            ph_instituicao_op0 : "Selecione a instituição",
            tp_lbl_instituicao : "Utilizado para organizar seu horário",
            erro               : "Por favor, selecione uma instituição"       
        },

        es: {
            lbl_instituicao    : "Institución", 
            ph_instituicao     : "Seleccione la institución",
            ph_instituicao_op0 : "Seleccione la institución",
            tp_lbl_instituicao : "Se utiliza para organizar tu agenda.",
            erro               : "Por favor seleccione una institución.",
        }
    };


    // Agora você só define os DADOS
    // optionsList = [
    //     { id: 'castelo',  nome: 'Colégio Castelo Branco' },
    //     { id: 'costa',    nome: 'Colégio Costa e Silva' },
    //     { id: 'eleodoro', nome: 'Colégio Eleodoro' }
    // ];

    optionsList = [];


    async connectedCallback() {
        super.connectedCallback(); // Renderiza o esqueleto e o placeholder
        await this.readInstituicoes(); // Busca os dados da API
    }




    // // 2. Você só precisa definir as opções específicas
    // renderOptions(p) {
    //     const estados = [
    //         { sigla: 'PR', nome: 'Paraná' },
    //         { sigla: 'SP', nome: 'São Paulo' },
    //         { sigla: 'SC', nome: 'Santa Catarina' }
    //     ];

    //     return estados.map(est => 
    //         `<option value="${est.sigla}">${est.nome}</option>`
    //     ).join('');
    // }

    // async readInstituicoes() {
    //     await executarOperacao({
    //         idBotao: 'cadastrarBtn',
    //         apiCall: listarInstituicoes, // Sua API específica
    //         onSuccess: async (resultado) => { 
    //             // 1. Atualiza a lista de dados
    //             this.optionsList = resultado.data;
    //             // 2. Chama o render novamente para atualizar as options no DOM
    //             this.render(); 
    //         }
    //     });
    // }


    async readInstituicoes() {
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',
            apiCall: listarInstituicoes,
            onSuccess: async (resultado) => {              
                //this.preencherSelect(this.id, resultado.data);

                // 1. Em vez de manipular o DOM na mão, alimentamos a lista
                // O log image_8bfbb0 confirma que os dados estão em resultado.data
                this.optionsList = (resultado.data || []).map(item => ({
                    id: item.uuid, 
                    nome: item.nome
                }));

                // 2. Agora o render() vai gerar as options usando o renderOptions(p) da base
                this.render();
            }     
        });
    }

    /**
     * Popula um elemento <select> com uma lista de objetos.
     * @param {string} idSelect - ID do elemento no HTML
     * @param {Array} dados - Lista de estados vinda da API (ex: [{uuid: '...', nome: 'Paraná'}])
     */
    async preencherSelect(idSelect, dados) {     
        const select = this.shadowRoot.getElementById('instituicao'); 
        
        if (!select) {
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







    // async readInstituicoes() {
    //     await executarOperacao({
    //         // Se o botão não existir na tela ainda, passe null para não dar erro de 'disabled'
    //         idBotao: document.getElementById('cadastrarBtn') ? 'cadastrarBtn' : null,
    //         apiCall: listarInstituicoes,
    //         onSuccess: async (resultado) => { 
    //             // MAPEAMENTO IMPORTANTE: Garante que a Base_Select entenda o que é ID e o que é NOME
    //             this.optionsList = resultado.data.map(item => ({
    //                 id: item.uuid || item.id, 
    //                 nome: item.nome
    //             }));
                
    //             // Re-renderiza agora com os dados da lista e as traduções
    //             this.render(); 
    //         }
    //     });
    // }



    // async readInstituicoes() {
    //     await executarOperacao({
    //         idBotao: 'cadastrarBtn',
    //         apiCall: listarInstituicoes,
    //         onSuccess: async (resultado) => { 
    //             // 1. Apenas atualizamos os dados. 
    //             // O renderOptions da Base_Select já sabe lidar com 'uuid' ou 'id'.
    //             this.optionsList = resultado.data.map(item => ({
    //                 id: item.uuid, // Mapeamos o uuid para 'id' para a Base entender
    //                 nome: item.nome
    //             }));

    //             // 2. O 'render()' limpa o Shadow DOM e reconstrói tudo 
    //             // usando a nova optionsList automaticamente.
    //             this.render(); 
    //         }     
    //     });
    // }




}

customElements.define('instituicao-select', Instituicao_Select);