import { Mensagem } from "../utils/mensageiro.js";


const dicionarioHorario = {

    pt: {
        lbl_titulo       : "Horário",
        lbl_cadastrarBtn : "Salvar",
        lbl_voltarBtn    : "Voltar",
    },
    
    es: {
        lbl_titulo       : "Tiempo",
        lbl_cadastrarBtn : "Ahorrar",
        lbl_voltarBtn    : "Para volver atrás",
    }
};

// 2. FUNÇÕES DE TRADUÇÃO
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

// 3. EVENTOS GLOBAIS
// Escuta o evento global para traduzir o que for estático na página
// Escuta o mesmo evento que os componentes já usam!
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail?.Language || e.detail?.language || e.detail;
    traduzirInterfaceEstatica(lang);
});

// 4. INICIALIZAÇÃO E CONTROLE DE UI
document.addEventListener('DOMContentLoaded', () => {

    // 1. GARANTIR IDIOMA PADRÃO NO STORAGE
    // Se não houver nada definido, ele seta 'pt' automaticamente
    if (!sessionStorage.getItem('official_language')) {
        sessionStorage.setItem('official_language', 'pt');
        
        console.log(
            "%c[INIT] %c'official_language' inicializado como: %c PT ",
            "color: #007bff; font-weight: bold;", 
            "color: #333;",
            "background: #28a745; color: #fff; font-weight: bold; border-radius: 3px;"
        );
    }

    
    // 4.3 FUNÇÃO DE TROCA DE IDIOMA DO SISTEMA
    const trocarIdiomaSistema = (lang) => {
        // 1. Salva para persistência (O Base_Field lê daqui no translate)
        sessionStorage.setItem('official_language', lang);

        // --- LOG DE VERIFICAÇÃO DE STORAGE ---
        console.log(
            `%c[CHECKPOINT-STORAGE] %cValor enviado: %c${lang} %c| No Storage: %c${sessionStorage.getItem('official_language')}`,
            "color: #000; font-weight: bold;", 
            "color: #666;", 
            "background: #fffbe6; color: #856404; font-weight: bold; border: 1px solid #ffe58f;", // Destaque Amarelo
            "color: #666;",
            "color: #28a745; font-weight: bold;"
        );

        // 2. Dispara o evento para os Web Components reagirem
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));

        // Log de rastreio com as cores que você consegue ver bem
        const cor = lang === 'pt' ? '#28a745' : '#dc3545';
        console.log(
            `%c[SISTEMA] %cIdioma definido como: %c ${lang.toUpperCase()} `,
            "color: #333; font-weight: bold;",
            "color: #666;",
            `background: ${cor}; color: #fff; font-weight: bold; border-radius: 3px;`
        );
    };

    // 4.4 OUVINTES DOS BOTÕES DE BANDEIRA
    document.getElementById('btn-pt')?.addEventListener('click', () => trocarIdiomaSistema('pt'));
    document.getElementById('btn-es')?.addEventListener('click', () => trocarIdiomaSistema('es'));

});

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

document.addEventListener('DOMContentLoaded', () => {    

    const btnAdicionar = document.getElementById('adicionarBtn');

    if (!btnAdicionar) {
        console.log("%c ERRO %c Botão 'adicionarBtn' não encontrado! ", 
            "background: #e74c3c; color: white; font-weight: bold; border-radius: 3px;", 
            "color: #e74c3c;");
        return;
    }

    btnAdicionar.addEventListener('click', async () => {
        console.log("\n%c >>> INICIANDO PROCESSO DE VALIDAÇÃO <<< ", "background: #2c3e50; color: #ecf0f1; font-weight: bold; padding: 5px; width: 100%;");

        const seletores = [
            'instituicao-select',
            'turno-select',
            'posicao-aula-field',
            'dia-semana-select',
            'turma-select',
            'materia-select'
        ];

        let erroDetectado = false;

        seletores.forEach(tag => {
            const campo = document.querySelector(tag);

            if (!campo) {
                console.log(`%c AUSENTE %c O componente <${tag}> não existe no DOM `, 
                    "background: #f39c12; color: white; font-weight: bold; border-radius: 3px;", 
                    "color: #f39c12;");
                erroDetectado = true;
                return;
            }

            try {
                const eValido = campo.validar();
                const valor = campo.value || "Vazio/Nulo";

                if (eValido) {
                    console.log(`%c OK %c <${tag.padEnd(20)}> | Valor: %c"${valor}"`, 
                        "background: #2ecc71; color: white; font-weight: bold; border-radius: 3px;", 
                        "color: #2ecc71;", 
                        "color: #34495e; font-style: italic;");
                } else {
                    console.log(`%c FALHA %c <${tag.padEnd(20)}> | Validação interna reprovou o campo `, 
                        "background: #e74c3c; color: white; font-weight: bold; border-radius: 3px;", 
                        "color: #e74c3c;");
                    erroDetectado = true;
                }
            } catch (err) {
                console.log(`%c CRÍTICO %c <${tag}> não possui o método validar()! `, 
                    "background: #8e44ad; color: white; font-weight: bold; border-radius: 3px;", 
                    "color: #8e44ad;");
                erroDetectado = true;
            }
        });

        if (!erroDetectado) {
            console.log("%c\n FINALIZADO: FORMULÁRIO PRONTO PARA ENVIO! ", "color: white; background: #27ae60; font-weight: bold; padding: 5px;");
            //alert("Sucesso! Todos os componentes estão validados.");
            const confirmou = await Mensagem.confirmarAdicionar("Deseja adicionar no horário?")

            if (confirmou) {
                
                // Coleta os dados dos Web Components
                const dadosParaSalvar = {
                    dia: document.querySelector('dia-semana-select').value,
                    posicao: document.querySelector('posicao-aula-field').value,
                    materia: document.querySelector('materia-select').value,
                    turma: document.querySelector('turma-select').value,
                    instituicao: document.querySelector('instituicao-select').value
                };

                // --- LOG DE RASTREAMENTO DOS DADOS CAPTURADOS ---
                console.group("%c 🔍 Rastreamento de Dados Capturados ", "background: #2c3e50; color: #ecf0f1; font-weight: bold;");
                
                // Tabela para visualização rápida e organizada
                console.table(dadosParaSalvar);

                // Verificação de valores vazios (Segurança extra)
                Object.entries(dadosParaSalvar).forEach(([campo, valor]) => {
                    if (!valor || valor === "0" || valor === "") {
                        console.log(`%c ATENÇÃO %c O campo [${campo}] parece estar vazio ou inválido.`, 
                            "background: #f1c40f; color: black; font-weight: bold; border-radius: 3px;", 
                            "color: #f1c40f;");
                    }
                });

                console.groupEnd();
                // ------------------------------------------------


                // Chama a função isolada do serviço
                const resultado = storageHorario.salvarAula(dadosParaSalvar);

                if (resultado.sucesso) {
                    // Se salvou no LocalStorage, agora podemos pintar a grade
                    console.log("%c SUCESSO %c Pronto para renderizar na tela.", "color: green;", "");
                    
                    // O PRÓXIMO PASSO DE BEBÊ SERÁ AQUI:
                    // gradeComponent.adicionarAulaNaTela(dadosParaSalvar);
                } else {
                    // Se houve conflito, avisa o usuário
                    Mensagem.erro(resultado.mensagem);
                }

            }


            

        } else {
            console.log("%c\n FINALIZADO: CORRIJA OS ERROS ACIMA. ", "color: white; background: #c0392b; font-weight: bold; padding: 5px;");
            //alert("Atenção: Existem campos inválidos no formulário.");
            Mensagem.erro("Existem campos inválidos no formulário");
        }
    });
});