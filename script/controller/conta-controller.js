import { coletarDadosForm } from "../utils/form-helper.js";
import { cadastrarUsuario } from "../services/usuario-service.js";

export async function handleCadastro(formId, btnId) {
    //const btn = document.getElementById(btnId);
    //const dados = coletarDadosForm(formId); // Pegamos os dados

    try {
        //btn.disabled = true;
        //btn.innerText = "Salvando...";

        await cadastrarUsuario(dados); // Chamamos o serviço

        alert("Sucesso! Sua conta foi criada.");
        document.getElementById(formId).reset();
        
    } catch (error) {
        // O erro 409 que o Back envia chega aqui com a mensagem correta
        alert(error.message); 
    } finally {
        btn.disabled = false;
        btn.innerText = "Salvar";
    }
}