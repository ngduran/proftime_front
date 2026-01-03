import { cadastrarUsuario } from "./services/usuario-service.js";
import { bloquearButton, desbloquearButton, coletarDadosForm, configurarMascaraTelefone, 
         navegarPara} from "./utils/form-helper.js";
import { validarNome, validarUsuario, validarFormulario, validarEmail, 
         validarTelefone, validarForcaSenha, validarSenhasIguais } from "./utils/validador.js";
import { inicializarTooltips, configurarMostrarSenha } from "./ui/dom-utils.js";
import { SessionManager } from "./utils/session-manager.js";
import { lerRespostaSucesso, lerRespostaErro } from "./api/api-client.js";
import { Mensagem } from "./ui/mensageiro.js";


inicializarTooltips();
configurarMostrarSenha('mostrarSenha', ['senha', 'confirmarSenha']);
configurarMascaraTelefone('telefone');

async function salvar() {
    
    if ( !validarFormulario("contaForm") ) { return; }
    if ( !validarNome()                  ) { return; }
    if ( !validarUsuario()               ) { return; }
    if ( !validarEmail()                 ) { return; }
    if ( !validarTelefone()              ) { return; }
    if ( !validarForcaSenha()            ) { return; }
    if ( !validarSenhasIguais()          ) { return; }

    try {
        
        bloquearButton("cadastrarBtn", "Criando...");
    
        const dados = coletarDadosForm("contaForm");
       
        const response = await cadastrarUsuario(dados);       
        
        const resultado = response.ok 
            ? await lerRespostaSucesso(response) 
            : await lerRespostaErro(response);            
        
        if (response.ok) {
           
            if (resultado?.uuid) { SessionManager.salvar("usuario_uuid", resultado.uuid); }       

            await Mensagem.sucesso("Sua conta foi criada com sucesso!");          

            navegarPara("login");            
           
        } else {
            
            const mensagemFinal = typeof resultado === 'object' 
                ? (resultado.message || "Erro no servidor") 
                : resultado;

            await Mensagem.erro(response.status, mensagemFinal || "Erro desconhecido");
        }
        
    } catch (error) {       
        // Se for erro de rede, o fetch lança TypeError. Se for código, é ReferenceError ou similar.
        if (error.message.includes("fetch") || error.message.includes("Network")) {
             await Mensagem.erro("Conexão", "Não foi possível alcançar o servidor.");
        } else {
             // Se o Swal falhar, ele mostra o erro do script aqui
             alert("Erro no script de Mensagem: " + error.message);
        }   
    } finally {
        desbloquearButton("cadastrarBtn", "Salvar");
    }        
}

function voltarAoInicio() {
    window.location.href='../page/login.html'
}

// Validação em tempo real ao sair do campo (Blur)
document.getElementById('nome'          ).addEventListener('blur', validarNome         );
document.getElementById('usuario'       ).addEventListener('blur', validarUsuario      );
document.getElementById('email'         ).addEventListener('blur', validarEmail        );
document.getElementById('telefone'      ).addEventListener('blur', validarTelefone     );
document.getElementById('senha'         ).addEventListener('blur', validarForcaSenha   );
document.getElementById('confirmarSenha').addEventListener('blur', validarSenhasIguais );

document.getElementById('cadastrarBtn'  ).addEventListener('click', salvar         );
document.getElementById('voltarBtn'     ).addEventListener('click', voltarAoInicio );