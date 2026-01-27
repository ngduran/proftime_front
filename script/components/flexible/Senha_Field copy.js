import { Base_Field } from '../base/Base_Field.js';

class Senha_Field extends Base_Field {

    // 1. Atributos Estáticos
    static i18n = {
        pt: {
            lbl_senha    : "Senha", 
            ph_senha     : "Digite sua senha",
            tp_lbl_senha : "Senha utilizada para acessar o aplicativo",
            erro         : "Por favor, digite sua senha",
            
            // Novas chaves para a confirmação:
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

            // Novas chaves para a confirmação:
            lbl_confirmar_senha    : "Confirmar contraseña",
            ph_confirmar_senha     : "Ingrese la contraseña nuevamente",
            tp_lbl_confirmar_senha : "Repita la contraseña para asegurarse de que sea correcta",
            erro_confirmar_senha   : "Repita la contraseña"
        }
    };

    // 2. Inicialização
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.connectedCallback();
        super.initTooltip();

        // SUBSTITUIDA PELA CHAMADA ABAIXO
        // SUBSTITUIDA PELA CHAMADA ABAIXO
        //this.configurarValidacao();

        this.setupEventListeners();
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
    

    // 5. Métodos de Validação
     /** @override */
    validar() {
        return this.validarForcaSenha(); 
    }

    // SUBSTITUINDO A FUNÇÃO PELA DE BAIXO
    // SUBSTITUINDO A FUNÇÃO PELA DE BAIXO
    // SUBSTITUINDO A FUNÇÃO PELA DE BAIXO
    // async configurarValidacao() {
    //     const input = this.control;  
    //     if (input) {
    //         input.addEventListener('blur', () => this.validarForcaSenha());
    //         input.addEventListener('input', () => this.limparEstado()); 
    //     }
    // }

    setupEventListeners() {
        const control = this.control; // Usa o getter genérico da Base_Field
        if (!control) return;

        // 1. Evento de Mudança (Lógica de Negócio + Validação)
        control.addEventListener('change', (e) => {
            this.validar(); // Chama o método de validação genérico
            this.emitirMudanca(e.target.value);
        });

        // 2. Evento de Perda de Foco (Validação de interface)
        control.addEventListener('blur', () => {
            this.validar();
        });

        // 3. Evento de Entrada (Limpa erros enquanto o usuário tenta corrigir)
        control.addEventListener('input', () => {
            this.limparEstado();
        });
    }

    /**
     * Emite um evento customizado baseado no nome do componente
     * @param {string} valor - O valor selecionado
     */
    emitirMudanca(valor) {
        // Captura o 'scope' ou define 'default' se não existir
        const scope = this.getAttribute('scope') || 'default';
        
        // Torna o nome do evento dinâmico (ex: se o componente for 'Estado_Field', vira 'estado-change')
        const eventName = `${this.tagName.toLowerCase().replace('-field', '')}-selecionado`;

        this.dispatchEvent(new CustomEvent(eventName, {
            detail: { 
                value: valor,
                scope: scope,
                elementId: this.id // Útil para identificar quem disparou em formulários grandes
            },
            bubbles: true,
            composed: true 
        }));
    }




    async configurarMostrarSenha(idCheckbox = 'mostrarSenha') {
        // 1. O checkbox está no documento principal (fora do Shadow DOM)
        const checkbox = document.getElementById(idCheckbox);
        
        // 2. O input de senha está dentro do seu componente (Shadow DOM)
        // Usamos o getter 'control' que você já definiu no Base_Field
        const inputSenha = this.control;

        if (!checkbox || !inputSenha) return;

        // Ouvimos a mudança no checkbox externo
        checkbox.addEventListener('change', (event) => {
            // Se marcado 'text' (visível), se desmarcado 'password' (bolinhas)
            inputSenha.type = event.target.checked ? 'text' : 'password';
        });
    }

    // Dentro da classe Senha_Field que estende Base_Field
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
        
}

// 6. Definição do Web Component
customElements.define('senha-field', Senha_Field);