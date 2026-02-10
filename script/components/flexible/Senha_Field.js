import { Base_Field } from '../base/Base_Field.js';

class Senha_Field extends Base_Field {

    // 1. ATRIBUTOS ESTÁTICOS E CONFIGURAÇÃO
    static i18n = {
        pt: {
            lbl_senha    : "Senha", 
            ph_senha     : "Digite sua senha",
            tp_lbl_senha : "Senha utilizada para acessar o aplicativo",
            
            lbl_confirmar_senha    : "Confirmar Senha",
            ph_confirmar_senha     : "Digite a senha novamente",
            tp_lbl_confirmar_senha : "Repita a senha para garantir que está correta",
            erro_confirmar_senha   : "Digite a senha novamente",
            
            // Mensagens de Erro Numéricas
            erro_1: "Por favor, digite uma senha",
            erro_2: "A senha deve ter 8+ caracteres, maiúsculas, números e símbolos",
            erro_3: "As senhas não conferem"
        },

        es: {
            lbl_senha    : "Contraseña",
            ph_senha     : "Introduzca su contraseña.",
            tp_lbl_senha : "Contraseña utilizada para acceder a la aplicación.",         

            lbl_confirmar_senha    : "Confirmar contraseña",
            ph_confirmar_senha     : "Ingrese la contraseña nuevamente",
            tp_lbl_confirmar_senha : "Repita la contraseña para asegurarse de que sea correcta",
            erro_confirmar_senha   : "Repita la contraseña",

            // Mensagens de Erro Numéricas
            erro_1: "Por favor, introduzca su contraseña.",
            erro_2: "La contraseña debe tener 8+ caracteres, mayúsculas, números y símbolos",
            erro_3: "Las contraseñas no coinciden"
        }
    };

    constructor() {
        super();
        this._senhaPrincipalReferencia = ""; // Armazena o valor do campo 'irmão'
    }
    
    connectedCallback() {
        super.connectedCallback(); // Registra delegados (blur/change) e Managers
        
        // Listener Global para sincronização entre campos de senha
        window.addEventListener('senha-selecionado', this.handleSenhaGlobalChange);
        
        queueMicrotask(() => {
            this.configurarMostrarSenha();
        });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('senha-selecionado', this.handleSenhaGlobalChange);
    }

    // 3. RENDERIZAÇÃO
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
                    <input type        ="password" 
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
    
    // 2. MODO "OLHINHO" (MOSTRAR SENHA)
    configurarMostrarSenha(idCheckbox = 'mostrarSenha') {
        const checkbox = document.getElementById(idCheckbox);
        if (!checkbox) return;

        checkbox.addEventListener('change', (e) => {
            const input = this.control;
            if (input) input.type = e.target.checked ? 'text' : 'password';
        });
    }

    // 3. VALIDAÇÃO (O ponto central)
    /** @override 
     * Chamado automaticamente pela Base_Field via delegação no blur/change
     */
    validar() {
        const lang = sessionStorage.getItem('official_language') || 'pt';
        const dict = Senha_Field.i18n[lang] || Senha_Field.i18n['pt'];
        const valor = this.value;

        // 1. Validação de Obrigatoriedade (Se sair sem digitar nada)
        if (!valor) {            
            this.marcarErro(dict.erro_1);
            return false;           
        }

        // 2. Validação de Complexidade (Apenas se for o campo 'senha')
        if (this.scope === 'senha') {
            const regexComplexidade = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
            if (!regexComplexidade.test(valor)) {
                this.marcarErro(dict.erro_2);
                return false;
            }
        }

        // 3. Validação de Igualdade (Apenas se for o campo 'confirmar_senha')
        if (this.scope === 'confirmar_senha') {
            if (valor !== this._senhaPrincipalReferencia) {
                this.marcarErro(dict.erro_3);
                return false;
            }
        }
        
        this.marcarSucesso();
        this.emitirMudanca(valor);
        return true;
    }
  
    // 4. COMUNICAÇÃO (EVENT BUS)
    emitirMudanca(valor) {
        this.dispatchEvent(new CustomEvent('senha-selecionado', {
            detail: { 
                value: valor,
                scope: this.scope,
                elementId: this.id 
            },
            bubbles: true,
            composed: true 
        }));
    }

    handleSenhaGlobalChange = (e) => {
        // Se eu sou o campo de confirmação e recebi um evento do campo principal
        if (this.scope === 'confirmar_senha' && e.detail.scope === 'senha') {
            this._senhaPrincipalReferencia = e.detail.value;
            
            // Se eu já tiver algum valor digitado, re-valido na hora
            if (this.value.length > 0) {
                this.validar();
            }
        }
    };
        
}

// 7. DEFINIÇÃO DO WEB COMPONENT
customElements.define('senha-field', Senha_Field);