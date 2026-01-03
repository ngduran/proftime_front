import { cadastrarUsuario } from "./services/usuario-service.js";
import { bloquearButton, desbloquearButton, coletarDadosForm, limparFormulario, 
         configurarMascaraTelefone } from "./utils/form-helper.js";
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

        // 2. Decisão de Fluxo baseada no status
        if (response.ok) {

            // Usa o tradutor de sucesso
            const resultado = await lerRespostaSucesso(response);
        
            // Gravação dinâmica no CRUD de sessão
            if (resultado?.uuid) { SessionManager.salvar("usuario_uuid", resultado.uuid); }

            Mensagem.sucesso("Sua conta foi criada com sucesso!");

            limparFormulario();
            
            //alert("Cadastro realizado com sucesso!");
        } else {
            // Usa o tradutor de erro para pegar a mensagem do seu Java
            const mensagem = await lerRespostaErro(response);
            Mensagem.erro(response.status, mensagem)
            //alert(`Atenção (Erro ${response.status}): ${mensagem}`);
        }
        
    } catch (error) {
        // Erros de rede (Cai aqui se o apiFetch der 'throw')
        Mensagem.erro("Conexão", "Não foi possível alcançar o servidor.");
        //alert(`Falha de conexão: ${error.message}`);
    } finally {
        desbloquearButton("cadastrarBtn", "Salvar");
    }
        
}

//await salvarGenerico("contaForm", "cadastrarBtn", ENDPOINTS.CREATE, "contaId");
// Chamada limpa: O Controller cuida do botão, do serviço e da mensagem
//debugger;

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