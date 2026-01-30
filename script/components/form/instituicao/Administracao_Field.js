import { executarOperacao } from "../../../core/api-engine.js";
import { listarAdministracoes } from "../../../services/api_service.js";
import { Base_Select } from "../../base/Base_Select.js";

class Administracao_Field extends Base_Select {

    static i18n = {
        pt: {
            lbl_administracao    : "Administração",           
            ph_administracao_op0 : "Selecione uma Administração",
            data_translate_op    : "ph_administracao_op0",
            placeholder          : "Seleciona uma Administração",
            tp_lbl_administracao : "Informe o sistema de Administração",
            erro                 : "Campo Obrigatório"       
        },

        es: {
            lbl_administracao    : "Administración",           
            ph_administracao_op0 : "Seleccione una Administración",
            data_translate_op    : "ph_administracao_op0",
            placeholder          : "Seleccione una Administración",
            tp_lbl_administracao : "Informar al sistema de Administración",
            erro                 : "Campo obligatorio"     
        }
    };

    optionsList = [];
  
    async connectedCallback() {
        super.connectedCallback();        
    }

    async connectedCallback() {
    
        super.connectedCallback();
        
        await this.readAdministracoes();
    }

     async readAdministracoes() {
            await executarOperacao({
                idBotao: 'cadastrarBtn',
                keyTextoAguarde: 'Consultando...',
                apiCall: listarAdministracoes,
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

customElements.define('administracao-field', Administracao_Field);