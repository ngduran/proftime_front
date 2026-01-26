import { navegarPara } from "../utils/form-helper.js";
import { executarOperacao } from "../core/api-engine.js"
import { cadastrarInstituicao } from "../services/api_service.js";
import { changeLanguage } from "../components/utils/i18n/instituicao_i18n.js";


// 1. Selecionamos o formulário pai que contém os Web Components
const formInstituicao = document.getElementById('instituicaoForm');

// 2. Eventos de Navegação
document.getElementById('voltarBtn').addEventListener('click', () => navegarPara('home'));

// 3. Eventos de Idioma
document.addEventListener('DOMContentLoaded', () => {
    // Vincular cliques
    document.getElementById('btn-pt').addEventListener('click', () => changeLanguage('pt'));
    document.getElementById('btn-es').addEventListener('click', () => changeLanguage('es'));
});

// 4. O Botão Salvar agora delega a responsabilidade
document.getElementById('cadastrarBtn').addEventListener('click', salvar);


async function salvar() {
    console.log("chamou o  salvar");

    // Buscamos todos os Web Components que possuem o método validar()
    const campos = Array.from(formInstituicao.querySelectorAll('*'))
                        .filter(el => typeof el.validar === 'function');

    console.log("=======================================================================");
    console.log(campos);
    console.log("=======================================================================");

    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Salvando...',
        apiCall: () => {
            const dados = {};
            campos.forEach(campo => {
                dados[campo.id] = campo.value; 
            });

            console.log("###################################################################");
            console.log(dados);
            console.log("###################################################################");

            return cadastrarInstituicao(dados);
        },
        mensagemSucesso: "A Instituição foi criada com sucesso!",
        validacao: async  () => {
            // 1. Promise.all espera todos os validar() resolverem (sejam eles async ou não)
            const resultados = await Promise.all(campos.map(campo => campo.validar()));

            console.log("-----------------------------------------------------------");
            console.log(resultados);
            console.log("-----------------------------------------------------------");
            
            // 2. O every verifica se TODOS os itens no array de resultados são true
            // Se houver um único false, ele retorna false para a engine e NÃO salva
            return resultados.every(res => res === true);
        },
        onSuccess: () => navegarPara("home")
    });

}