import { executarOperacao } from "../../../core/api-engine.js";
import { listarInstituicoes } from "../../../services/api_service.js";
import { Base_Select } from "../../base/Base_Select.js";

export class Instituicao_Select extends Base_Select {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_instituicao    : "Instituição",           
            ph_instituicao_op0 : "Selecione a instituição",
            tp_lbl_instituicao : "Utilizado para organizar seu horário",
            erro               : "Por favor, selecione uma instituição"       
        },

        es: {
            lbl_instituicao    : "Institución",           
            ph_instituicao_op0 : "Seleccione la institución",
            tp_lbl_instituicao : "Se utiliza para organizar tu agenda.",
            erro               : "Por favor seleccione una institución.",
        }
    };

    optionsList = [];


    async connectedCallback() {
        super.connectedCallback(); // Renderiza o esqueleto e o placeholder
        await this.readInstituicoes(); // Busca os dados da API
    }
  
    async readInstituicoes() {
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',
            apiCall: listarInstituicoes,
            onSuccess: async (resultado) => { 
                // 1. Alimenta a lista (230 itens)
                this.optionsList = (resultado.data || []).map(item => ({
                    id: item.uuid, 
                    nome: item.nome
                }));

                // 2. Renderiza o conteúdo
                this.render(); 

            }     
        });
    }

}

customElements.define('instituicao-select', Instituicao_Select);