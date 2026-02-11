import { inicializarI18n } from "../components/utils/i18n/i18n-helper.js";
import { executarOperacao } from "../core/api-engine.js";
import { efetuarLogin } from "../services/api_service.js";
import { capturarDadosFormulario, navegarPara, simplificarDados, validarFormulario } from "../utils/form-helper.js";
import { Mensagem } from "../utils/mensageiro.js";

// 1. DICIONÁRIO DE INTERFACE ESTÁTICA (Textos que não são Web Components)
const dicionarioLogin = {

    pt: {
        lbl_titulo              : "Login",
        lbl_mostrar_senha       : "Mostrar Senha",
        lbl_btn_entrar          : "Entrar",
        lbl_link_esqueceu_senha : "Esqueceu a senha?",
        lbl_btn_criar_conta     : "Criar Conta",
        lbl_link_reenviar_email : "Reenviar email"
    },
    
    es: {
        lbl_titulo              : "Acceso",
        lbl_mostrar_senha       : "Mostrar contraseña",
        lbl_btn_entrar          : "Para entrar",
        lbl_link_esqueceu_senha : "¿Olvidaste tu contraseña?",
        lbl_btn_criar_conta     : "Crear una cuenta",
        lbl_link_reenviar_email : "Reenviar correo electrónico"
    }
};

const seletoresLogin = [
    'email-field',
    'senha-field'      
];

document.addEventListener('DOMContentLoaded', () => {
    // Uma única linha inicializa tudo!
    inicializarI18n(dicionarioLogin);
});














// 2. FUNÇÕES DE TRADUÇÃO
// function traduzirInterfaceEstatica(lang) {
//     const elementos = document.querySelectorAll('[data-translate]');
//     elementos.forEach(el => {
//         const chave = el.getAttribute('data-translate');
//         // Verifica se a chave existe no dicionário para não apagar o texto por erro
//         if (dicionarioLogin[lang] && dicionarioLogin[lang][chave]) {
//             el.innerText = dicionarioLogin[lang][chave];
//         }
//     });
// }

// 3. EVENTOS GLOBAIS
// window.addEventListener('languageChanged', (e) => {
//     const lang = e.detail?.Language || e.detail?.language || e.detail;
//     traduzirInterfaceEstatica(lang);
// });

// 4. INICIALIZAÇÃO E CONTROLE DE UI
// document.addEventListener('DOMContentLoaded', () => {

//     // 1. GARANTIR IDIOMA PADRÃO NO STORAGE   
//     if (!sessionStorage.getItem('official_language')) {
//         sessionStorage.setItem('official_language', 'pt');
//     }
    
//     // 4.3 FUNÇÃO DE TROCA DE IDIOMA DO SISTEMA
//     const trocarIdiomaSistema = (lang) => {
      
//         sessionStorage.setItem('official_language', lang);

//         window.dispatchEvent(new CustomEvent('languageChanged', {
//             detail: { language: lang }
//         }));

        
//     };

//     // 4.4 OUVINTES DOS BOTÕES DE BANDEIRA
//     document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
//     document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));
   
   
// });

document.getElementById('criarConta').addEventListener('click', () => {
    navegarPara('conta');
});

document.getElementById('loginBtn').addEventListener('click', () => {
    executarTarefasLogar();
});

async function executarTarefasLogar() {
  
    if (!validarFormulario(seletoresLogin)) {
        Mensagem.erro("Existem campos inválidos no formulário");
        return;
    }

    const dadosConta = capturarDadosFormulario(seletoresLogin);

    const dadosParaAPI = simplificarDados(dadosConta);

    await executarOperacao({
        idBotao: 'loginBtn',
        textoAguarde: 'Entrando...',
        apiCall: efetuarLogin,
        dados: dadosParaAPI,
        mensagemSucesso: "Acesso realizado com sucesso!",
        sessionKey: "usuario_id", // O ID retornado será salvo aqui
        validacao: () => { }, 
                //onSuccess: () => navegarPara("horario_professor", true), // <--- Aqui resetamos o Shell principal
                onSuccess: () => navegarPara("horario_professor"), // <--- Aqui resetamos o Shell principal
                
                // AGORA VOCÊ PODE FAZER ISSO:
                onError: async (msg) => {
                    // Exibe o erro de forma amigável usando seu componente
                    await Mensagem.erro("Falha no Login", msg);
                }
        },

    );

}
