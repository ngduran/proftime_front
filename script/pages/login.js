import { efetuarLogin } from "../services/api_service.js";
import { configurarMostrarSenha, inicializarTooltips } from "../ui/dom-utils.js";
import { bloquearButton, coletarDadosForm } from "../utils/form-helper.js";
import { validarEmail, validarForcaSenha } from "../utils/validador.js";

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

    } catch (error) {

    } finally {

    }




}

document.getElementById('email'     ).addEventListener('blur', validarEmail      );
document.getElementById('senha'     ).addEventListener('blur', validarForcaSenha );

document.getElementById('loginBtn'  ).addEventListener('click', logar            );