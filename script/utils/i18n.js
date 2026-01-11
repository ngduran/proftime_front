//let currentLanguage = 'pt';

let currentLang = sessionStorage.getItem('lang') || 'pt';

export const translations = {
    pt: {
        // Geral
        lbl_cadastrarBtn: "Salvar",
        lbl_cadastrarBtn_saving: "Salvando...",

        lbl_voltarBtn: "Voltar ao Início",


        tp_lbl_nome: "Nome utilizado para identificação",
        tp_lbl_administracao: "Qual é o tipo da administração",
        tp_lbl_estado: "Em qual estado fica?",
        tp_lbl_cidade: "Em qual cidade?",
        tp_lbl_cidade: "Em qual cidade?",
        tp_lbl_horario_inicial: "Informe o horário inicial das aulas",
        tp_lbl_hora_aula: "Informe a duração de uma aula",
        tp_lbl_hora_aula: "Informe a duração de uma aula",
        


        loading: "Carregando...",
        success_save: "A Instituição foi criada com sucesso!",
        success_load: "Os dados foram carregados com sucesso!",
        
        // Campos do Formulário Instituição
        lbl_nome: "Nome da Instituição",
        lbl_administracao: "Administração",
        lbl_estado: "Estado (UF)",
        lbl_cidade: "Cidade",
        lbl_horario_inicial: "Hora de Início",
        lbl_hora_aula: "Hora Aula",
        
        // Placeholders
        ph_nome: "Ex: Escola Estadual XXX",
        
        ph_administracao_op0: "Selecione o tipo de Administração",
        ph_administracao_op1: "Federal",
        ph_administracao_op2: "Estadual",
        ph_administracao_op3: "Municipal",
        ph_administracao_op4: "Particular",
        
        ph_estado_op0: "Selecione o estado",

        ph_cidade_op0: "Selecione a cidade",

        // Placeholders/Validação
        sel_administracao: "Selecione a administração",
        sel_estado: "Selecione o estado",
        sel_cidade: "Selecione a cidade",
        err_time: "Selecione uma hora válida",
        err_network: "Não foi possível alcançar o servidor."
    },
    es: {
        // Geral
        lbl_cadastrarBtn: "Guardar",
        lbl_cadastrarBtn_saving: "Guardando...",

        lbl_voltarBtn: "Volver arriba",

        tp_lbl_nome: "Nombre utilizado para identificación",
        tp_lbl_administracao: "¿Qué tipo de administración es?",
        tp_lbl_estado: "¿En qué estado se encuentra?",
        tp_lbl_cidade: "¿En qué ciudad?",
        tp_lbl_horario_inicial: "Por favor especifique la hora de inicio de clases.",
        tp_lbl_hora_aula: "Por favor especifique la duración de una lección.",

        loading: "Consultando...",
        success_save: "¡La Institución fue creada con éxito!",
        success_load: "¡Los datos se cargaron correctamente!",
        
        // Campos do Formulário Instituição
        lbl_nome: "Nombre de la Institución",
        lbl_administracao: "Administración",
        lbl_estado: "Estado (UF)",
        lbl_cidade: "Ciudad",
        lbl_horario_inicial: "Hora de inicio",
        lbl_hora_aula: "Duración estándar de la lección",
        
        // Placeholders
        // Placeholders y Opciones
        ph_nome: "Ej: Escuela Nacional XXX",

        ph_administracao_op0: "Seleccione el tipo de Administración",
        ph_administracao_op1: "Federal",
        ph_administracao_op2: "Departamental",
        ph_administracao_op3: "Municipal",
        ph_administracao_op4: "Privada",

        ph_estado_op0: "Seleccione el estado",

        ph_cidade_op0: "Seleccionar ciudad",
           
        // Placeholders/Validação
        sel_administracao: "Seleccione la administración",
        sel_estado: "Seleccione el estado",
        sel_cidade: "Seleccione la ciudad",
        err_time: "Seleccione una hora válida",
        err_network: "No se pudo conectar con el servidor."
    }
};



export function getTranslation(key) {
    return translations[currentLang][key] || key;
}

export function setLanguage(lang) {
    currentLang = lang;
    sessionStorage.setItem('lang', lang);
    applyTranslations();
}

// export function applyTranslations() {
//     const elements = document.querySelectorAll('[data-translate]');
//     elements.forEach(el => {
//         const key = el.getAttribute('data-translate');
//         if (translations[currentLang][key]) {
//             // Se for um input/select com placeholder
//             if (el.placeholder) {
//                 el.placeholder = translations[currentLang][key];
//             } else {
//                 el.textContent = translations[currentLang][key];
//             }
//         }
//     });
// }

// // Função para trocar idioma
// export function changeLanguage(lang) {
//     currentLanguage = lang;
    
//     // Atualizar botões de idioma
//     document.querySelectorAll('.lang-btn').forEach(btn => {
//         btn.classList.remove('active');
//     });
//     document.getElementById(`btn-${lang}`).classList.add('active');
    
//     // Aplicar traduções
//     applyTranslations();
// }





// 1. Unificar o nome da variável (usar apenas currentLang)
//let currentLang = localStorage.getItem('lang') || 'pt';

// export function applyTraducao() {
//     const elements = document.querySelectorAll('[data-translate]');
    
//     elements.forEach(el => {
//         const key = el.getAttribute('data-translate');
//         const tradutor = translations[currentLang];

//         if (tradutor && tradutor[key]) {
//             const textoTraduzido = tradutor[key];

            
//             // Se o elemento tem o atributo data-tooltip, atualizamos ele!
//             if (el.hasAttribute('data-tooltip')) {
//                 el.setAttribute('data-tooltip', textoTraduzido);
                
//                 // PENTE FINO: Se o balão já estiver aberto na tela, 
//                 // precisamos achar a div do tooltip e atualizar o texto dela também
//                 const balaoAberto = document.querySelector('.tooltip-container');
//                 if (balaoAberto) {
//                     balaoAberto.setAttribute('data-tooltip', textoTraduzido);
//                     // Se você não usa attr(data-tooltip) no CSS, use:
//                     // balaoAberto.textContent = traducao;
//                 }
//             }

//                 // 1. Se for o ícone de ajuda (tooltip), alteramos APENAS o atributo
//             if (el.classList.contains('info-question')) {
//                 el.setAttribute('data-tooltip', textoTraduzido);
//                 // IMPORTANTE: Garantir que o interior da tag <i> continue vazio
//                 el.textContent = ''; 
//             }


//             // 2. Melhoria na lógica: Traduz placeholder E texto se existirem
//             if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
//                 el.placeholder = textoTraduzido;
//             } else if (el.tagName === 'SELECT') {
//                 // Para o select, traduzimos a primeira opção (o prompt)
//                 if (el.options[0]) el.options[0].textContent = textoTraduzido;
//             } else {
//                 el.textContent = textoTraduzido;
//             }
//         }
//     });
// }


export function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    const tradutor = translations[currentLang];

    if (!tradutor) return;

    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        const textoTraduzido = tradutor[key];

        if (textoTraduzido) {
            // 1. TRATAMENTO PARA ÍCONES/TOOLTIPS
            // Se for o ícone, mudamos apenas o atributo e PARAMOS por aqui (usando return no foreach)
            if (el.classList.contains('info-question')) {
                el.setAttribute('data-tooltip', textoTraduzido);
                el.textContent = ''; // Limpa qualquer texto que tenha entrado por erro
                return; // Pula para o próximo elemento do loop sem executar os códigos abaixo
            }

            // 2. TRATAMENTO PARA INPUTS
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = textoTraduzido;
            } 
            // 3. TRATAMENTO PARA SELECTS
            else if (el.tagName === 'SELECT') {
                if (el.options[0]) el.options[0].textContent = textoTraduzido;
            } 
            // 4. TRATAMENTO PARA TEXTOS GERAIS (Labels, H1, Botões)
            else {
                el.textContent = textoTraduzido;
            }
        }
    });
}
















export function changeLanguage(lang) {
    currentLang = lang; // Atualiza a variável correta
    sessionStorage.setItem('lang', lang);
    
    // Atualizar visual dos botões
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const btnAtivo = document.getElementById(`btn-${lang}`);
    if (btnAtivo) btnAtivo.classList.add('active');
    
    applyTranslations();
}

// Inicialização automática ao carregar o script
document.addEventListener('DOMContentLoaded', () => {
    changeLanguage('pt'); 
});