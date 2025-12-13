const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8080",
    RESOURCE: "/professor"
};

const ENDPOINTS = {
    CREATE: { path: `${API_CONFIG.RESOURCE}/create`, method: 'POST'  },
    READ:   { path: `${API_CONFIG.RESOURCE}/read`,   method: 'GET'   },
    UPDATE: { path: `${API_CONFIG.RESOURCE}/update`, method: 'PUT'   },
    DELETE: { path: `${API_CONFIG.RESOURCE}/delete`, method: 'DELETE'}
};

const FORM_FIELDS = ['nome', 'email', 'telefone', 'senha'];

/**
 * Coleta dados de forma dinâmica baseada em uma lista de IDs
 */
function coletarDados() {
    const dados = {};
    FORM_FIELDS.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) {
            dados[id] = elemento.value.trim();
        }
    });
    return dados
}


async function executarAcao(endpoint, dados) {

    const URL = `${API_CONFIG.BASE_URL}${endpoint.path}`;
    const { path, method } = endpoint;

    const HEADERS = new Headers({
        "Content-Type": "application/json"
    });

    const FETCH_CONFIG = {        
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            headers: HEADERS,
            body: JSON.stringify(
                dados
            )
    }
   
    return fetch(URL, FETCH_CONFIG)
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do servidor:", data);
        })
            .catch(error => {
            console.error("Erro ao acessar o servidor:", error);
        });

}

function coletarDados() {
      
    return {        
        nome: document.getElementById("nome").value.trim(),
        email: document.getElementById("email").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        senha: document.getElementById("senha").value.trim(),
         
    };
}

function salvar() {
    const dados = coletarDados();

    const resultado = executarAcao(ENDPOINTS.CREATE, dados);    
    
}



function mostrarErro(idElemento, mensagem) {
    document.getElementById(idElemento).textContent = mensagem;
}

function mostrarMensagem(texto, tipo) {
  console.log("chamou o mostrar mensagem");
  const mensagemDiv = document.getElementById("erro-mensagem");
  mensagemDiv.innerHTML = texto;

  if (tipo === "sucesso") {
    mensagemDiv.className = "mensagem sucesso";
  } else {
    mensagemDiv.className = "mensagem erro";
  }
}

function limparErros() {
    let erros = document.querySelectorAll('.erro');
    erros.forEach(e => e.textContent = '');
}

function limparMensagem() {
  const mensagem = document.getElementById('erro-mensagem');
  if (mensagem) mensagem.textContent = '';
}

function validarFormulario() {
    //limparErros();
    
    // Captura dos valores do formulário
    let nome = document.getElementById("nome").value;
    let email = document.getElementById("email").value;
    let telefone = document.getElementById("telefone").value;
    let senha = document.getElementById("senha").value;
    
    let ok = true;
    
    if (!nome) { mostrarErro('erro-nome', 'Verifique se possui nome para continuar.'); ok = false; }
    
    return ok;
}



function limparCampos() {
    console.log("Iniciando limpeza dos campos do formulário...");

    // 1. Limpa os campos de texto/input
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("senha").value = "";     
    
    console.log("Limpeza concluída. Formulário pronto para novo registro.");
}

// function salvar() {

//     const dados = coletarDados();

//     console.log("--------------- DADOS -------------------------------");
//     console.log(dados);
//     console.log("-----------------------------------------------------");

//     var headers = new Headers();
//     headers.append("Content-Type", "application/json");
//     headers.append("Access-Control-Allow-Origin", "*");

//     fetch("http://localhost:8080/professor/salvar", {

//         method: 'POST',
//         mode: 'cors',
//         cache: 'no-cache',
//         body: JSON.stringify(
//             dados
//         ),

//         headers: headers

//     })
    
//     .then(response => response.json()) // converte a resposta para JSON
//     .then(data => {
//         console.log("Resposta do servidor:", data);
//     })
//     .catch(error => {
//         console.error("Erro ao acessar o servidor:", error);
//     });

// }



// function salvar() {

//     console.log("chamou o salvar");
    
//     limparErros();
    
//     if (!validarFormulario()) return;
    
//     const dados = coletarDados();
//     //console.log("Enviando criar conta:", dados);
//     console.log(dados);
    
//    // console.log(JSON.stringify(dados));//enviando dados

//     var headers = new Headers();
//     headers.append("Content-Type", "application/json");
//     headers.append("Access-Control-Allow-Origin", "*");

//     // Envia os dados via fetch
//     fetch("http://localhost:8080/professor/salvar", { // altere a URL conforme seu endpoint
       
//         method: 'POST',
//         mode: 'cors',
//         cache: 'no-cache',
//         body: JSON.stringify(
//             dados
//         ),
    
//         headers: headers

//     }).then(async response => {
//         let data = await response.json();
  
//         console.log("resposta do servidor");
//         console.log(data);//resposta do servidor
        
//         if (!response.ok) {
//           // Caso sejam erros de validação no DTO
//           if (typeof data === "object") {
//             let mensagens = Object.values(data).join("<br>");
  
//             console.log("Entrou dento do if data ==== object");
//             console.log("----------------------------------------------");
//             console.log(mensagens);
//             console.log("----------------------------------------------");
  
//               let mensagensGlobais = []; // Para erros que não mapeiam para um campo específico
  
//               for (const [campo, mensagem] of Object.entries(data)) {
//                   // Mapeia o nome do campo do backend ('cpf', 'email', etc.) para o ID do elemento no HTML
//                   const idElementoErro = "erro-" + campo; // Ex: 'cpf_error_message'
  
//                   console.log("========================================================");
//                   console.log(idElementoErro);
//                   console.log("========================================================");
//                   // Tenta exibir o erro no elemento específico
//                   if (document.getElementById(idElementoErro)) {
//                       //CHAMANDO A SUA FUNÇÃO mostrarErro(idElemento, mensagem)
//                       limparCampos();
//                       mostrarErro(idElementoErro, mensagem);
                                          
//                   } 
//               }
  
            
//           } else {
//             mostrarMensagem("⚠️ Erro desconhecido", "erro");
//            //alert("⚠️ " + text);
//           }
//           throw new Error("Erro de validação");
//         }
  
//         return data;
//       })
//       .then(data => {
//         if (data.id) {
//           localStorage.setItem("id_professor", data.id);
//           mostrarMensagem(data.message || "✅ Professor cadastrado com sucesso!", "sucesso");          
//           limparCampos();
//           //limparMensagem();
//         }
//       })
//       .catch(error => console.error("Erro ao cadastrar:", error));

// }