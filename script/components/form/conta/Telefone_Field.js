import { Base_Field } from '../../base/Base_Field.js';

class Telefone_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_telefone    : "Telefone", 
            ph_telefone     : "Adicione um número de telefone",
            tp_lbl_telefone : "Contato com a instituião (Escola)",
            erro            : "Por favor, digite um número de telefone válido"       
        },

        es: {
            lbl_telefone    : "Teléfono", 
            ph_telefone     : "Agregar un número de teléfono",
            tp_lbl_telefone : "Contactar con la institución (Escuela)",
            erro            : "Por favor, introduzca un número de teléfono válido."
        }
    };

    // 2. Inicialização
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.connectedCallback();
        super.initTooltip();
        this.configurarMascaraTelefone();
    }

    // 4. Renderização
    renderControl(p) {       
        return `<div class="campo">
                    <label  class          ="field-label"  
                            for            ="${p.id}" 
                            data-translate ="${p.data_translate_label}">
                            ${p.label}
                    </label>
                    <i  class          ="${p.icon_question}" 
                        data-tooltip   ="${p.data_tooltip_balao}" 
                        data-translate ="${p.data_translate_tooltip}">
                    </i>
                    <input type        ="text" 
                        id             ="${p.id}" 
                        name           ="${p.name}" 
                        class          ="field-input" 
                        data-translate ="${p.data_translate_ph}" 
                        placeholder    ="${p.placeholder}" 
                        autocomplete   ="off" 
                        ${p.is_required}>
                    </input>                    
                </div>
        `;        
    }

    // 5. Métodos de Validação
     /** @override */
    validar() {
        return this.validarTelefone(); 
    }

    async configurarValidacao() {
        const input = this.control;  
        if (input) {
            input.addEventListener('blur', () => this.validarTelefone());
            input.addEventListener('input', () => this.limparEstado()); 
        }
    }

    configurarMascaraTelefone() {
        const official_language = sessionStorage.getItem('official_language') || 'pt';
        
        const campo = this.control;
        
        if (campo) {
            
            // 1. Aplica a máscara enquanto digita e limpa erros visuais
            campo.addEventListener('input', (e) => {
                console.log("Chamou o addEventListener..");
                e.target.value = this.aplicarMascaraTelefone(e.target.value);
                this.limparEstado();
            });

            // 2. Valida o tamanho final ao sair do campo (Mensagem de Erro)
            campo.addEventListener('blur', () => {
                const valorLimpo = campo.value.replace(/\D/g, "");
                
                // Verifica se o telefone tem o tamanho mínimo (10 para fixo ou 11 para celular)
                if (valorLimpo.length < 10) {                   
                    
                    // Busca a mensagem no i18n da classe atual
                    const mensagem = Telefone_Field.i18n[official_language].erro;
                    this.marcarErro(mensagem);
                    return false;
                } else {
                    this.marcarSucesso();
                    return true;
                }
            });


        }
    }

    aplicarMascaraTelefone(valor) {
        if (!valor) return "";
        valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
        valor = valor.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses no DDD
        
        // Lógica dinâmica para o hífen:
        if (valor.length > 13) {
            // Celular: (00) 00000-0000 (14 ou 15 caracteres com máscara)
            valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
        } else {
            // Fixo: (00) 0000-0000
            valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
        }
        
        return valor.substring(0, 15); // Limita ao tamanho máximo de celular
    }



    // async validarTelefone() {
    //     const official_language = sessionStorage.getItem('official_language') || 'pt';
        
    //     const telefone = this.control;
    //     const valor = telefone.value.trim();
    
    //     // (00) 0000-0000 -> 14 caracteres
    //     // (00) 00000-0000 -> 15 caracteres
    //     if (valor.length > 0 && valor.length < 14) {
    //         const mensagem = Telefone_Field.i18n[official_language].erro;
    //         this.marcarErro( mensagem );
    //         return false;
    //     }
    
    //     marcarSucesso(telefone);
    
    //     return true;
    // }
    
}

// 6. Definição do Web Component
customElements.define('telefone-field', Telefone_Field);