// import { navegarPara } from "../utils/form-helper.js";
// import { executarOperacao } from "../core/api-engine.js"
// import { cadastrarInstituicao } from "../services/api_service.js";
// import { changeLanguage } from "../components/utils/i18n/instituicao_i18n.js";


// // 1. Selecionamos o formulário pai que contém os Web Components
// const formInstituicao = document.getElementById('instituicaoForm');

// // 2. Eventos de Navegação
// document.getElementById('voltarBtn').addEventListener('click', () => navegarPara('home'));

// // 3. Eventos de Idioma
// document.addEventListener('DOMContentLoaded', () => {
//     // Vincular cliques
//     document.getElementById('btn-pt').addEventListener('click', () => changeLanguage('pt'));
//     document.getElementById('btn-es').addEventListener('click', () => changeLanguage('es'));
// });

// // 4. O Botão Salvar agora delega a responsabilidade
// document.getElementById('cadastrarBtn').addEventListener('click', salvar);


// async function salvar() {
//     console.log("chamou o  salvar");

//     // Buscamos todos os Web Components que possuem o método validar()
//     const campos = Array.from(formInstituicao.querySelectorAll('*'))
//                         .filter(el => typeof el.validar === 'function');

//     console.log("=======================================================================");
//     console.log(campos);
//     console.log("=======================================================================");

//     await executarOperacao({
//         idBotao: 'cadastrarBtn',
//         textoAguarde: 'Salvando...',
//         apiCall: () => {
//             const dados = {};
//             campos.forEach(campo => {
//                 dados[campo.id] = campo.value; 
//             });

//             console.log("###################################################################");
//             console.log(dados);
//             console.log("###################################################################");

//             return cadastrarInstituicao(dados);
//         },
//         mensagemSucesso: "A Instituição foi criada com sucesso!",
//         validacao: async  () => {
//             // 1. Promise.all espera todos os validar() resolverem (sejam eles async ou não)
//             const resultados = await Promise.all(campos.map(campo => campo.validar()));

//             console.log("-----------------------------------------------------------");
//             console.log(resultados);
//             console.log("-----------------------------------------------------------");
            
//             // 2. O every verifica se TODOS os itens no array de resultados são true
//             // Se houver um único false, ele retorna false para a engine e NÃO salva
//             return resultados.every(res => res === true);
//         },
//         onSuccess: () => navegarPara("home")
//     });

// }


const dicionarioInstituicao = {

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






// 2. FUNÇÕES DE TRADUÇÃO
function traduzirInterfaceEstatica(lang) {
    const elementos = document.querySelectorAll('[data-translate]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-translate');
        // Verifica se a chave existe no dicionário para não apagar o texto por erro
        if (dicionarioInstituicao[lang] && dicionarioInstituicao[lang][chave]) {
            el.innerText = dicionarioInstituicao[lang][chave];
        }
    });
}

// 3. EVENTOS GLOBAIS
// Escuta o evento global para traduzir o que for estático na página
// Escuta o mesmo evento que os componentes já usam!
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail?.Language || e.detail?.language || e.detail;
    traduzirInterfaceEstatica(lang);
});

// 4. INICIALIZAÇÃO E CONTROLE DE UI
document.addEventListener('DOMContentLoaded', () => {

    // 1. GARANTIR IDIOMA PADRÃO NO STORAGE
    // Se não houver nada definido, ele seta 'pt' automaticamente
    if (!sessionStorage.getItem('official_language')) {
        sessionStorage.setItem('official_language', 'pt');
        
        console.log(
            "%c[INIT] %c'official_language' inicializado como: %c PT ",
            "color: #007bff; font-weight: bold;", 
            "color: #333;",
            "background: #28a745; color: #fff; font-weight: bold; border-radius: 3px;"
        );
    }

    
    // 4.3 FUNÇÃO DE TROCA DE IDIOMA DO SISTEMA
    const trocarIdiomaSistema = (lang) => {
        // 1. Salva para persistência (O Base_Field lê daqui no translate)
        sessionStorage.setItem('official_language', lang);

        // --- LOG DE VERIFICAÇÃO DE STORAGE ---
        console.log(
            `%c[CHECKPOINT-STORAGE] %cValor enviado: %c${lang} %c| No Storage: %c${sessionStorage.getItem('official_language')}`,
            "color: #000; font-weight: bold;", 
            "color: #666;", 
            "background: #fffbe6; color: #856404; font-weight: bold; border: 1px solid #ffe58f;", // Destaque Amarelo
            "color: #666;",
            "color: #28a745; font-weight: bold;"
        );

        // 2. Dispara o evento para os Web Components reagirem
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        // Log de rastreio com as cores que você consegue ver bem
        const cor = lang === 'pt' ? '#28a745' : '#dc3545';
        console.log(
            `%c[SISTEMA] %cIdioma definido como: %c ${lang.toUpperCase()} `,
            "color: #333; font-weight: bold;",
            "color: #666;",
            `background: ${cor}; color: #fff; font-weight: bold; border-radius: 3px;`
        );
    };

    // 4.4 OUVINTES DOS BOTÕES DE BANDEIRA
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));

});