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
document.getElementById('estado'         ).addEventListener('blur', () => { validarComboBox   ( 'estado',         'Selecione o estado'        ); } );
document.getElementById('cidade'         ).addEventListener('blur', () => { validarComboBox   ( 'municipio',      'Selecione a cidade'        ); } );
document.getElementById('horarioInicial' ).addEventListener('blur', () => { validarCampoTime  ( 'horarioInicial', 'Selecione uma hora válida' ); } );
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
                   validarComboBox('estado', 'Selecione o estado') &&
                   validarComboBox('municipio', 'Selecione a cidade') &&
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