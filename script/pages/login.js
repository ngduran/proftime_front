import { changeLanguage } from "../components/utils/i18n/login_i18n.js";

const formLogin = document.getElementById('loginForm');

document.addEventListener('DOMContentLoaded', () => {       
    
    document.getElementById('btn-pt').addEventListener('click', () => {
        //console.log("%c --- CLIQUE NO BOTÃO ESPANHOL ---", "background: #ff0000; color: #fff; font-weight: bold;");
    
        // RASTREIO: Antes de traduzir, vamos ver se o componente de email está acessível
        //const emailField = document.querySelector('email-field');
        //console.log("Componente encontrado no DOM:", emailField);
        //console.log("Existe ShadowRoot nele?", emailField ? !!emailField.shadowRoot : "Não");
        changeLanguage('pt');
    });
    
    document.getElementById('btn-es').addEventListener('click', () => {
        //console.log("%c --- CLIQUE NO BOTÃO ESPANHOL ---", "background: #ff0000; color: #fff; font-weight: bold;");
    
        // RASTREIO: Antes de traduzir, vamos ver se o componente de email está acessível
        //const emailField = document.querySelector('email-field');
        //console.log("Componente encontrado no DOM:", emailField);
        //console.log("Existe ShadowRoot nele?", emailField ? !!emailField.shadowRoot : "Não");

        changeLanguage('es')        
    });

    // Este código deve ficar FORA de qualquer outra função, no final do arquivo
    //window.addEventListener('languageChanged', (event) => { // 'event' agora está definido aqui
    //console.log("%c [PROVA ABSOLUTA] O evento chegou na Window!", "background: #00ff00; color: #000; font-weight: bold;");
    
    // Verificando a estrutura do que foi recebido
    // if (event.detail) {
    //     console.log("Conteúdo do detail:", event.detail);
    //     const idiomaRecebido = event.detail.lang || event.detail; 
    //     console.log(`Sucesso: O sistema notificou a mudança para: ${idiomaRecebido}`);
    // } else {
    //     console.warn("O evento chegou, mas o 'detail' está vazio.");
    // }


});