import { Mensagem } from "../utils/mensageiro.js";
import { Storage_Service } from '../services/Storage_Service.js';
import { coletarDadosForm } from "../utils/form-helper.js";

// =========================================================================
// 1. CONFIGURAÇÕES E INSTÂNCIAS GLOBAIS
// =========================================================================
const storageHorario = new Storage_Service('grade_proftime_local');

const dicionarioHorario = {
    pt: { lbl_titulo: "Horário", lbl_cadastrarBtn: "Salvar",  lbl_voltarBtn: "Voltar" },
    es: { lbl_titulo: "Tiempo",  lbl_cadastrarBtn: "Ahorrar", lbl_voltarBtn: "Para volver atrás" }
};

const seletores = [
    'instituicao-select',
    'turno-select',
    'posicao-aula-field',
    'dia-semana-select',
    'turma-select',
    'materia-select'
];

// =========================================================================
// 3. FUNÇÕES AUXILIARES (FORA DO DOMCONTENTLOADED)
// =========================================================================
function traduzirInterfaceEstatica(lang) {
    const elementos = document.querySelectorAll('[data-translate]');
    elementos.forEach(el => {
        const chave = el.getAttribute('data-translate');
        // Verifica se a chave existe no dicionário para não apagar o texto por erro
        if (dicionarioHorario[lang] && dicionarioHorario[lang][chave]) {
            el.innerText = dicionarioHorario[lang][chave];
        }
    });
}

// ======================================================================================
// 4. EVENTOS GLOBAIS - ESCUTA O EVENTO GLOBAL PARA TRADUZIR O QUE FOR ESTÁTICO NA PÁGINA
// ======================================================================================
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail?.Language || e.detail?.language || e.detail;
    traduzirInterfaceEstatica(lang);
});

// ======================================================================================
// 5. INICIALIZAÇÃO E CONTROLE DE UI
// ======================================================================================
document.addEventListener('DOMContentLoaded', () => {

    // 1. GARANTIR IDIOMA PADRÃO NO STORAGE    
    if (!sessionStorage.getItem('official_language')) {
        sessionStorage.setItem('official_language', 'pt');      
    }
    
    // 4.3 FUNÇÃO DE TROCA DE IDIOMA DO SISTEMA
    const trocarIdiomaSistema = (lang) => {
        // 1. Salva para persistência (O Base_Field lê daqui no translate)
        sessionStorage.setItem('official_language', lang);       

        // 2. Dispara o evento para os Web Components reagirem
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));       
    };

    // 4.4 OUVINTES DOS BOTÕES DE BANDEIRA
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));

});

// ======================================================================================
// 6. ARRASTO DENTRO DA GRADE DE AULA
// ======================================================================================
document.addEventListener('DOMContentLoaded', () => {
   
    const blocosDias = document.querySelectorAll('.dia-bloco');

    blocosDias.forEach(bloco => {
        new Sortable(bloco, {
            group: 'horario-escolar',
            animation: 150,
            swap: true, // Ativa a troca de lugar entre duas células
            
            // --- AJUSTE PARA MOBILE (DELAY) ---
            delay: 300,        // Tempo em milissegundos (0.3s) pressionado para começar a arrastar
            delayOnTouchOnly: true, // O delay só será aplicado no celular/touch
            touchStartThreshold: 5, // Quantos pixels o dedo pode "tremer" antes de cancelar o delay


            // REGRA DE OURO 1: Só permite arrastar o que for 'celula-materia'
            draggable: '.cell-materia', 

            // REGRA DE OURO 2: Ignora cliques em qualquer outra classe
            filter: 'item-header, .cell-aula',
            preventOnFilter: true,

            // REGRA DE OURO 3: Só permite soltar se o alvo for 'celula-materia'
            onMove: function (evt) {
                // evt.related é o elemento de destino
                return evt.related.classList.contains('cell-materia');
            }
        });
    });
});

// ======================================================================================
// 7. LIMPAR A GRADE DE AULA
// ======================================================================================
document.addEventListener('DOMContentLoaded', () => {
    const grade = document.querySelector('grade-horario-professor');
    const btnLimpar = document.getElementById('limparBtn');

    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            // Chamada direta para o método que criamos dentro do componente
            grade.limparGrade();
        });
    }
});

// ======================================================================================
// 8. BOTÃO ADICIONAR (EVENTO)
// ======================================================================================
document.getElementById('adicionarBtn').addEventListener('click', executarTarefas );

// ======================================================================================
// 9. ORQUESTRADOR DAS TAREFAS DO BOTÃO ADICIONAR
// ======================================================================================
async function executarTarefas() {
    // Passo 1: Validar os Web Components
    if (!validarFormulario()) {
        Mensagem.erro("Existem campos inválidos no formulário");
        return; // Para aqui se houver erro
    }

    // Passo 2: Confirmar com o usuário
    const confirmou = await Mensagem.confirmarAdicionar("Deseja adicionar no horário?");
    if (!confirmou) {        
        return; 
    } 

    
    // Passo 3: Capturar os dados (Passo isolado para o log que você pediu)
    const dadosAula = capturarDadosFormulario();

    // Passo 4: Persistir no LocalStorage (Verificando sobreposição)
    const resultado = storageHorario.salvarAula(dadosAula);

    console.log("===================================================================");
    console.log(resultado);
    console.log("===================================================================");

    // Dentro de executarTarefas(), após o storageHorario.salvarAula(dadosAula)
    if (resultado.sucesso) {
        const grade = document.querySelector('grade-horario-professor');
        if (grade) {
            // O componente agora sabe como se pintar sozinho lendo o localStorage
            grade.renderizarGrade();
        }
        
        Mensagem.sucesso("Aula adicionada!");
        //limparCamposFormulario();
    }
}

// ======================================================================================
// 10. VALIDAR O FORMULÁRIO
// ======================================================================================
/**
 * Varre os Web Components da tela e executa a validação interna de cada um.
 * @returns {boolean} True se todos os campos forem válidos.
 */
function validarFormulario() {
    console.log("\n%c >>> INICIANDO PROCESSO DE VALIDAÇÃO <<< ", "background: #2c3e50; color: #ecf0f1; font-weight: bold; padding: 5px; width: 100%;");

    // const seletores = [
    //     'instituicao-select',
    //     'turno-select',
    //     'posicao-aula-field',
    //     'dia-semana-select',
    //     'turma-select',
    //     'materia-select'
    // ];

    let todosValidos = true;

    seletores.forEach(tag => {
        const campo = document.querySelector(tag);

        // 1. Verifica se o componente existe
        if (!campo) {
            console.log(`%c AUSENTE %c <${tag}> não encontrado no DOM`, "background: #f39c12; color: white; font-weight: bold;", "color: #f39c12;");
            todosValidos = false;
            return;
        }

        // 2. Tenta executar o método validar() do componente
        try {
            const eValido = campo.validar();
            const valor = campo.value || "Vazio";

            if (eValido) {
                console.log(`%c OK %c <${tag.padEnd(20)}> | Valor: %c"${valor}"`, 
                    "background: #2ecc71; color: white; font-weight: bold;", "color: #2ecc71;", "color: #34495e; font-style: italic;");
            } else {
                console.log(`%c FALHA %c <${tag.padEnd(20)}> | Inválido`, 
                    "background: #e74c3c; color: white; font-weight: bold;", "color: #e74c3c;");
                todosValidos = false;
            }
        } catch (err) {
            console.log(`%c CRÍTICO %c <${tag}> sem método validar()`, "background: #8e44ad; color: white; font-weight: bold;", "color: #8e44ad;");
            todosValidos = false;
        }
    });

    const corFinal = todosValidos ? "background: #27ae60;" : "background: #c0392b;";
    console.log(`%c FINALIZADO: ${todosValidos ? 'PRONTO' : 'CORRIJA OS ERROS'} `, `color: white; ${corFinal} font-weight: bold; padding: 5px;`);

    return todosValidos;
}

// ======================================================================================
// 11. CAPTURAR DADOS DO FORMULÁRIO
// ======================================================================================
/**
 * Captura os dados de todos os seletores e monta o objeto para o LocalStorage.
 * @returns {Object} Dados estruturados para salvamento.
 */
function capturarDadosFormulario() {
    
    const dadosCapturados = {};

    console.group("%c 📦 Processando Captura Genérica ", "background: #34495e; color: white;");

    seletores.forEach(tag => {
        const componente = document.querySelector(tag);

        if (componente) {
            // Usamos as propriedades getter que você definiu no Base_Field
            const chave = componente.id; // Retorna o ID ou 'sem-id'
            
            // Aqui criamos um sub-objeto para guardar ID e Texto (ou UUID e Texto)
            // Se o seu componente tiver um método específico para pegar o texto 
            // do label selecionado (no caso de selects), podemos usar aqui.
            dadosCapturados[chave] = {
                valor: componente.value,
                texto: componente.textoSelecionado,
                nome:  componente.name
            };

            console.log(`%c CAPTURADO %c <${tag.padEnd(20)}> | Chave: ${chave}`, 
                "color: #2ecc71; font-weight: bold;", "color: #2c3e50;");
        }
    });

    console.log("-------------- DADOS CAPTURADOS --------------------------------");
    console.log(dadosCapturados);
    console.log("----------------------------------------------------------------");

    console.groupEnd();
    return dadosCapturados;
}