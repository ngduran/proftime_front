// //let currentLanguage = 'pt';

// let currentLang = sessionStorage.getItem('lang') || 'pt';

export const translations = {
//     pt: {

//         // Campos do Formulário Instituição
//         lbl_titulo: "Instituição",
//         lbl_nome: "Nome da Instituição",
//         lbl_administracao: "Administração",
//         lbl_estado: "Estado (UF)",
//         lbl_cidade: "Cidade",
//         lbl_horario_inicial: "Hora de Início",
//         lbl_hora_aula: "Hora Aula",


//         // Geral
//         lbl_cadastrarBtn: "Salvar",
//         lbl_cadastrarBtn_saving: "Salvando...",

//         lbl_cadastrarBtn_consulting: "Consultando...",

//         lbl_voltarBtn: "Voltar ao Início",


//         tp_lbl_nome: "Nome utilizado para identificação",
//         tp_lbl_administracao: "Qual é o tipo da administração",
//         tp_lbl_estado: "Em qual estado fica?",
//         tp_lbl_cidade: "Em qual cidade?",        
//         tp_lbl_horario_inicial: "Informe o horário inicial das aulas",
//         tp_lbl_hora_aula: "Informe a duração de uma aula",
//         tp_lbl_hora_aula: "Informe a duração de uma aula",
        


//         loading: "Carregando...",
//         success_save: "A Instituição foi criada com sucesso!",
//         success_load: "Os dados foram carregados com sucesso!",
        
        
//         // Placeholders
//         ph_nome: "Ex: Escola Estadual XXX",
        
//         ph_administracao_op0: "Selecione o tipo de Administração",
//         ph_administracao_op1: "2020",
//         ph_administracao_op2: "2021",
//         ph_administracao_op3: "2022",
//         ph_administracao_op4: "2023",
//         ph_administracao_op5: "2024",
//         ph_administracao_op6: "2025",
        
//         ph_estado_op0: "Selecione o estado",

//         ph_cidade_op0: "Selecione a cidade",

//         // Placeholders/Validação
//         sel_administracao: "Selecione a administração",
//         sel_estado: "Selecione o estado",
//         sel_cidade: "Selecione a cidade",
//         err_time: "Selecione uma hora válida",
//         err_network: "Não foi possível alcançar o servidor."
//     },
//     es: {

//         // Campos do Formulário Instituição
//         lbl_titulo: "Institución",
//         lbl_nome: "Nombre de la Institución",
//         lbl_administracao: "Administración",
//         lbl_estado: "Estado (UF)",
//         lbl_cidade: "Ciudad",
//         lbl_horario_inicial: "Hora de inicio",
//         lbl_hora_aula: "Duración",
        
//         // Geral
//         lbl_cadastrarBtn: "Guardar",
//         lbl_cadastrarBtn_saving: "Guardando...",

//         lbl_cadastrarBtn_consulting: "consultante...",


//         lbl_voltarBtn: "Volver arriba",

//         tp_lbl_nome: "Nombre utilizado para identificación",
//         tp_lbl_administracao: "¿Qué tipo de administración es?",
//         tp_lbl_estado: "¿En qué estado se encuentra?",
//         tp_lbl_cidade: "¿En qué ciudad?",
//         tp_lbl_horario_inicial: "Por favor especifique la hora de inicio de clases.",
//         tp_lbl_hora_aula: "Por favor especifique la duración de una lección.",

//         loading: "Consultando...",
//         success_save: "¡La Institución fue creada con éxito!",
//         success_load: "¡Los datos se cargaron correctamente!",
        
        
//         // Placeholders
//         // Placeholders y Opciones
//         ph_nome: "Ej: Escuela Nacional XXX",

//         ph_administracao_op0: "Seleccione el tipo de Administración",
//         ph_administracao_op1: "Federal",
//         ph_administracao_op2: "Departamental",
//         ph_administracao_op3: "Municipal",
//         ph_administracao_op4: "Privado",
//         ph_administracao_op5: "Público Privado",
//         ph_administracao_op6: "Individual",


//         ph_estado_op0: "Seleccione el estado",

//         ph_cidade_op0: "Seleccionar ciudad",
           
//         // Placeholders/Validação
//         sel_administracao: "Seleccione la administración",
//         sel_estado: "Seleccione el estado",
//         sel_cidade: "Seleccione la ciudad",
//         err_time: "Seleccione una hora válida",
//         err_network: "No se pudo conectar con el servidor."
//     }
 };

// export function changeLanguage(newLang) {
//     currentLang = newLang; // Atualiza sua variável global de idioma
    
//     // 1. Traduz o que está fora do Shadow DOM (Light DOM)
//     applyTranslations(); 

//     // 2. Dispara um evento global para os Web Components (Shadow DOM)
//     const event = new CustomEvent('languageChanged', { 
//         detail: { lang: newLang },
//         bubbles: true, 
//         composed: true // Permite que o evento atravesse as fronteiras do Shadow DOM
//     });
//     window.dispatchEvent(event);
// }


// // Inicialização automática ao carregar o script
// document.addEventListener('DOMContentLoaded', () => {
//     changeLanguage('pt'); 
// });


export function getTranslation(key) {
    //return translations[currentLang][key] || key;
}

// export function setLanguage(lang) {
//     currentLang = lang;
//     sessionStorage.setItem('lang', lang);
//     applyTranslations();
// }



export function applyTranslations(root = document) {
//     const tradutor = translations[currentLang];
//     if (!tradutor) return;

//     // 1. Traduz elementos no root atual (seja Document ou ShadowRoot)
//     const elements = root.querySelectorAll('[data-translate]');

//     elements.forEach(el => {
//         const key = el.getAttribute('data-translate');
//         const textoTraduzido = tradutor[key];

//         if (textoTraduzido) {
//             if (el.classList.contains('info-question')) {
//                 el.setAttribute('data-tooltip', textoTraduzido);
//             } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
//                 el.placeholder = textoTraduzido;
//             } else if (el.tagName === 'SELECT') {
//                 // Apenas ignora o SELECT para não sobrescrever o texto do pai
//                 return; 
//             } else {
//                 // Traduz Options, Labels, Botões, etc.
//                 el.textContent = textoTraduzido;
//             }
//         }
//     });

//     // 2. SE o root for o document, precisamos entrar nos Shadow DOMs dos campos
//     if (root === document) {
//         // Busca todos os seus Custom Elements (Web Components)
//         const customFields = document.querySelectorAll('administracao-field, instituicao-field, municipio-field');
//         customFields.forEach(field => {
//             if (field.shadowRoot) {
//                 // Chamada recursiva para traduzir o interior do componente
//                 applyTranslations(field.shadowRoot);
//             }
//         });
//     }
 }