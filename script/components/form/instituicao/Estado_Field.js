import { executarOperacao } from '../../../core/api-engine.js';
import { listarEstados } from '../../../services/api_service.js';
import { Base_Select } from '../../base/Base_Select.js';

class Estado_Select extends Base_Select {
    
    static i18n = {
        pt: {
            lbl_estado    : "Estado (UF)",           
            ph_estado_op0 : "Selecione um estado",
            tp_lbl_estado : "Informe o estado em que fica a Instituição",
            erro          : "Campo Obrigatório"       
        },

        es: {
            lbl_estado    : "Estado (UF)",           
            ph_estado_op0 : "Seleccione un estado",
            tp_lbl_estado : "Por favor especifique el estado donde se encuentra ubicada la institución.",
            erro          : "Campo obligatorio"       
        }
    };

    optionsList = [];

    async connectedCallback() {    
        super.connectedCallback();        
        await this.readEstados();
    }
    
    async readEstados() {
        await executarOperacao({
            idBotao: 'cadastrarBtn',
            keyTextoAguarde: 'Consultando...',
            apiCall: listarEstados,
            onSuccess: async (resultado) => { 
                
                this.optionsList = (resultado.data || []).map(item => ({
                    id: item.uuid, 
                    nome: item.nome
                }));
                
                this.render();                
            }     
        });
    }

}

customElements.define('estado-select', Estado_Select);