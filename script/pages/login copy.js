import { efetuarLogin } from "../services/api_service.js";
import { bloquearButton, coletarDadosForm } from "../utils/form-helper.js";
import { validarEmail, validarForcaSenha } from "../utils/validador.js";
import { configurarMostrarSenha, inicializarTooltips } from "../utils/dom-utils.js"

inicializarTooltips();
configurarMostrarSenha('mostrarSenha', ['senha', 'confirmarSenha']);

async function logar() {
    
    if ( !validarEmail()                 ) { return; }
    if ( !validarForcaSenha()            ) { return; }

    try {

        bloquearButton("loginBtn", "Logando...");

        const dados = coletarDadosForm("loginForm");

        const response = await efetuarLogin(dados);

        const resultado = response.ok 
                    ? await lerRespostaSucesso(response) 
                    : await lerRespostaErro(response);
                    
        if (response.ok) {
                   
            if (resultado?.uuid) { SessionManager.salvar("token_uuid", resultado.uuid); }       

            await Mensagem.sucesso("Login efetuado com sucesso!");          

            navegarPara("login");            
            
        } else {
            
            const mensagemFinal = typeof resultado === 'object' 
                ? (resultado.message || "Erro no servidor") 
                : resultado;

            await Mensagem.erro(response.status, mensagemFinal || "Erro desconhecido");
        }

    } catch (error) {

    } finally {

    }

}

document.getElementById('email'     ).addEventListener('blur', validarEmail      );
document.getElementById('senha'     ).addEventListener('blur', validarForcaSenha );

document.getElementById('loginBtn'  ).addEventListener('click', logar            );