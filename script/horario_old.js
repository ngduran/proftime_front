const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8080",
    RESOURCE: "/horario" // Recurso alterado para horário
};

const ENDPOINTS = {
    CREATE: { path: `${API_CONFIG.RESOURCE}/create`, method: 'POST' },
    DELETE: { path: `${API_CONFIG.RESOURCE}/delete`, method: 'DELETE' }
    // Adicione outros conforme necessário
};

// Armazenamento local temporário para a lista visual
let listaHorarios = [];

// document.addEventListener('DOMContentLoaded', () => {
//     const btnAdicionar = document.getElementById("adicionarBtn");
//     btnAdicionar.addEventListener('click', adicionarHorario);
// });

/**
 * Coleta dados e envia para o servidor, depois atualiza a tela
 */
async function adicionarHorario() {
    console.log("chamou a função adicionar Horário");
    const formId = "horarioForm";
    const btn = document.getElementById("adicionarBtn");
    
    try {
        const dados = coletarDadosForm(formId);
        console.log(dados);
        
        // Validação básica antes de enviar
        // if (!dados.posicao || !dados.diaSemana || !dados.horaInicio) {
        //     alert("Preencha os campos obrigatórios!");
        //     return;
        // }

        //btn.disabled = true;
        //btn.innerText = "Enviando...";

        // Envia para o Back-end (seu método executarAcao)
        //const resultado = await executarAcao(ENDPOINTS.CREATE, dados);

        // Se o servidor retornar o objeto criado, adicionamos na lista visual
        //if (resultado) {
            listaHorarios.push(dados);
            renderizarLista();
            alert("Horário adicionado!");
            document.getElementById(formId).reset();
        //}

    } catch (error) {
        alert(`Erro ao adicionar: ${error.message}`);
    } finally {
        //btn.disabled = false;
        //btn.innerHTML = `Adicionar Horário <i class="fa-solid fa-plus"></i>`;
    }
}

/**
 * Renderiza os itens na seção de "Horários Registrados"
 */
function renderizarLista() {
    const listaUl = document.getElementById("saved-schedules");
    listaUl.innerHTML = ""; // Limpa a lista

    // if (listaHorarios.length === 0) {
    //     listaUl.innerHTML = `<li class="empty-message-item">Nenhum horário registrado ainda.</li>`;
    //     return;
    // }
    //<span class="star">★</span> ${item.horaInicio} - ${item.horaFim}</p>

    listaHorarios.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "schedule-item-card";
        li.innerHTML = `
            <div class="item-data">
                <p><strong>Posição:</strong> ${item.posicao} <strong>Dia:</strong> ${item.diaSemana}
                
                <strong>Turno:</strong> ${item.turno}</p>
            </div>
            <div class="item-actions">
                <button class="btn-icon-action edit" onclick="prepararEdicao(${index})"><i class="fa-solid fa-pen"></i> Alterar</button>
                <button class="btn-icon-action delete" onclick="removerHorario(${item.id}, ${index})"><i class="fa-solid fa-trash"></i> Deletar</button>
            </div>
        `;
        listaUl.appendChild(li);
    });

    // Atualiza o "Output de datas" com o JSON atual da lista
    //document.getElementById("json-output").innerText = JSON.stringify(listaHorarios, null, 2);
}

/**
 * Remove o horário chamando a API
 */
async function removerHorario(id, indexLocal) {
    if (!confirm("Deseja excluir este horário?")) return;

    try {
        await executarAcao(ENDPOINTS.DELETE, {}, id);
        listaHorarios.splice(indexLocal, 1);
        renderizarLista();
    } catch (error) {
        alert("Erro ao deletar: " + error.message);
    }
}

// --- FUNÇÕES AUXILIARES DO SEU EXEMPLO ---

function coletarDadosForm(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const formData = new FormData(formulario);
    return Object.fromEntries(formData.entries());
}

async function executarAcao(endpoint, dados, id = null) {
    const pathComId = id ? `${endpoint.path}/${id}` : endpoint.path;
    const URL = `${API_CONFIG.BASE_URL}${pathComId}`;

    const FETCH_CONFIG = {        
        method: endpoint.method,
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: endpoint.method !== 'GET' && endpoint.method !== 'DELETE' ? JSON.stringify(dados) : null
    };
   
    const response = await fetch(URL, FETCH_CONFIG);
    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    return await response.json();
}