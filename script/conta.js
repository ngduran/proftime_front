import { ENDPOINTS, executarAcao, salvarGenerico } from "./services/api-service.js";
import { coletarDadosForm, aplicarMascaraTelefone, configurarMascaraTelefone } from "./utils/form-helper.js";
import { validarNome, validarUsuario, validarFormulario, validarEmail, 
         validarTelefone, validarForcaSenha, validarSenhasIguais } from "./utils/validador.js";
import { inicializarTooltips, popularFormulario, configurarMostrarSenha } from "./ui/dom-utils.js";


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

    await salvarGenerico("contaForm", "cadastrarBtn", ENDPOINTS.CREATE, "contaId");
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