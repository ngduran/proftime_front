import { applyTranslations } from '../../utils/i18n/login_i18n.js';
import { Base_Field } from '../../base/Base_Field.js';

class Senha_Field extends Base_Field {
    constructor() {
        super();
    }
    
    connectedCallback() {
        super.render(); 

        // Tradução inicial na carga do componente
        applyTranslations(this.shadowRoot);

        // Escuta a mudança global de idioma
        window.addEventListener('languageChanged', () => {
            applyTranslations(this.shadowRoot);            
        });

        super.setupBase();
        super.initTooltip();
        //super.initEdition();
        this.configurarValidacao();
        this.configurarMostrarSenha();
    }

    renderControl(p) {       
        return `<div class="campo">
                    <label class="field-label"  for="${p.id}" data-translate="${p.data_translate_label}">${p.label}</label>
                    <i class="${p.icon_question}" data-tooltip="${p.data_tooltip_balao}" data-translate="${p.data_translate_tooltip}"></i>
                    <input type="password" id="${p.id}" name="${p.name}" class="field-input" data-translate="${p.data_translate_ph}" placeholder="${p.placeholder}" autocomplete="off" ${p.is_required}>
                    </input>                    
                </div>
        `;        
    }

    
    async validar() {        
        return this.validarForcaSenha(); 
    }

    async configurarValidacao() {
        const input = this.shadowRoot.querySelector(".field-input");    
        
        if (input) {
            input.addEventListener('blur', () => {
                this.limparEstado();
            });
        }
       
    }

    async configurarValidacao() {
        // Usamos o getter 'control' da Base_Field para pegar o input
        const input = this.control; 
        
        if (input) {
            // Valida quando o usuário sai do campo
            input.addEventListener('blur', () => {
                this.validarForcaSenha();
            });

            // Opcional: Limpa o erro enquanto o usuário digita
            input.addEventListener('input', () => {
                this.limparEstado(); 
            });
        }
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
        // 1. Obtém o valor através do getter 'value' da Base_Field
        const senha = this.value;

        // 2. Regex completa: Maiúscula, Minúscula, Número, Símbolo e 8+ caracteres
        const regexComplexidade = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

        // 3. Validação lógica
        if (!regexComplexidade.test(senha)) {
            // Usa o marcarErro da Base_Field que já acessa o Shadow DOM corretamente
            this.marcarErro("8 ou + caracteres: Maiúscula, Minúscula, Número, Símbolo.");
            return false;
        }

        // 4. Caso passe, marca sucesso usando a estrutura da base
        this.marcarSucesso();
        return true;
    }    
        
}

customElements.define('senha-field', Senha_Field);