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

                // 3. RECONECTA OS EVENTOS usando o método da base
                // Isso fará os logs [CHANGE] e [VALIDATE] voltarem a aparecer
                
                //this.setupEventListeners();

                //this.connectedCallback();

                // 3. Ajuste Geométrico usando getContainerInfo
                // requestAnimationFrame(() => {
                //     const info = this.getContainerInfo();
                //     const select = this.shadowRoot.querySelector('.field-select');
                //     const container = this.shadowRoot.querySelector('.campo');

                //     if (!info.erro && select && container) {
                //         const larguraAlvo = `${info.posicaoHorizontal.largura}px`;

                //         // 1. Forçamos o container a ser um bloco rígido que não expande
                //         container.style.display = "block";
                //         container.style.width = larguraAlvo;
                //         container.style.minWidth = larguraAlvo;
                //         container.style.maxWidth = larguraAlvo;

                //         // 2. Aplicamos o "Reset" de aparência no select para ele obedecer o CSS
                //         select.style.appearance = "none"; 
                //         select.style.webkitAppearance = "none";
                        
                //         // 3. Travamento absoluto de largura
                //         select.style.width = "100%"; // Ele vai ocupar 100% dos 760px do container
                //         select.style.maxWidth = "100%";
                //         select.style.boxSizing = "border-box";
                        
                //         // Para evitar que o texto longo empurre o layout, forçamos o corte
                //         select.style.overflow = "hidden";
                //         select.style.textOverflow = "ellipsis";
                //     }
                // });

            }     
        });
    }

}

customElements.define('instituicao-select', Instituicao_Select);