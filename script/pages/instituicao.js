import { inicializarTooltips } from "../utils/dom-utils.js";
import { configurarAbrirRelogioAoClicar, navegarPara, 
         coletarDadosForm, popularFormulario } from "../utils/form-helper.js";
import { validarNome, validarComboBox, validarCampoTime, validarFormulario } from "../utils/validador.js";
import { cadastrarInstituicao, initialDataInstituicao } from "../services/api_service.js";
import { executarOperacao } from "../core/api-engine.js"


inicializarTooltips();

configurarAbrirRelogioAoClicar('horarioInicial');
configurarAbrirRelogioAoClicar('horaAula');

// read();

//-------------------------------------------------------------------------------------------
// async function salvar() {
    
//     if ( !validarFormulario( 'instituicaoForm'                             ) ) { return; }
//     if ( !validarNome()                                                      ) { return; }
//     if ( !validarComboBox  ( 'administracao',  'Selecione a administracao' ) ) { return; }
//     if ( !validarComboBox  ( 'estado',         'Selecione o estado'        ) ) { return; }
//     if ( !validarComboBox  ( 'cidade',         'Selecione a cidade'        ) ) { return; }
//     if ( !validarCampoTime ( 'horarioInicial', 'Selecione uma hora válida' ) ) { return; }
//     if ( !validarCampoTime ( 'horaAula',       'Selecione uma hora válida' ) ) { return; }
    
    
//     try {
        
//         bloquearButton('cadastrarBtn', 'Salvando...');
        
//         const dados = coletarDadosForm("instituicaoForm");

//         const response = await cadastrarInstituicao(dados);

//         const resultado = response.ok 
//         ? await lerRespostaSucesso(response) 
//         : await lerRespostaErro(response);  
        
//         if (response.ok) {
            
//             if (resultado?.uuid) { SessionManager.salvar("instituicao_id", resultado.uuid); }       
            
//             await Mensagem.sucesso("A Instituição foi criada com sucesso!");          
            
//             navegarPara("home");            
            
//         } else {
            
//             const mensagemFinal = typeof resultado === 'object' 
//                 ? (resultado.message || "Erro no servidor") 
//                 : resultado;
                
//                 await Mensagem.erro(response.status, mensagemFinal || "Erro desconhecido");
//             }
            
//         } catch (error) {
//         // Se for erro de rede, o fetch lança TypeError. Se for código, é ReferenceError ou similar.
//         if (error.message.includes("fetch") || error.message.includes("Network")) {
//             await Mensagem.erro("Conexão", "Não foi possível alcançar o servidor.");
//         } else {
//             // Se o Swal falhar, ele mostra o erro do script aqui
//             alert("Erro no script de Mensagem: " + error.message);
//         }   
//     } finally {
//         desbloquearButton('cadastrarBtn', 'Salvar');
//     }
// }

// async function read() {
    
//     console.log("Chamando o read a entrar na página");
    
//     try {
        
//         bloquearButton('cadastrarBtn', 'Consultando...');
        
//         const response = await initialDataInstituicao();
        
//         const resultado = response.ok 
//         ? await lerRespostaSucesso(response) 
//         : await lerRespostaErro(response);
        
//         await popularFormulario('instituicaoForm', resultado);
        
//         if (response.ok) {

//             if (resultado?.id) { SessionManager.salvar("instituicao_id", resultado.id); }
            
//             await Mensagem.sucesso("Os dados foram carregados com sucesso!");          

//             //navegarPara("login");            
            
//         } else {
            
//             const mensagemFinal = typeof resultado === 'object' 
//                 ? (resultado.message || "Erro no servidor") 
//                 : resultado;

//             await Mensagem.erro(response.status, mensagemFinal || "Erro desconhecido");
//         }
        
//     } catch (error) {
//         // Se for erro de rede, o fetch lança TypeError. Se for código, é ReferenceError ou similar.
//         if (error.message.includes("fetch") || error.message.includes("Network")) {
//              await Mensagem.erro("Conexão", "Não foi possível alcançar o servidor.");
//         } else {
//              // Se o Swal falhar, ele mostra o erro do script aqui
//              alert("Erro no script de Mensagem: " + error.message);
//         }
//     } finally {
//         desbloquearButton("cadastrarBtn", "Salvar");
//     }
    
    
// }
//-------------------------------------------------------------------------------------------



function voltarAoInicio() {
    navegarPara('home');
}

// Validação em tempo real ao sair do campo (Blur)
document.getElementById('nome'           ).addEventListener('blur',         validarNome                                                       );
document.getElementById('administracao'  ).addEventListener('blur', () => { validarComboBox   ( 'administracao',  'Selecione a instituição'   ); } );
document.getElementById('estado'         ).addEventListener('blur', () => { validarComboBox   ( 'estado',         'Selecione o estado'        ); } );
document.getElementById('cidade'         ).addEventListener('blur', () => { validarComboBox   ( 'cidade',         'Selecione a cidade'        ); } );
document.getElementById('horarioInicial' ).addEventListener('blur', () => { validarCampoTime  ( 'horarioInicial', 'Selecione uma hora válida' ); } );
document.getElementById('horaAula'       ).addEventListener('blur', () => { validarCampoTime  ( 'horaAula',       'Selecione uma hora válida' ); } );

document.getElementById('cadastrarBtn'  ).addEventListener('click', salvar         );
document.getElementById('voltarBtn'     ).addEventListener('click', voltarAoInicio );


async function salvar() {
    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Salvando...',
        apiCall: cadastrarInstituicao,
        dados: coletarDadosForm("instituicaoForm"),
        mensagemSucesso: "A Instituição foi criada com sucesso!",
        validacao: () => {
            return validarFormulario('instituicaoForm') &&
                   validarNome() &&
                   validarComboBox('administracao', 'Selecione a administracao') &&
                   validarComboBox('estado', 'Selecione o estado') &&
                   validarComboBox('cidade', 'Selecione a cidade') &&
                   validarCampoTime('horarioInicial', 'Selecione uma hora válida') &&
                   validarCampoTime('horaAula', 'Selecione uma hora válida');
        },
        onSuccess: () => navegarPara("home")
    });
}

async function read() {
    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Consultando...',
        apiCall: initialDataInstituicao,
        onSuccess: async (resultado) => {
            await popularFormulario('instituicaoForm', resultado);
        }
    });
}