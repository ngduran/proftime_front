window.onload = function() {
    console.log('carregou a página');
  
    //desabilita o botão no início
    //document.getElementById("submit-btn-consultar").disabled = true;
    //document.getElementById("submit-btn-consultar").style.background = '#FFA500';
  
    //document.getElementById("submit-btn-alterar").disabled = true;
    //document.getElementById("submit-btn-apagar").disabled = true;
  
  };
  
  
  function salvar() {
    const nome = document.getElementById('nome').value; 
    
    console.log('O nome --> ' + nome);
  
    var headers = new Headers();    
    headers.append("Content-Type", "application/json");
    //headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    //headers.append('Access-Control-Allow-Origin', 'http://10.47.6.198:5500');
    headers.append('Access-Control-Allow-Origin', '*');
  
    fetch('http://127.0.0.1:8080/professor/insert' ,{
  
      method: "POST",
      mode: "cors", // Usando 'cors' para permitir a requisição de origem cruzada
      cache: "no-cache",
      
      // Convertendo o objeto JavaScript para JSON
      // Esta parte é importante onde você deve passar os parametros (dados) da sua tela 
      body: JSON.stringify({ nome: nome }), 
  
      headers: headers
  
      //Aqui inicia função then
    }).then(response => {
      if (response.ok) {
          return response.json();  // Transforma a resposta em JSON
      } else {
          console.log('Aconteceu algo que não foi possivel salvar');
          throw new Error('Erro ao tentar salvar');
      }
    })
    .then(data => {
        // Aqui você pode acessar o `id` retornado do back-end
        const id_professor = data.id;
        console.log('ID do registro salvo:', id_professor);
  
        // Se quiser armazenar o ID no localStorage
        localStorage.setItem('id_professor', id_professor);
  
        // Redirecionar para a página de sucesso
        //window.location.href = 'sucesso.html';
    })
    .catch(error => console.error('Erro!:', error));
     
  
  }
  
  
  function consultar() {
  
    console.log("Chamou o consutlar...");
  
    const nome = document.getElementById('nome').value; 
    
    console.log('O nome --> ' + nome);
  
    var headers = new Headers();    
    headers.append("Content-Type", "application/json");
    //headers.append('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    //headers.append('Access-Control-Allow-Origin', 'http://10.47.6.198:5500');
    headers.append('Access-Control-Allow-Origin', '*');
  
    console.log(`http://127.0.0.1:8080/professor/buscaPorNome?nome=${nome}`);
  
    fetch(`http://127.0.0.1:8080/professor/buscaPorNome?nome=${nome}` ,{
  
      method: "GET",
      mode: "cors", // Usando 'cors' para permitir a requisição de origem cruzada
      cache: "no-cache",
      
      // Convertendo o objeto JavaScript para JSON
      // Esta parte é importante onde você deve passar os parametros (dados) da sua tela 
      //body: JSON.stringify({ nome: nome }), 
  
      headers: headers
  
      //Aqui inicia função then
    }).then(response => {
  
      if (response.ok) {
        return response.text(); // Usamos text() para lidar com retorno direto (não é JSON)
      } else {
        console.error('Erro na resposta da API');
        throw new Error('Erro ao tentar buscar a conta');
      }
    })
    .then(id_professor => {
      console.log("ID professro encontrado:", id_professor); // Aqui o id é diretamente o retorno
  
      if (id_professor) {
        localStorage.setItem('id_professor', id_professor);
        alert("item encontrado com sucesso! agora é possivel alterar ou deletar o registro");
      } else {
        console.error("ID não encontrado na resposta");
      }
    })
    .catch(error => {
      console.error("Erro capturado no catch:", error);
    });
     
  
    function alterar() {
      const nome_conta = document.getElementById('nome_conta').value;
      const descricao_conta = document.getElementById('descricao_conta').value;
    
     
        //se quiser armazenar o ID no localStorage
        const ID = localStorage.getItem('id_conta');
    
    
    
      console.log(nome_conta)
      console.log(ID)
      console.log(descricao_conta)
     
      // Cabeçalho não visivel para o usuario
      var headers = new Headers();    
      headers.append("Content-Type", "application/json");
      headers.append('Access-Control-Allow-Origin', '*http://127.0.0.1:5500*');
    
      fetch(`http://localhost:8080/conta/${ID}` ,{
    
        method: "PUT",
        mode: "cors", // Usando 'cors' para permitir a requisição de origem cruzada
        cache: "no-cache",
       
        // Convertendo o objeto JavaScript para JSON
        // Esta parte é importante onde você deve passar os parametros (dados) da sua tela
        body: JSON.stringify({ nome: nome_conta, descricao: descricao_conta}),
    
        headers: headers
    
        //Aqui inicia função then
      }).then(response => {
    
        if(response.ok) {
    
          //Esta linha imprime a mensagem no concole
          console.log('Foi no servidor e voltou');
    
          //Esta linha carrega a página sucesso
          window.location.href = 'sucesso3.html'    
        } else {
          //Esta linha imprime a mensagem no console
          console.log('Aconteceu algo que não foi possivel salvar');
    
          //Esta linha imprime a mensagem de erro
          throw new Error('Erro ao tentar salvar');
        }
    
      })
      //Aqui será executado caso a then não seja chamado
      .catch(error => console.error('Erro!:', error));
    
    }
  
  }