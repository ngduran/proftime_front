import { inicializarTooltips } from "../utils/dom-utils.js";
import { configurarAbrirRelogioAoClicar, navegarPara, 
         coletarDadosForm,
         preencherSelect} from "../utils/form-helper.js";
import { validarNome, validarComboBox, validarCampoTime, validarFormulario } from "../utils/validador.js";
import { cadastrarInstituicao, initialDataInstituicao, listarEstados, listarMunicipiosPorEstado } from "../services/api_service.js";
import { executarOperacao } from "../core/api-engine.js"
import { changeLanguage } from "../utils/i18n.js";


//inicializarTooltips();

configurarAbrirRelogioAoClicar('horarioInicial');
configurarAbrirRelogioAoClicar('horaAula');

//carregarListaInstituicoes();

//readEstados();
// readMuniciposPorEstados();

function voltarAoInicio() {
    navegarPara('home');
}

// Validação em tempo real ao sair do campo (Blur)
document.getElementById('nome'           ).addEventListener('blur',         validarNome                                                       );
document.getElementById('administracao'  ).addEventListener('blur', () => { validarComboBox   ( 'administracao',  'Selecione a instituição'   ); } );
//document.getElementById('estado'         ).addEventListener('blur', () => { validarComboBox   ( 'estado',         'Selecione o estado'        ); } );
document.getElementById('cidade'         ).addEventListener('blur', () => { validarComboBox   ( 'cidade',         'Selecione a cidade'        ); } );
//document.getElementById('horarioInicial' ).addEventListener('blur', () => { validarCampoTime  ( 'horarioInicial', 'Selecione uma hora válida' ); } );
document.getElementById('horaAula'       ).addEventListener('blur', () => { validarCampoTime  ( 'horaAula',       'Selecione uma hora válida' ); } );

document.getElementById('cadastrarBtn'  ).addEventListener('click', salvar         );
document.getElementById('voltarBtn'     ).addEventListener('click', voltarAoInicio );




//linguagem
document.addEventListener('DOMContentLoaded', () => {
    // Vincular cliques
    document.getElementById('btn-pt').addEventListener('click', () => changeLanguage('pt'));
    document.getElementById('btn-es').addEventListener('click', () => changeLanguage('es'));
});



async function salvar() {
    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Salvando...',
        apiCall: cadastrarInstituicao,
        dados: coletarDadosForm("instituicaoForm"),
        mensagemSucesso: "A Instituição foi criada com sucesso!",
        validacao: () => {
            return validarFormulario('instituicaoForm') &&
                   validarNome() &&
                   validarComboBox('administracao', 'Selecione a administracao') &&
                   //validarComboBox('estado', 'Selecione o estado') &&
                   validarComboBox('cidade', 'Selecione a cidade') &&
                   validarCampoTime('horarioInicial', 'Selecione uma hora válida') &&
                   validarCampoTime('horaAula', 'Selecione uma hora válida');
                },
                onSuccess: () => navegarPara("home")
            });
}

async function readEstados() {
    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Consultando...',
        apiCall: listarEstados,
        onSuccess: async (resultado) => {
            preencherSelect('estado', resultado.data);
        }     
    });
}


              
async function readMunicipiosPorEstado(idEstado, termoBusca) {
    await executarOperacao({
        idBotao: 'cadastrarBtn',
        textoAguarde: 'Consultando...',
        apiCall: listarMunicipiosPorEstado(idEstado, termoBusca),
        onSuccess: async (resultado) => {
            preencherSelect('cidade', resultado.data);
        }     
    });
}




document.getElementById('estado').addEventListener('change', async (e) => {
    debugger;

    const idEstado = document.getElementById('estado').value;
    if (!idEstado) return; // Segurança caso o valor venha vazio

    const idCidade = document.getElementById('cidade').value;



    const termoBusca = e.target.value;
    //const idEstado = document.getElementById('estado').value;

    if (termoBusca.length >= 3 && idEstado) {
        // Chamamos a função de busca passando o ID do estado e o termo digitado
        const resultado = await readMunicipiosPorEstado(idEstado, termoBusca);
        //atualizarDatalist('listaMunicipios', resultado.data);
    }
});

function atualizarDatalist(idDatalist, dados) {
    const list = document.getElementById(idDatalist);
    list.innerHTML = ""; // Limpa as sugestões anteriores
    
    dados.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nome; // O que o usuário vê e seleciona
        option.dataset.id = item.uuid; // Guardamos o ID real
        list.appendChild(option);
    });
}




// PARA ESCUTAR O COMPONENTE SELECT ESTADO
const selectEstadoComp = document.querySelector('estado-select');

// Escutando o "grito" do componente
selectEstadoComp.addEventListener('estado-selecionado', (e) => {
    const id = e.detail.id;
    console.log("Opa! O usuário escolheu o estado:", id);

    // Agora você chama sua função de busca de municípios passando o ID
    if (id) {
        // Ex: sua função que preenche o datalist ou a lista customizada
        //atualizarListaMunicipios(id);
    }
});










// async function read() {
//     await executarOperacao({
//         idBotao: 'cadastrarBtn',
//         textoAguarde: 'Consultando...',
//         apiCall: listarEstados,
//         onSuccess: async (resultado) => {
//             preencherSelect('estado', resultado.data);
//         }        
//     });
// }


// async function carregarListaInstituicoes() {
//     await executarOperacao({
//         idBotao: 'btnAtualizarTabela', // Um botão de refresh ou o próprio carregamento da página
//         keyTextoAguarde: 'lbl_carregando',
//         apiCall: listarInstituicoesApi, // Sua função que faz o fetch GET
//         onSuccess: (dados) => {
//             popularTabela('tabelaInstituicoes', dados, (inst) => `
//                 <tr>
//                     <td>${inst.nome}</td>
//                     <td>${inst.cidade}</td>
//                     <td>${inst.estado}</td>
//                     <td>
//                         <button class="btn-action edit" onclick="editar('${inst.uuid}')">
//                             <i class="fa-solid fa-pen"></i>
//                         </button>
//                         <button class="btn-action delete" onclick="excluir('${inst.uuid}')">
//                             <i class="fa-solid fa-trash"></i>
//                         </button>
//                     </td>
//                 </tr>
//             `);
//         }
//     });
// }



// async function carregarDados(pagina) {
//     // Pegamos os valores dos inputs de filtro da tela
//     const filtroEstado = document.getElementById('filtroEstado').value;
//     const filtroCidade = document.getElementById('filtroCidade').value;

//     await executarOperacao({
//         idBotao: 'btnFiltrar',
//         keyTextoAguarde: 'lbl_buscando',
//         // Passamos uma função anônima para a apiCall conseguir receber os parâmetros
//         apiCall: () => apiFetchGetPaginado(
//             { path: '/api/instituicoes/listar', method: 'GET' }, 
//             { 
//                 estado: filtroEstado, 
//                 cidade: filtroCidade, 
//                 page: pagina, 
//                 size: 10 
//             }
//         ),
//         onSuccess: (resultado) => {
//             renderizarTabelaInstituicoes(resultado);
//         }
//     });
// }

// async function carregarDados(pagina) {
//     // Filtros (pegue os IDs dos seus inputs de busca)
//     const filtroEstado = document.getElementById('inputFiltroEstado')?.value || "";
//     const filtroCidade = document.getElementById('inputFiltroCidade')?.value || "";

//     await executarOperacao({
//         idBotao: 'btnFiltrar', // ou algum ID de carregamento
//         keyTextoAguarde: 'lbl_buscando',
//         apiCall: () => apiFetchGetPaginado(
//             { path: '/api/instituicoes/listar', method: 'GET' }, 
//             { 
//                 estado: filtroEstado, 
//                 cidade: filtroCidade, 
//                 page: pagina, 
//                 size: 5 // Quantidade por página
//             }
//         ),
//         onSuccess: (resultado) => {
//             // 1. Atualiza os estados globais
//             paginaAtual = resultado.number;
//             totalDePaginas = resultado.totalPages;

//             // 2. Popula a tabela
//             renderizarTabela(resultado.content);

//             // 3. Atualiza os botões (Habilita/Desabilita)
//             atualizarControlesPaginacao(resultado);
//         }
//     });
// }

// function atualizarControlesPaginacao(pageData) {
//     const btnAnterior = document.getElementById('btnAnterior');
//     const btnProximo = document.getElementById('btnProximo');
//     const info = document.getElementById('infoPagina');

//     // Atualiza o texto: "Página 1 de 10" (Somamos 1 pois o Java começa em 0)
//     info.innerText = `Página ${pageData.number + 1} de ${pageData.totalPages || 1}`;

//     // Desabilita botões se não houver para onde ir
//     btnAnterior.disabled = pageData.first;
//     btnProximo.disabled = pageData.last;

//     // Adiciona uma classe visual de desabilitado se desejar
//     btnAnterior.style.opacity = pageData.first ? "0.5" : "1";
//     btnProximo.style.opacity = pageData.last ? "0.5" : "1";
// }

// function renderizarTabela(lista) {
//     popularTabela('tabelaInstituicoes', lista, (inst) => `
//         <tr>
//             <td>${inst.nome}</td>
//             <td>${inst.cidade}</td>
//             <td>${inst.estado}</td>
//             <td>
//                 <button class="btn-action edit" onclick="editar('${inst.uuid}')"><i class="fa-solid fa-pen"></i></button>
//                 <button class="btn-action delete" onclick="excluir('${inst.uuid}')"><i class="fa-solid fa-trash"></i></button>
//             </td>
//         </tr>
//     `);
// }

// let paginaAtual = 0;
// let totalDePaginas = 0;

// // Função chamada pelos botões
// async function mudarPagina(direcao) {
//     const novaPagina = paginaAtual + direcao;
    
//     // Evita navegar para páginas inexistentes
//     if (novaPagina >= 0 && novaPagina < totalDePaginas) {
//         paginaAtual = novaPagina;
//         await carregarDados(paginaAtual);
//     }
// }

