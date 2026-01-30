import { Base_Select } from "../../base/Base_Select.js";

class Administracao_Field extends Base_Select {

    static i18n = {
        pt: {
            lbl_administracao    : "Administração",           
            tp_lbl_administracao : "Informe o sistema de Administração",

            ph_administracao_op0 : "Selecione uma Administração",

            ph_administracao_op1 : "Federal",
            ph_administracao_op2 : "Estadual",
            ph_administracao_op3 : "Municipal",
            ph_administracao_op4 : "Privada",
            ph_administracao_op5 : "Público Privada",
            ph_administracao_op6 : "Particular",
           
            data_translate_op  : "Selecione uma Administração",
            data_translate_op1 : "Federal",
            data_translate_op2 : "Estadual",
            data_translate_op3 : "Municipal",
            data_translate_op4 : "Privada",
            data_translate_op5 : "Público Privada",
            data_translate_op6 : "Particular",            

            erro                 : "Campo Obrigatório"       
        },

        es: {
            lbl_administracao    : "Administración",           
            tp_lbl_administracao : "Informar al sistema de Administración",

            ph_administracao_op0 : "Seleccione una Administración",

            ph_administracao_op1 : "Federal",
            ph_administracao_op2 : "Estado",
            ph_administracao_op3 : "Municipal",
            ph_administracao_op4 : "Privado",
            ph_administracao_op5 : "Público Privado",
            ph_administracao_op6 : "Particular",
           
            data_translate_op  : "Seleccione una Administración",
            data_translate_op1 : "Federal",
            data_translate_op2 : "Estado",
            data_translate_op3 : "Municipal",
            data_translate_op4 : "Privado",
            data_translate_op5 : "Público Privado",
            data_translate_op6 : "Particular",            

            erro                 : "Campo obligatorio"     
        }
    };

  
    async connectedCallback() {
        super.connectedCallback();        
    }

    renderControl(p) {   
        console.log("%c[RENDER-CONTROL] Administracao_Field", "color: #007bff; font-weight: bold;", "ID:", p.id);
        
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <select id="${p.id}" name="${p.name}" class="field-select"
                        autocomplete="off" ${p.is_required}>

                        ${this.renderOptions(p)}
                        
                    </select>
                    <button type="button" class="edit-button">
                        <i class="${p.icon_edicao}"></i>
                    </button>
                </div>
        `;       
    }

    /**
     * @override
     * Sobrescrevemos apenas as opções. A Base_Select chamará isso 
     * automaticamente dentro do select que ela criou.
     */
    renderOptions(p) {
        console.log("%c[RENDER-OPTIONS] Administracao_Field", "color: #28a745; font-weight: bold;", "Preenchendo opções fixas...");
        // Note que usamos as props que você passou no HTML
        
        // Rastreamento de dados das props
        console.dir(p); 
        
        // 1. Detecta o idioma (respeitando sua regra de início de página)
        const lang = sessionStorage.getItem('official_language') || 'pt';
    
        // 2. Aponta para o dicionário interno do componente
        const dict = Administracao_Field.i18n[lang] || Administracao_Field.i18n['pt'];
        
        
        return `
            <option value=""                data-translate="${dict.data_translate_op}">${dict.ph_administracao_op0}</option>
            <option value="Federal"         data-translate="${dict.data_translate_op1}">${dict.ph_administracao_op1}</option>
            <option value="Estadual"        data-translate="${dict.data_translate_op2}">${dict.ph_administracao_op2}</option>
            <option value="Municipal"       data-translate="${dict.data_translate_op3}">${dict.ph_administracao_op3}</option>
            <option value="Privada"         data-translate="${dict.data_translate_op4}">${dict.ph_administracao_op4}</option>
            <option value="Publico_Privada" data-translate="${dict.data_translate_op5}">${dict.ph_administracao_op5}</option>
            <option value="Particular"      data-translate="${dict.data_translate_op6}">${dict.ph_administracao_op6}</option>
        `;
    }

    































    // renderControl(p) {   
        
    //     return `<div class="campo">
    //                 <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
    //                 <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
    //                 <select id="${p.id}" name="${p.name}" class="field-select"
    //                     autocomplete="off" ${p.is_required}>
    //                     <option value="" data-translate="${p.data_translate_op}">${p.placeholder}</option>

    //                     <option value="Federal"         data-translate="${p.data_translate_op1}"></option>
    //                     <option value="Estadual"        data-translate="${p.data_translate_op2}"></option>
    //                     <option value="Municipal"       data-translate="${p.data_translate_op3}"></option>
    //                     <option value="Privada"         data-translate="${p.data_translate_op4}"></option>
    //                     <option value="Publico_Privada" data-translate="${p.data_translate_op5}"></option>
    //                     <option value="Particular"      data-translate="${p.data_translate_op6}"></option>
                        
    //                 </select>
    //                 <button type="button" class="edit-button">
    //                     <i class="${p.icon_edicao}"></i>
    //                 </button>
    //             </div>
    //     `;       
    // }

}

customElements.define('administracao-field', Administracao_Field);