import { navegarPara } from "../utils/form-helper.js";
import { changeLanguage } from "../utils/i18n.js";
import { executarOperacao } from "../core/api-engine.js"
import { cadastrarInstituicao } from "../services/api_service.js";


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
        //onSuccess: () => navegarPara("home")
    });

}




// TESTE RÁPIDO: Verifica se encontrou os componentes no console
    // console.log("Componentes encontrados para validação:", campos.length);

    // // 2. Validação PREVENTIVA usando every encontra dois falses e para (Antes de entrar na engine)
    // const todosValidos = campos.every(campo => {
    //     const eValido = campo.validar();
    //     console.log(`Campo [${campo.id}] é válido?`, eValido);
    //     return eValido;
    // });

    // if (!todosValidos) {
    //     // Se houver erro, a execução para aqui e nem chama a engine
    //     console.warn("Validação falhou. Operação cancelada.");
    //     return; 
    // }

    // 1. Executa a validação em TODOS (usando o map verifica todos) e guarda os resultados em um array de booleans
    // const resultados = campos.map(campo => {
    //     const eValido = campo.validar();
    //     console.log(`Validando [${campo.id}]:`, eValido);
    //     return eValido;
    // });

    // // 2. Agora sim, verifica se existe algum 'false' no array de resultados
    // const todosValidos = resultados.every(res => res === true);

    // if (!todosValidos) {
    //     console.warn("Validação falhou em um ou mais campos. Operação cancelada.");
    //     return;
    // }

    // 2. FORÇA a espera de todas as Promises de validação aqui fora
    // O Promise.all garante que todos fiquem vermelhos ao mesmo tempo
    //const resultados = await Promise.all(campos.map(campo => campo.validar()));








// configurarAbrirRelogioAoClicar('horarioInicial');
// configurarAbrirRelogioAoClicar('horaAula');




// // Validação em tempo real ao sair do campo (Blur)
// document.getElementById('nome'           ).addEventListener('blur',         validarNome                                                       );
// document.getElementById('administracao'  ).addEventListener('blur', () => { validarComboBox   ( 'administracao',  'Selecione a instituição'   ); } );
// document.getElementById('estado'         ).addEventListener('blur', () => { validarComboBox   ( 'estado',         'Selecione o estado'        ); } );
// document.getElementById('cidade'         ).addEventListener('blur', () => { validarComboBox   ( 'municipio',      'Selecione a cidade'        ); } );
// document.getElementById('horarioInicial' ).addEventListener('blur', () => { validarCampoTime  ( 'horarioInicial', 'Selecione uma hora válida' ); } );
// document.getElementById('horaAula'       ).addEventListener('blur', () => { validarCampoTime  ( 'horaAula',       'Selecione uma hora válida' ); } );

// document.getElementById('cadastrarBtn'  ).addEventListener('click', salvar         );
// document.getElementById('voltarBtn'     ).addEventListener('click', voltarAoInicio );





// async function salvar() {
//     await executarOperacao({
//         idBotao: 'cadastrarBtn',
//         textoAguarde: 'Salvando...',
//         apiCall: cadastrarInstituicao,
//         dados: coletarDadosForm("instituicaoForm"),
//         mensagemSucesso: "A Instituição foi criada com sucesso!",
//         validacao: () => {
//             return validarFormulario('instituicaoForm') &&
//                    validarNome() &&
//                    validarComboBox('administracao', 'Selecione a administracao') &&
//                    validarComboBox('estado', 'Selecione o estado') &&
//                    validarComboBox('municipio', 'Selecione a cidade') &&
//                    validarCampoTime('horarioInicial', 'Selecione uma hora válida') &&
//                    validarCampoTime('horaAula', 'Selecione uma hora válida');
//                 },
//                 onSuccess: () => navegarPara("home")
//             });
// }