import { Table_Standard } from "../../base/Table_Standard.js";


export class Grade_Horario_Professor extends Table_Standard {

    async connectedCallback() {
        super.connectedCallback();
        this.renderizarGrade();
    }

    // Dentro da classe do seu Web Component (ex: GradeProfessor)

    /**
     * Lê o LocalStorage e renderiza as aulas nas células correspondentes.
     * Este método deve ser chamado no connectedCallback ou após adicionar uma aula.
     */
    renderizarGrade() {

        console.log("==================================================");
        console.log("Chamou o renderizar Grade")
        console.log("==================================================");
        // 1. Busca os dados brutos
        const rawData = localStorage.getItem('grade_proftime_local');
        if (!rawData) return;

        console.log("==================================================");
        console.log("Imprimindo os dados capturados do local storage")
        console.log("==================================================");
        console.log(rawData);

        try {
            console.group("%c 🔍 RASTREAMENTO: Renderização da Grade ", "background: #1748AF; color: white; padding: 2px;");

            const dados = JSON.parse(rawData);
            // Ajuste para ler tanto o array plano quanto a estrutura antiga se existir
            const listaAulas = Array.isArray(dados) ? dados : (dados.itens || []);

            console.log(`%c INFO %c Estrutura de dados detectada: ${Array.isArray(dados) ? 'Array Plano' : 'Objeto Complexo'}`, "color: #3498db; font-weight: bold;", "");
            console.log(`%c RENDER %c Iniciando pintura de ${listaAulas.length} aulas.`, "background: #1748AF; color: white; font-weight: bold;", "");

            listaAulas.forEach((aula, index) => {
                const instituicao = aula.instituicao?.texto;
                const dia = aula.diaSemana?.valor;
                const posicao = aula.posicaoAula?.valor;
                const materia = aula.materia?.texto;

                console.log("================================================================");
                console.log("O dia ------> " + dia);
                console.log("A posição --> " + posicao);
                console.log("A matéria --> " + materia);
                console.log("================================================================");



                console.group(`Aula #${index + 1}: ${materia}`);
                
                // 2. Localiza a célula exata pelo dia e posição
                //const seletor = `.cell-value[data-dia="${dia}"][data-posicao="${posicao}"]`;
                const seletor = `.cell-value[data-coluna="${dia}"][data-linha="${posicao}"]`;
                const celula = this.shadowRoot.querySelector(seletor);

                console.log(`%c BUSCA %c Seletor: ${seletor}`, "color: #7f8c8d;", "");

                if (celula) {
                    console.log(`%c SUCESSO %c Célula encontrada. Aplicando HTML...`, "color: #27ae60; font-weight: bold;", "");
                    
                    // 3. Criamos o elemento visual da aula
                    celula.innerHTML = `
                        
                        <div class="aula-preenchida" ">
                            <div class="instituicao-nome">${instituicao}</div>
                            <div class="materia-nome">${materia}</div>
                            <div class="turma-nome">${aula.turma.texto}</div>
                        </div>
                    `;
                    celula.classList.add('ocupada');
                } else {
                    console.warn(`%c AVISO %c Célula NÃO encontrada no Shadow DOM para Dia: ${dia}, Posição: ${posicao}`, 
                        "background: #f1c40f; color: black; font-weight: bold;", "");
                    console.log("%c DICA %c Verifique se a classe Table_Standard está gerando os atributos data-dia e data-posicao corretamente.", "color: #e67e22; font-style: italic;", "");
                }
                
                console.groupEnd();
            });

            console.groupEnd();
        } catch (erro) {
            console.error("%c ERRO CRÍTICO %c Falha ao processar dados para renderização:", 
                "background: #c0392b; color: white; font-weight: bold;", "", erro);
        }

       
    }





}

customElements.define('grade-horario-professor', Grade_Horario_Professor);