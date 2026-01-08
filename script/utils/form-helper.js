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