const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

// Simulação de banco de dados local
let dadosCalendario = {}; 

document.addEventListener("DOMContentLoaded", () => {
    gerarCalendarioCompleto(2026);
    configurarEventosDOM();
});

function gerarCalendarioCompleto(ano) {
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    meses.forEach((mes, index) => {
        const mesCard = document.createElement("div");
        mesCard.className = "month-card";
        mesCard.innerHTML = `<h3>${mes}</h3><div class="days-grid" id="mes-${index}"></div>`;
        grid.appendChild(mesCard);
        
        const diasGrid = document.getElementById(`mes-${index}`);
        diasSemana.forEach(d => diasGrid.innerHTML += `<div class="day-name">${d}</div>`);

        const data = new Date(ano, index, 1);
        for (let i = 0; i < data.getDay(); i++) diasGrid.innerHTML += `<div></div>`;

        while (data.getMonth() === index) {
            const diaStr = data.toISOString().split('T')[0];
            const div = document.createElement("div");
            div.className = `day-cell ${getClasseDia(diaStr)}`;
            div.innerText = data.getDate();
            div.onclick = () => abrirModalIndividual(diaStr);
            diasGrid.appendChild(div);
            data.setDate(data.getDate() + 1);
        }
    });
}

function abrirModalIndividual(data) {
    document.getElementById("modalTitle").innerText = `Editar Dia: ${data}`;
    document.getElementById("dataInicio").value = data;
    document.getElementById("campoDataFinal").style.display = "none";
    document.getElementById("modalEdicao").style.display = "flex";
}

function abrirModalLote() {
    document.getElementById("modalTitle").innerText = "Editar Período (Lote)";
    document.getElementById("campoDataFinal").style.display = "block";
    document.getElementById("modalEdicao").style.display = "flex";
}

function configurarEventosDOM() {
    document.getElementsByName("tipoDia").forEach(radio => {
        radio.addEventListener("change", (e) => {
            document.getElementById("motivoContainer").style.display = 
                e.target.value === "NAO_LETIVO" ? "block" : "none";
        });
    });
}

async function processarSalvamento() {
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value || dataInicio;
    const tipo = document.querySelector('input[name="tipoDia"]:checked').value;
    const motivo = document.getElementById("motivo").value;

    // Aqui você chamaria sua API Java enviando o objeto para persistência
    console.log(`Salvando: ${dataInicio} até ${dataFim} como ${tipo} (${motivo})`);
    
    // Simulação de atualização visual
    alert("Dados enviados para o sistema de referência global!");
    fecharModal();
    gerarCalendarioCompleto(2026);
}

function fecharModal() { document.getElementById("modalEdicao").style.display = "none"; }
function getClasseDia(data) { return dadosCalendario[data]?.tipo === "LETIVO" ? "day-letivo" : ""; }