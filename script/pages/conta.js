import { executarOperacao } from "../core/api-engine.js";
import { Mensagem } from "../utils/mensageiro.js";
import { cadastrarUsuario } from "../services/api_service.js";
import { capturarDadosFormulario, navegarPara, simplificarDados, validarFormulario } from "../utils/form-helper.js";

// 1. DICIONÁRIO DE INTERFACE ESTÁTICA (Textos que não são Web Components)
const dicionarioConta = {

    pt: {
        lbl_titulo              : "Conta",
        lbl_mostrar_senha       : "Mostrar Senha",
        lbl_voltarBtn           : "Voltar",
        lbl_cadastrarBtn        : "Salvar"        
    },
    
    es: {
        lbl_titulo              : "Cuenta",
        lbl_mostrar_senha       : "Mostrar contraseña",
        lbl_voltarBtn           : "Para volver atrás",
        lbl_cadastrarBtn        : "Ahorrar"
    }
};

const seletoresConta = [
    'nome-field',
    'usuario-field',
    'email-field',
    'telefone-field',
    'senha-field'   
];

document.addEventListener('DOMContentLoaded', () => {
    // Uma única linha inicializa tudo!
    inicializarI18n(dicionarioConta);
});

// 2. FUNÇÕES DE TRADUÇÃO
// function traduzirInterfaceEstatica(lang) {
//     const elementos = document.querySelectorAll('[data-translate]');
//     elementos.forEach(el => {
//         const chave = el.getAttribute('data-translate');
        
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

// ======================================================================================
// 8. BOTÃO ADICIONAR (EVENTO)
// ======================================================================================
document.getElementById('cadastrarBtn').addEventListener('click', executarTarefasSalvar );

// ======================================================================================
// 9. ORQUESTRADOR DAS TAREFAS DO BOTÃO ADICIONAR
// ======================================================================================
async function executarTarefasSalvar() {

    // Passo 1: Validar os Web Components
    if (!validarFormulario(seletoresConta)) {
        Mensagem.erro("Existem campos inválidos no formulário");
        return; // Para aqui se houver erro
    }

    // Passo 2: Confirmar com o usuário
    const confirmou = await Mensagem.criarConta("Deseja criar a conta?");
    
    if (!confirmou) {        
        return; 
    }

    // Passo 3: Capturar os dados (Passo isolado para o log que você pediu)
    const dadosConta = capturarDadosFormulario();
   
    // 2. Transforma em um DTO simples que o Spring entende
    const dadosParaAPI = simplificarDados(dadosConta);

    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Salvando...',
        apiCall: cadastrarUsuario,
        dados: dadosParaAPI,
        mensagemSucesso: "A Conta foi criada com sucesso!",
        sessionKey: "usuario_id", // O ID retornado será salvo aqui
        validacao: () => { }, 
            onSuccess: () => navegarPara("home", true), // <--- Aqui resetamos o Shell principal
    
            onError: async (msg) => {
                // Exibe o erro de forma amigável usando seu componente
                await Mensagem.erro("Falha na criação da Conta", msg);
            }
        
        }      

    );

    
}

// function validarFormulario() {
//     console.log("\n%c >>> INICIANDO PROCESSO DE VALIDAÇÃO <<< ", "background: #2c3e50; color: #ecf0f1; font-weight: bold; padding: 5px; width: 100%;");

//     let todosValidos = true;

//     seletoresConta.forEach(tag => {
//         const campo = document.querySelector(tag);

//         // 1. Verifica se o componente existe
//         if (!campo) {
//             console.log(`%c AUSENTE %c <${tag}> não encontrado no DOM`, "background: #f39c12; color: white; font-weight: bold;", "color: #f39c12;");
//             todosValidos = false;
//             return;
//         }

//         // 2. Tenta executar o método validar() do componente
//         try {
//             const eValido = campo.validar();
//             const valor = campo.value;

//             if (eValido) {
//                 console.log(`%c OK %c <${tag.padEnd(20)}> | Valor: %c"${valor}"`, 
//                     "background: #2ecc71; color: white; font-weight: bold;", "color: #2ecc71;", "color: #34495e; font-style: italic;");
//             } else {
//                 console.log(`%c FALHA %c <${tag.padEnd(20)}> | Inválido`, 
//                     "background: #e74c3c; color: white; font-weight: bold;", "color: #e74c3c;");
//                 todosValidos = false;
//             }
//         } catch (err) {
//             console.log(`%c CRÍTICO %c <${tag}> sem método validar()`, "background: #8e44ad; color: white; font-weight: bold;", "color: #8e44ad;");
//             todosValidos = false;
//         }
//     });

//     const corFinal = todosValidos ? "background: #27ae60;" : "background: #c0392b;";
//     console.log(`%c FINALIZADO: ${todosValidos ? 'PRONTO' : 'CORRIJA OS ERROS'} `, `color: white; ${corFinal} font-weight: bold; padding: 5px;`);

//     return todosValidos;
// }

// ======================================================================================
// 11. CAPTURAR DADOS DO FORMULÁRIO
// ======================================================================================
/**
 * Captura os dados de todos os seletores e monta o objeto para o LocalStorage.
 * @returns {Object} Dados estruturados para salvamento.
 */
// function capturarDadosFormulario() {
    
//     const dadosCapturados = {};

//     console.group("%c 📦 Processando Captura Genérica ", "background: #34495e; color: white;");

//     seletoresConta.forEach(tag => {
//         const componente = document.querySelector(tag);

//         if (componente) {
//             // Usamos as propriedades getter que você definiu no Base_Field
//             const chave = componente.id; // Retorna o ID ou 'sem-id'
            
//             // Aqui criamos um sub-objeto para guardar ID e Texto (ou UUID e Texto)
//             // Se o seu componente tiver um método específico para pegar o texto 
//             // do label selecionado (no caso de selects), podemos usar aqui.
//             dadosCapturados[chave] = {
//                 valor: componente.value,
//                 texto: componente.textoSelecionado,
//                 nome:  componente.name
//             };

//             console.log(`%c CAPTURADO %c <${tag.padEnd(20)}> | Chave: ${chave}`, 
//                 "color: #2ecc71; font-weight: bold;", "color: #2c3e50;");
//         }
//     });

//     console.log("-------------- DADOS CAPTURADOS --------------------------------");
//     console.log(dadosCapturados);
//     console.log("----------------------------------------------------------------");

//     console.groupEnd();
//     return dadosCapturados;
// }

// function simplificarDados(dadosComplexos) {
//     const dadosSimples = {};
    
//     Object.keys(dadosComplexos).forEach(chave => {
//         // Extrai apenas a string contida em 'valor'
//         dadosSimples[chave] = dadosComplexos[chave].valor;
//     });

//     return dadosSimples;
// }