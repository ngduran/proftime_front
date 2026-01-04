const API_CONFIG = {
    BASE_URL: "http://127.0.0.1:8080",
    RESOURCE: "/auth"
};

const ENDPOINTS = {
    CREATE: { path: `${API_CONFIG.RESOURCE}/login`, method: 'POST'  }    
};

function coletarDadosForm(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const formData = new FormData(formulario);
    
    // Converte o FormData em um objeto simples { nome: '...', email: '...' }
    return Object.fromEntries(formData.entries());
}

async function executarAcao(endpoint, dados, id = null) {
    
    const { path, method } = endpoint;
  
    const pathComId = id ? `${endpoint.path}/${id}` : endpoint.path;
    const URL = `${API_CONFIG.BASE_URL}${pathComId}`;

    const HEADERS = new Headers({
        "Content-Type": "application/json"
    });

    const FETCH_CONFIG = {        
            method: method,
            mode: 'cors',
            cache: 'no-cache',
            headers: HEADERS,           
            body: endpoint.method !== 'GET' ? JSON.stringify(dados) : null
    }
   
    try {
        const response = await fetch(URL, FETCH_CONFIG);
        
        if (!response.ok) {
            const erroStatus = await response.json().catch(() => ({}));
            throw new Error(erroStatus.message || `Erro no servidor: ${response.status}`);
        }

        // SOLUÇÃO: Verifica se o status é 204 (No Content) ou se não há corpo
        const contentType = response.headers.get("content-type");
        if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
            console.log("Sucesso, mas sem corpo de resposta.");
            return null; 
        }

        const data = await response.json();
         console.log("Resposta do servidor:", data);
        return data;
    } catch (error) {
        console.error("Erro ao acessar o servidor:", error);
        throw error;
        
    }

}

async function logar() {   

    const ACAO_BOTAO = { nome: 'Logar', acao: 'Logando...'}

    try {
        
        const dados = coletarDadosForm("loginForm");
        console.log(dados);
        const btn = document.getElementById("loginBtn");
        btn.disabled = true;
        btn.innerText = ACAO_BOTAO.acao;        
       
        const resultado = await executarAcao(ENDPOINTS.CREATE, dados);        
      
        if (resultado && resultado.id) {
            sessionStorage.setItem('loginId', resultado.id);
            console.log("ID guardado na sessão:", resultado.id);
        }        
        
       alert("Operação realizada com sucesso!");
       document.getElementById("loginForm").reset();

    } catch (error) {
        alert(`Falha ao salvar: ${error.message}`);
    } finally {
        // Restaura o botão independente de sucesso ou erro
        const btn = document.getElementById("loginBtn");
        btn.disabled = false;
        btn.innerText = ACAO_BOTAO.nome;        
    }
}



















// function login() {

//     const usuario = document.getElementById('username');
//     const password = document.getElementById('password');

//     var headers = new Headers();    
//     headers.append("Content-Type", "application/json");
//     headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
   
//     //fetch('http://192.168.1.100:8080/professores/novo', {
//     fetch('http://10.47.4.163:8080/login', {    
//         method: "POST",
//         mode: "cors", // Usando 'cors' para permitir a requisição de origem cruzada
//         cache: "no-cache",
       
//         body: JSON.stringify({ usuario: usuario, password: password }), // Convertendo o objeto JavaScript para JSON

//         headers: headers
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         } else {
//             console.log("Foi ao servidor e voltou com sucesso");
//             window.location.href = 'sucesso.html'; // Redireciona para a página de sucesso
//         }
//         return response.json();
//     })
//     .then(data => console.log(data))
//     .catch(error => console.error('Error:', error));
// }

// function criarConta() {
//     window.location.href='../page/conta.html'
// }