export function bloquearButton(btnId, textoButton) {
    const btn = document.getElementById(btnId);
    btn.disabled = true;
    btn.innerText = textoButton;
}

export function desbloquearButton(btnId, textoButton) {
    const btn = document.getElementById(btnId);
    btn.disabled = false;
    btn.innerText = textoButton;
}

export function limparFormulario(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    if (formulario) {
        formulario.reset();
    } else {
        console.error(`Formulário com ID "${idFormulario}" não foi encontrado.`);
    }    
}


// export function coletarDadosForm(idFormulario) {
//     const formulario = document.getElementById(idFormulario);
//     const formData = new FormData(formulario);
    
//     // Converte o FormData em um objeto simples { nome: '...', email: '...' }
//     return Object.fromEntries(formData.entries());
// }

export function coletarDadosForm(idFormulario) {
    const formulario = document.getElementById(idFormulario);
    const dados = {};

    // Itera por todos os elementos que possuem o atributo 'name'
    Array.from(formulario.elements).forEach(elemento => {
        if (!elemento.name) return; // Ignora botões ou campos sem nome

        if (elemento.tagName === 'SELECT') {
            // Captura o TEXTO visível do ComboBox
            const opcaoSelecionada = elemento.options[elemento.selectedIndex];
            dados[elemento.name] = opcaoSelecionada ? opcaoSelecionada.text : "";
        } else {
            // Captura o VALOR dos inputs, textareas, etc.
            dados[elemento.name] = elemento.value;
        }
    });

    return dados;
}


export async function popularFormulario(idFormulario, dados) {
    const formulario = document.getElementById(idFormulario);
    
    if (!formulario || !dados) {
        console.error("Formulário ou dados não fornecidos.");
        return;
    }

    // Filtramos apenas elementos que possuem o atributo 'name' e ignoramos botões
    const elementosValidos = Array.from(formulario.elements).filter(el => 
        el.name && el.tagName !== 'BUTTON'
    );

    console.log("*************************************************");
    console.log(elementosValidos);
    console.log("*************************************************");
    
    elementosValidos.forEach(campo => {
        const nomeCampo = campo.name;
        
        // Verifica se a chave existe no objeto de dados vindo do backend
        if (!(nomeCampo in dados)) return;

        let valor = dados[nomeCampo] ?? "";

        // 1. TRATAMENTO PARA CAMPOS 'TIME' (HH:mm:ss -> HH:mm)
        if (campo.type === 'time' && typeof valor === 'string' && valor.length > 5) {
            valor = valor.substring(0, 5);
        }

        // 2. TRATAMENTO PARA SELEÇÃO (Checkbox e Radio)
        if (campo.type === 'checkbox' || campo.type === 'radio') {
            campo.checked = (String(campo.value) === String(valor));
        } 
        // 3. TRATAMENTO PARA SELECT E DEMAIS INPUTS
        else {
            // Convertemos para String para garantir que o Select encontre o Value (ex: 1 vs "1")
            campo.value = (valor !== null && valor !== undefined) ? String(valor) : "";
        }

        // 4. INTEGRAÇÃO COM UI (Sua lógica de validação visual)
        if (typeof marcarSucesso === 'function' && valor !== "") {
            marcarSucesso(campo);
        }
    });

    // Pequeno delay para garantir que o DOM processe as mudanças
    await new Promise(resolve => setTimeout(resolve, 0));
    console.log(`[${idFormulario}] populado com sucesso.`);
}



export async function carregaFrom(idFormulario, dados) {
    const formulario = document.getElementById(idFormulario);
    
    if (!formulario || !dados) {
        console.error("Formulário ou dados não fornecidos.");
        return;
    }    
    
    // Filtramos apenas elementos que possuem o atributo 'name' e ignoramos botões
    const elementosValidos = Array.from(formulario.elements).filter(el => 
        el.name && el.tagName !== 'BUTTON'
    );    

    for (let element of elementosValidos) {
    const valor = dados[element.name]; // Pega o valor direto pela chave
    if (valor === undefined) continue;

        if (element.localName == 'select') {
            for (let option of element.options) {
                if (option.innerText.trim() === String(valor).trim()) {
                    element.value = option.value;
                    break;
                }
            }
        } else {
            // Para inputs normais
            element.value = valor;
        }
    }
}




export async function popularFormularioRefatorado(idFormulario, dados) {
    const formulario = document.getElementById(idFormulario);
    
    if (!formulario || !dados) {
        console.error("Formulário ou dados não fornecidos.");
        return;
    }    
    

    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::");
    console.log("::::: LAÇO DADOS ::::::::::::::::::::::::::::::::::::");
    for (let chave in dados) {
        if (dados.hasOwnProperty(chave)) {
            let valor = dados[chave];
            
            console.log(`Campo: ${chave} | Valor Recebido: ${valor}`);
            
            // Aqui você consegue ver, por exemplo:
            // Campo: administracao | Valor Recebido: Público Privada
        }
    }
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::");


    // Filtramos apenas elementos que possuem o atributo 'name' e ignoramos botões
    const elementosValidos = Array.from(formulario.elements).filter(el => 
        el.name && el.tagName !== 'BUTTON'
    );    

    console.log("*************************************************");
    console.log("Elementos a serem populados:", elementosValidos);
    console.log("*************************************************");

    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::");
    console.log("::::: LAÇO FOR ::::::::::::::::::::::::::::::::::::::");
    for (let index = 0; index < elementosValidos.length; index++) {
        const element = elementosValidos[index];
        console.log(element);
        console.log("Elemento: " + element) + " --> " + console.log("Nome do elemento: " + element.name); 
        
        for (let chave in dados) {
            if (dados.hasOwnProperty(chave)) {
                let valor = dados[chave];
                
                console.log(`Campo: ${chave} | Valor Recebido: ${valor}`);
                
                // Aqui você consegue ver, por exemplo:
                // Campo: administracao | Valor Recebido: Público Privada

                if (element.name == dados[chave]) {
                    element.text = valor;
                }

                if (element.localName == 'select') {
                    console.log('ENCONTREI UM COMBOBOX ---> ' + element.name);
                    console.log('ENCONTREI UM COMBOBOX ---> ' + element.name);
                    console.log('ENCONTREI UM COMBOBOX ---> ' + element.name);
                    console.log('ENCONTREI UM COMBOBOX ---> ' + element.name);

                    for (let option of element.options) {
                        console.log('Imprimir o index');
                        console.log(option.index);
                        if(option.innerText == valor){
                            element.value = option.index;
                        }
                    }
                }
            }
        }
    }
        





    
    console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::");








    // elementosValidos.forEach(campo => {
    //     const nomeCampo = campo.name;
        
    //     // Se a chave do 'name' não existe no JSON de dados, pulamos para o próximo
    //     if (!(nomeCampo in dados)) return;

    //     let valor = dados[nomeCampo] ?? "";

    //     console.log(campo.localName);



    //     // Usamos o switch case para tratar cada tipo de entrada do seu formulário
    //     switch (campo.localName) {
    //         // 1. INPUT (Texto, email, etc.)
    //         case 'input':
    //             campo.value = valor;
            
    //         case 'select-one':
           
    //         console.log("Entrou no case do select-one");
    //         // aqui você tem que fazer um laço para percorrer os option
            
    //         console.log("====================================================");
    //         console.log("O nome do select");
    //         console.log("====================================================");
    //         console.log(campo.localName);
    //         console.log("====================================================");
            
    //         // 2. Se o campo continuar vazio ou no padrão (não selecionou por ID), busca pelo TEXTO
    //         if (campo.selectedIndex <= 0) {
    //             // Transformamos as options em Array para procurar o texto correspondente
    //             const optionEncontrada = Array.from(campo.options).find(opt => 
    //                 opt.text.trim().toLowerCase() === String(valor).trim().toLowerCase()
    //             );

    //             if (optionEncontrada) {
    //                 campo.value = optionEncontrada.value;
    //             }
    //         }
    //         break;

    //         case 'text':
    //         case 'email':
    //         case 'number':
    //             campo.value = valor;
    //             break;

            

    //         // 3. TIME (Campos de hora)
    //         case 'time':
    //             // Ajusta o formato HH:mm:ss vindo do Java/Banco para HH:mm
    //             campo.value = (typeof valor === 'string' && valor.length > 5) 
    //                 ? valor.substring(0, 5) 
    //                 : valor;
    //             break;
    //         }

    //     // INTEGRAÇÃO COM UI: Se você tiver a função marcarSucesso, ela valida o campo visualmente
    //     if (typeof marcarSucesso === 'function' && valor !== "") {
    //         marcarSucesso(campo);
    //     }
    // });

    // Garante a sincronia com o DOM antes de seguir
    await new Promise(resolve => setTimeout(resolve, 0));
    console.log(`[${idFormulario}] populado com sucesso.`);
}




export function aplicarMascaraTelefone(valor) {
    if (!valor) return "";
    valor = valor.replace(/\D/g, ""); // Remove tudo que não é número
    valor = valor.replace(/(\d{2})(\d)/, "($1) $2"); // Coloca parênteses no DDD
    
    // Lógica dinâmica para o hífen:
    if (valor.length > 13) {
        // Celular: (00) 00000-0000 (14 ou 15 caracteres com máscara)
        valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    } else {
        // Fixo: (00) 0000-0000
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
    }
    
    return valor.substring(0, 15); // Limita ao tamanho máximo de celular
}

export function configurarMascaraTelefone(id) {
    const campo = document.getElementById(id);
    if (campo) {
        campo.addEventListener('input', (e) => {
            e.target.value = aplicarMascaraTelefone(e.target.value);
        });
    }
}

/**
 * Redireciona para uma página específica dentro da pasta /page/
 * @param {string} nomePagina - O nome do arquivo (ex: 'login', 'home', 'index')
 */
export function navegarPara(nomePagina) {    
    const pagina = nomePagina.replace('.html', '');  
    window.location.href = `../page/${pagina}.html`;
}

// // Evento para formatar enquanto o usuário digita
// document.getElementById('telefone').addEventListener('input', (e) => {
//     e.target.value = aplicarMascaraTelefone(e.target.value);
// });


export function renderizarTabela() {
    const corpo = document.getElementById('gradeCorpo');
    corpo.innerHTML = "";
    
    for (let i = 1; i <= 6; i++) {
        const dadosLinha = gradeDeAulas.find(d => d.aula === i) || { aula: i };
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i}</td>
            <td>${formatBadge(dadosLinha.segunda)}</td>
            <td>${formatBadge(dadosLinha.terca)}</td>
            <td>${formatBadge(dadosLinha.quarta)}</td>
            <td>${formatBadge(dadosLinha.quinta)}</td>
            <td>${formatBadge(dadosLinha.sexta)}</td>
        `;
        corpo.appendChild(tr);
    }
}


// Dicionário para guardar qual cor cada turma ganhou
export const mapaCoresTurmas = {};
// Array de classes CSS que você definiu no seu arquivo
const classesDisponiveis = ["badge-blue", "badge-orange", "badge-purple", "badge-green", "badge-red"];
let indiceCor = 0;

function formatBadge(texto) {
    if (!texto) return "";

    // Caso especial para Hora Atividade (sempre cinza/estilo específico)
    if (texto.toLowerCase().includes("atividade")) {
        return `<span class="badge badge-activity">${texto}</span>`;
    }

    // Se a turma ainda não tem uma cor atribuída, damos uma a ela
    if (!mapaCoresTurmas[texto]) {
        mapaCoresTurmas[texto] = classesDisponiveis[indiceCor % classesDisponiveis.length];
        indiceCor++; // Próxima turma terá a próxima cor
    }

    const classeAtribuida = mapaCoresTurmas[texto];
    return `<span class="badge ${classeAtribuida}">${texto}</span>`;
}

/**
 * Força a abertura do seletor de horas ao clicar em qualquer lugar do input
 */
export function configurarAbrirRelogioAoClicar(id) {
    const campo = document.getElementById(id);
    
    if (campo) {
        campo.addEventListener('click', () => {
            try {
                // Tenta abrir o seletor nativo do navegador
                if ('showPicker' in HTMLInputElement.prototype) {
                    campo.showPicker();
                } else {
                    // Fallback para navegadores antigos
                    campo.focus();
                    campo.click();
                }
            } catch (error) {
                console.warn("showPicker não suportado ou erro ao abrir:", error);
            }
        });
    }
}