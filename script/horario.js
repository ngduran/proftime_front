// const API_CONFIG = {
//     BASE_URL: "http://127.0.0.1:8080",
//     RESOURCE: "/horario"
// };

// const ENDPOINTS = {
//     CREATE: { path: `${API_CONFIG.RESOURCE}/create`, method: 'POST' },
//     READ:   { path: `${API_CONFIG.RESOURCE}/read`,   method: 'POST' }
// };

// // Dados simulados para preencher a tabela conforme a imagem
// const dadosIniciais = [
//     { aula: 1, segunda: "2º Técnico A", terca: "3º Técnico A", quarta: "3º Técnico C", quinta: "3º Técnico A", sexta: "2º Técnico A" },
//     { aula: 2, segunda: "2º Técnico A", terca: "3º Técnico A", quarta: "3º Técnico C", quinta: "3º Técnico A", sexta: "Hora Atividade" },
//     { aula: 3, segunda: "3º Técnico A", terca: "3º Técnico A", quarta: "Hora Atividddade", quinta: "Hora Atividade", sexta: "Hora Atividade" },
// ];

// document.addEventListener('DOMContentLoaded', () => {
//     renderizarTabela(dadosIniciais);
// });

// function renderizarTabela(dados) {
//     const corpo = document.getElementById('gradeCorpo');
//     corpo.innerHTML = "";

//     // Gerar 6 linhas conforme a imagem
//     for (let i = 1; i <= 6; i++) {
//         const rowData = dados.find(d => d.aula === i) || { aula: i };
//         const tr = document.createElement('tr');
        
//         tr.innerHTML = `
//             <td>${i}</td>
//             <td>${formatBadge(rowData.segunda)}</td>
//             <td>${formatBadge(rowData.terca)}</td>
//             <td>${formatBadge(rowData.quarta)}</td>
//             <td>${formatBadge(rowData.quinta)}</td>
//             <td>${formatBadge(rowData.sexta)}</td>
//             <td>${formatBadge(rowData.sabado)}</td>
//             <td>${formatBadge(rowData.domingo)}</td>
//         `;
//         corpo.appendChild(tr);
//     }
// }

// function formatBadge(texto) {
//     if (!texto) return "";
//     let classe = "badge-blue";
//     if (texto.includes("3º Técnico A")) classe = "badge-orange";
//     if (texto.includes("3º Técnico C")) classe = "badge-purple";
//     if (texto.includes("Atividade") || texto.includes("Atividddade")) classe = "badge-activity";
    
//     return `<span class="badge ${classe}">${texto}</span>`;
// }

// async function salvarAula() {
//     const form = document.getElementById('gradeForm');
//     const formData = new FormData(form);
//     const dados = Object.fromEntries(formData.entries());

//     console.log("Adicionando à grade:", dados);

//     try {
//         const btn = document.getElementById("adicionarBtn");
//         btn.disabled = true;
//         btn.innerText = "Calculando...";

//         // Aqui chamaria sua função executarAcao(ENDPOINTS.CREATE, dados);
//         // Simulação de sucesso local:
//         alert("Aula adicionada com sucesso!");
        
//     } catch (error) {
//         alert(`Erro: ${error.message}`);
//     } finally {
//         const btn = document.getElementById("adicionarBtn");
//         btn.disabled = false;
//         btn.innerText = "Adicionar";
//     }
// }

// function voltarAoInicio() {
//     window.location.href = "index.html";
// }


