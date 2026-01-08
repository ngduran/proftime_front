import { inicializarTooltips } from "../ui/dom-utils.js";
import { validarComboBox, validarFormulario, validarPosicaoAula } from "../utils/validador.js";
import { Mensagem } from "../ui/mensageiro.js";
import { bloquearButton, desbloquearButton, coletarDadosForm} from "../utils/form-helper.js";
import { salvarAulaGradeProfessor } from "../services/api_service.js";
import { unirDados } from "../utils/mapper.js";
import { lerRespostaSucesso, lerRespostaErro } from "../api/api-client.js";

const cabecalho = "cabecalhoGradeForm";
const item      = "itemGradeForm";

let gradeDeAulas = [];

// Mapeamento para ligar o "value" do HTML ao nome da coluna na tabela
const mapaDias = {
    "1": "segunda",
    "2": "terca",
    "3": "quarta",
    "4": "quinta",
    "5": "sexta"
};

inicializarTooltips();

async function adicionar() {   
    
    if ( !validarFormulario( cabecalho                                  ) ) { return; }
    if ( !validarComboBox  ( 'instituicao', 'Selecione a instituicao'   ) ) { return; }
    if ( !validarComboBox  ( 'turno',       'Selecione o turno'         ) ) { return; }
    
    if ( !validarFormulario ( item                                      ) ) { return; }
    if ( !validarPosicaoAula( 'posicao',    1, 6, 'Indique a aula'      ) ) { return; }
    if ( !validarComboBox   ( 'diaSemana',  'Selecione o dia da Semana' ) ) { return; }
    if ( !validarComboBox   ( 'turma',      'Selecione a turma'         ) ) { return; }
    if ( !validarComboBox   ( 'materia',    'Selecione a materia'       ) ) { return; }
}

async function salvar() {

    try {

        bloquearButton("cadastrarBtn", "Salvando...");

        const dadosCabecalho = coletarDadosForm(cabecalho);
        let dadosItem = coletarDadosForm(item);

        dadosItem.posicao = parseInt( dadosItem.posicao );      

        console.log("---------------------------------------------");
        console.log(dadosCabecalho);
        console.log("---------------------------------------------");
        console.log("---------------------------------------------");
        console.log(dadosItem);
        console.log("---------------------------------------------");
    
        const jsonFinal = unirDados(dadosCabecalho, dadosItem, 'itens-grade');

        console.log("---------------------------------------------");
        console.log(jsonFinal);
        console.log("---------------------------------------------");
       

        const response = await salvarAulaGradeProfessor(jsonFinal);       
                
        const resultado = response.ok 
            ? await lerRespostaSucesso(response) 
            : await lerRespostaErro(response); 
    
        if (response.ok) {
                   
            if (resultado?.uuid) { SessionManager.salvar("usuario_uuid", resultado.uuid); }       
    
            await Mensagem.sucesso("Sua aula foi criada com sucesso!");          
    
            //navegarPara("login");            
            
        } else {
                
            const mensagemFinal = typeof resultado === 'object' 
                ? (resultado.message || "Erro no servidor") 
                : resultado;
    
            await Mensagem.erro(response.status, mensagemFinal || "Erro desconhecido");
        }

    } catch (error) {
        // Se for erro de rede, o fetch lança TypeError. Se for código, é ReferenceError ou similar.
        if (error.message.includes("fetch") || error.message.includes("Network")) {
             await Mensagem.erro("Conexão", "Não foi possível alcançar o servidor.");
        } else {
             // Se o Swal falhar, ele mostra o erro do script aqui
             alert("Erro no script de Mensagem: " + error.message);
        }   

    } finally {
         desbloquearButton("cadastrarBtn", "Salvar");
    }



}

function voltarAoInicio() {
    window.location.href='../page/login.html'
}

//document.getElementById('adicionarBtn'  ).addEventListener('click', adicionar      );

document.getElementById('cadastrarBtn'  ).addEventListener('click', salvar         );
document.getElementById('voltarBtn'     ).addEventListener('click', voltarAoInicio );

document.getElementById('instituicao'   ).addEventListener('blur', () => { validarComboBox   ( 'instituicao', 'Selecione a instituição'   ); } );
document.getElementById('turno'         ).addEventListener('blur', () => { validarComboBox   ( 'turno',       'Selecione o turno'         ); } );
document.getElementById('posicao'       ).addEventListener('blur', () => { validarPosicaoAula( 'posicao',      1, 6, 'Indique a aula'     ); } );
document.getElementById('diaSemana'     ).addEventListener('blur', () => { validarComboBox   ( 'diaSemana',   'Selecione o dia da Semana' ); } );
document.getElementById('turma'         ).addEventListener('blur', () => { validarComboBox   ( 'turma',       'Selecione a turma'         ); } );
document.getElementById('materia'       ).addEventListener('blur', () => { validarComboBox   ( 'materia',     'Selecione a materia'       ); } );

6

document.addEventListener('DOMContentLoaded', () => {
    renderizarTabela();

    // Usando o ID exato do seu HTML: adicionarBtn
    document.getElementById('adicionarBtn').addEventListener('click', adicionarAula);
});

async function adicionarAula() {
    //refatorar futuramente
    // Pegando os elementos conforme os IDs do seu HTML
    const campoPosicao = document.getElementById('posicao');
    const campoDia = document.getElementById('diaSemana');
    const campoTurma = document.getElementById('turma');

    const posicao = parseInt(campoPosicao.value);
    const diaValue = campoDia.value; // Retorna "1", "2", etc.
    const diaChave = mapaDias[diaValue]; // Converte para "segunda", "terca"...
    
    // Pega o texto da turma (ex: "1º Técnico...")
    const turmaTexto = campoTurma.options[campoTurma.selectedIndex].text;

    // Validação simples para o exemplo rodar
    if (!diaValue || !campoTurma.value) {
        //alert("Preencha todos os campos!");
        await Mensagem.erro("Prencha todos os campos!");
        return;
    }

    // Dentro da função adicionarAula, antes de salvar:
    let aulaExistente = gradeDeAulas.find(item => item.aula === posicao);

    if (aulaExistente && aulaExistente[diaChave]) {
        // if (!confirm(`Já existe uma aula na Posição ${posicao} de ${diaChave}. Deseja substituir?`)) {
        //     return; // Cancela a operação
        // }

        // Substituímos o confirm nativo pela sua nova Mensagem
        const desejaSubstituir = await Mensagem.confirmar(
            `Já existe uma aula na Posição ${posicao} de ${diaChave}. Deseja substituir?`
        );

        if (!desejaSubstituir) {
            return; // O usuário cancelou, para a execução aqui
        }


    }

    // Lógica de inserção no Array
    let linhaExistente = gradeDeAulas.find(item => item.aula === posicao);

    if (linhaExistente) {
        linhaExistente[diaChave] = turmaTexto;
    } else {
        const novaLinha = { aula: posicao };
        novaLinha[diaChave] = turmaTexto;
        gradeDeAulas.push(novaLinha);
    }

    renderizarTabela();
    salvar();
    await Mensagem.sucesso("Atualizado com sucesso");
}

async function renderizarTabela() {
    const corpo = document.getElementById('gradeCorpo');
    corpo.innerHTML = "";
    
    for (let i = 1; i <= 6; i++) {
        const dadosLinha = gradeDeAulas.find(d => d.aula === i) || { aula: i };
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}</td>
            <td>${formatBadge(dadosLinha.segunda)}</td>
            <td>${formatBadge(dadosLinha.terca)}</td>
            <td>${formatBadge(dadosLinha.quarta)}</td>
            <td>${formatBadge(dadosLinha.quinta)}</td>
            <td>${formatBadge(dadosLinha.sexta)}</td>
        `;
        corpo.appendChild(tr);        
    }

}


// Dicionário para guardar qual cor cada turma ganhou
const mapaCoresTurmas = {};
// Array de classes CSS que você definiu no seu arquivo
const classesDisponiveis = ["badge-blue", "badge-orange", "badge-purple", "badge-green", "badge-red"];
let indiceCor = 0;

function formatBadge(texto) {
    if (!texto) return "";

    // Caso especial para Hora Atividade (sempre cinza/estilo específico)
    if (texto.toLowerCase().includes("atividade")) {
        return `<span class="badge badge-activity">${texto}</span>`;
    }

    // Se a turma ainda não tem uma cor atribuída, damos uma a ela
    if (!mapaCoresTurmas[texto]) {
        mapaCoresTurmas[texto] = classesDisponiveis[indiceCor % classesDisponiveis.length];
        indiceCor++; // Próxima turma terá a próxima cor
    }

    const classeAtribuida = mapaCoresTurmas[texto];
    return `<span class="badge ${classeAtribuida}">${texto}</span>`;
}