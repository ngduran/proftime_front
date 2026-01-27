import { Base_Field } from '../base/Base_Field.js';

class Senha_Field extends Base_Field {

    // 1. ATRIBUTOS ESTÁTICOS E CONFIGURAÇÃO
    static i18n = {
        pt: {
            lbl_senha    : "Senha", 
            ph_senha     : "Digite sua senha",
            tp_lbl_senha : "Senha utilizada para acessar o aplicativo",
            erro         : "Por favor, digite sua senha",
            
            lbl_confirmar_senha    : "Confirmar Senha",
            ph_confirmar_senha     : "Digite a senha novamente",
            tp_lbl_confirmar_senha : "Repita a senha para garantir que está correta",
            erro_confirmar_senha   : "Digite a senha novamente"
        },

        es: {
            lbl_senha    : "Contraseña",
            ph_senha     : "Introduzca su contraseña.",
            tp_lbl_senha : "Contraseña utilizada para acceder a la aplicación.",
            erro         : "Por favor, introduzca su contraseña.",

            lbl_confirmar_senha    : "Confirmar contraseña",
            ph_confirmar_senha     : "Ingrese la contraseña nuevamente",
            tp_lbl_confirmar_senha : "Repita la contraseña para asegurarse de que sea correcta",
            erro_confirmar_senha   : "Repita la contraseña"
        }
    };

    // 2. CICLO DE VIDA E INICIALIZAÇÃO
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.connectedCallback();
        super.initTooltip();
        
        queueMicrotask(() => {
            this.configurarMostrarSenha('mostrarSenha'); // Chama aqui!
            this.setupEventListeners();        
        });
              
        window.addEventListener('senha-selecionado', (e) => this.handleSenhaGlobalChange(e));
   
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
    

    // 4. EVENTOS E COMPORTAMENTO DE INTERFACE
    setupEventListeners() {
        
        const control = this.control; // Usa o getter genérico da Base_Field
        if (!control) {
            console.error(
            `%c[ERRO] %cControle não encontrado para: ${this.id}`,
            "color: white; background: red; font-weight: bold; padding: 2px 5px; border-radius: 3px;",
            "color: red;"
        );
            return;
        }

        console.log(
            `%c[SETUP] %c${this.id} %c[Scope: ${this.scope}]`,
            "color: #007bff; font-weight: bold;", 
            "color: #333; font-weight: bold;",
            "color: #666; font-style: italic;"
        );

        // 1. Evento de Mudança (Lógica de Negócio + Validação)
        control.addEventListener('change', (e) => {
            console.log(
                `%c[CHANGE] %c${this.id}: %c"${e.target.value}"`,
                "color: #28a745; font-weight: bold;", 
                "color: #333;",
                "color: #555; font-style: italic;"
            );
            this.validar(); // Chama o método de validação genérico
            this.emitirMudanca(e.target.value);
        });

        // 2. Evento de Perda de Foco (Validação de interface)
        control.addEventListener('blur', () => {
            console.log(
                `%c[BLUR] %cSaindo de: ${this.id}`, 
                "color: #fd7e14; font-weight: bold;", "color: #333;"
            );
            this.validar();
        });

        // 3. Evento de Entrada (Limpa erros enquanto o usuário tenta corrigir)
        control.addEventListener('input', () => {
            // Logamos apenas que está digitando para não inundar o console com cada letra, 
            // mas confirmamos que o estado de erro está sendo limpo.
            if (this.classList.contains('error')) {
                console.log(
                    `%c[LIMPAR] %cUsuário corrigindo erro em: ${this.id}`,
                    "color: #6f42c1; font-weight: bold;",
                    "color: #333;"
                );
            }
            this.limparEstado();
        });
    }

    async configurarMostrarSenha(idCheckbox = 'mostrarSenha') {
        const checkbox = document.getElementById(idCheckbox);
        const inputSenha = this.control; //

        if (!checkbox || !inputSenha) {
            // Log discreto caso o checkbox não exista na página atual
            console.warn(`%c[AVISO] %cCheckbox '${idCheckbox}' não encontrado para ${this.id}`, "color: orange; font-weight: bold;", "");
            return;
        }

        checkbox.addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            inputSenha.type = isChecked ? 'text' : 'password';

            // Log de Visualização (Azul Marinho)
            console.log(
                `%c VISIBILIDADE %c ${this.id.toUpperCase()} %c agora está %c ${inputSenha.type.toUpperCase()} `,
                "background: #191970; color: #fff; font-weight: bold; font-size: 12px; border-radius: 3px;",
                "color: #000; font-weight: bold;",
                "color: #666;",
                isChecked ? "color: #28a745; font-weight: bold;" : "color: #dc3545; font-weight: bold;"
            );
        });
    }

    // 5. COMUNICAÇÃO ENTRE COMPONENTES (EVENT BUS)
    /**
     * Emite um evento customizado baseado no nome do componente
     * @param {string} valor - O valor selecionado
     */
    emitirMudanca(valor) {
        // Usamos os getters da Base_Field para manter o código limpo
        const eventName = `${this.tagName.toLowerCase().replace('-field', '')}-selecionado`;

        // Log de Saída (Fundo Amarelo, Texto Preto, Fonte Grande)
        console.log(
            `%c EVENTO-OUT %c ${this.id.toUpperCase()} %c disparou %c ${eventName} %c Scope: ${this.scope} `,
            // Estilo do [EVENTO-OUT]
            "background: #FFD700; color: #000; font-weight: bold; font-size: 14px; border-radius: 3px;", 
            // Estilo do ID (Negrito e maior)
            "color: #000; font-weight: bold; font-size: 14px;", 
            // Estilo do "disparou"
            "color: #666; font-size: 12px;", 
            // Estilo do Nome do Evento (Sublinhado e Azul)
            "color: #007bff; font-weight: bold; font-size: 14px; text-decoration: underline;",
            // Estilo do Scope (Fundo Cinza claro para destacar)
            "background: #eee; color: #333; font-size: 12px; border-radius: 3px; padding: 0 5px;"
        );

        this.dispatchEvent(new CustomEvent(eventName, {
            detail: { 
                value: valor,
                scope: this.scope,
                elementId: this.id // Útil para identificar quem disparou em formulários grandes
            },
            bubbles: true,
            composed: true 
        }));
    }

    handleSenhaGlobalChange(e) {
        // Log de Entrada (Fundo Ciano, Fonte Grande)
        console.log(
            `%c EVENTO-IN %c ${this.id.toUpperCase()} %c recebeu de %c ${e.detail.elementId.toUpperCase()} `,
            "background: #00ced1; color: #000; font-weight: bold; font-size: 14px; border-radius: 3px;", 
            "color: #000; font-weight: bold; font-size: 14px;", 
            "color: #666; font-size: 12px;", 
            "background: #eee; color: #333; font-weight: bold; font-size: 14px; border-radius: 3px; padding: 0 5px;"
        );

        // Lógica de Comparação
        if (this.scope === 'confirmar_senha' && e.detail.scope === 'senha') {
            this._senhaPrincipalReferencia = e.detail.value;
            console.log(`%c[SYNC] %c${this.id}: Referência atualizada para comparação.`, "color: #28a745; font-weight: bold;", "color: #333;");
            
            if (this.value.length > 0) {
                this.validar();
            }
        }
    }

    // 6. MÉTODOS DE VALIDAÇÃO
    validar() {
        const scope = this.getAttribute('scope');
        const official_language = sessionStorage.getItem('official_language') || 'pt';

        // 1. Lógica para o campo principal
        if (scope === 'senha') {
            return this.validarForcaSenha();
        }

        // 2. Lógica para o campo de confirmação
        if (scope === 'confirmar_senha') {
            if (this.value !== this._senhaPrincipalReferencia) {
                this.marcarErro(this.constructor.i18n[official_language].erro_confirmar_senha);
                return false;
            }
        }

        this.marcarSucesso();
        return true;
    }

    async validarForcaSenha() {

        const official_language = sessionStorage.getItem('official_language') || 'pt';
        // 1. Obtém o valor através do getter 'value' da Base_Field
        const senha = this.value;

        // 2. Regex completa: Maiúscula, Minúscula, Número, Símbolo e 8+ caracteres
        const regexComplexidade = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        // 3. Validação lógica
        if (!regexComplexidade.test(senha)) {
            const mensagem = Senha_Field.i18n[official_language].erro;
            this.marcarErro( mensagem );
            return false;
        }

        // 4. Caso passe, marca sucesso usando a estrutura da base
        this.marcarSucesso();
        return true;
    }

    async validarSenhasIguais() {    
        const inputSenha = document.getElementById('senha');
        const inputConfirmarSenha = document.getElementById('confirmarSenha');
    
        // 1. Se estiver vazio, não marca sucesso nem erro (deixa para o validarFormulario)
        if (inputSenha.value === "" || inputConfirmarSenha.value === "") {        
            return false; 
        }
        
        // 2. Se forem diferentes
        if (inputSenha.value !== inputConfirmarSenha.value) {                      
            marcarErro(inputConfirmarSenha, "As senhas não conferem.");
            return false;
        }
       
        marcarSucesso(inputConfirmarSenha);
    
        return true;
    }
        
}

// 7. DEFINIÇÃO DO WEB COMPONENT
customElements.define('senha-field', Senha_Field);