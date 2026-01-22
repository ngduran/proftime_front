import { lerRespostaErro, lerRespostaSucesso } from "../api/api-client.js";
import { Mensagem } from "../utils/mensageiro.js";
import { bloquearButton, desbloquearButton } from "../utils/form-helper.js";
import { SessionManager } from "../utils/session-manager.js";

import { getTranslation } from '../utils/i18n.js';


/**
 * Orquestra operações de API com feedback visual (Loader, Mensagens e Erros)
 * @param {Object} config - Configurações da operação
 */
export async function executarOperacao({
    idBotao,
    textoAguarde,
    keyTextoAguarde,
    textoOriginal = "Salvar",
    apiCall,          // Função de API (ex: cadastrarInstituicao ou initialDataInstituicao)
    dados,      // Dados para enviar (null para GET)
    mensagemSucesso,
    onSuccess,         // Callback opcional para ações específicas após sucesso
    validacao = null   // Função de validação opcional
}) {
    // 1. Executa validação se existir
    if (validacao && !validacao()) return;

    try {
        //bloquearButton(idBotao, textoAguarde);

        // Busca a tradução dinamicamente
        bloquearButton(idBotao, getTranslation(keyTextoAguarde));
       
        
        // 2. Chamada da API
        const response = await apiCall(dados);
       
        // 3. Processamento da resposta (Lógica unificada que você já usa)
        const resultado = response.ok 
            ? await lerRespostaSucesso(response) 
            : await lerRespostaErro(response);        

        if (response.ok) {
            // Persistência de ID/UUID se retornar
            const idParaSalvar = resultado?.uuid || resultado?.id;
            if (idParaSalvar) { 
                SessionManager.salvar("instituicao_id", idParaSalvar); 
            }

            if (mensagemSucesso) await Mensagem.sucesso(mensagemSucesso);
            
            // 4. Ação específica de cada tela (Popular ou Navegar)
            if (onSuccess) await onSuccess(resultado);

        } else {
            const mensagemFinal = typeof resultado === 'object' 
                ? (resultado.message || "Erro no servidor") 
                : resultado;
            await Mensagem.erro(response.status, mensagemFinal || "Erro desconhecido");
        }

    } catch (error) {
        if (error.message.includes("fetch") || error.message.includes("Network")) {
            await Mensagem.erro("Conexão", "Não foi possível alcançar o servidor.");
        } else {
            alert("Erro no processamento: " + error.message);
            console.error(error);
        }
    } finally {
        desbloquearButton(idBotao, textoOriginal);
    }
}