document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('#horario-aulas');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Vetores para turmas, disciplinas e conteúdos
    const turmas = ['1º Ano', '2º Ano', '3º Ano', 'Hora Atividade'];
    const disciplinas = ['Banco de Dados', 'Programação Back-End', 'Desenvolvimento de Sistemas'];
    const conteudos = [
        ['Chave Primária', 'Protocolo HTTP', 'Spring Boot'],
        ['Java Básico', 'Banco de Dados Relacional', 'REST APIs'],
        ['Arquitetura de Software', 'Microservices', 'Frameworks Spring']
    ];

    // Número da semana
    const semanaRow = document.createElement('tr');
    const semanaCell = document.createElement('th');
    semanaCell.colSpan = 9; // 9 colunas (Aula, Horário, Segunda a Domingo)
    semanaCell.textContent = 'Semana 1'; // Ajuste conforme o número da semana
    semanaRow.appendChild(semanaCell);
    thead.insertBefore(semanaRow, thead.firstChild);

    // Horários das aulas
    const horarios = [
        '07:10 - 08:00',
        '08:00 - 08:50',
        '08:50 - 09:40',
        '09:55 - 10:45',
        '10:45 - 11:35',
        '11:35 - 12:25'
    ];

    // Função para adicionar informações no horário de aula
    function preencherConteudoNaCelula(linha, dia, aula, disciplinaIndex, conteudoIndex) {
        const cell = linha.querySelectorAll('td')[dia + 2]; // Ajusta para pegar a célula do dia correto
        const turma = turmas[aula]; // Pega a turma (1º Ano, 2º Ano, etc.)
        const disciplina = disciplinas[disciplinaIndex]; // Pega a disciplina
        const conteudo = conteudos[disciplinaIndex][conteudoIndex]; // Pega o conteúdo da disciplina

        // Preenche a célula com as informações
        cell.textContent = `${turma}\n${disciplina}\n${conteudo}`;

        // Adiciona um separador (como uma linha) entre as informações
        cell.innerHTML = `${turma}<hr>${disciplina}<hr>${conteudo}`;
    }

    // Preenche a tabela com os horários
    horarios.forEach((horario, index) => {
        const row = document.createElement('tr');

        // Coluna Aula
        const aulaCell = document.createElement('td');
        aulaCell.textContent = `${index + 1}ª`; // Número da aula
        row.appendChild(aulaCell);

        // Coluna Horário
        const horarioCell = document.createElement('td');
        horarioCell.textContent = horario;
        row.appendChild(horarioCell);

        // Colunas de Segunda a Domingo
        for (let i = 0; i < 7; i++) {
            const cell = document.createElement('td');
            cell.textContent = ''; // Preenchido posteriormente
            row.appendChild(cell);
        }

        tbody.appendChild(row);

        // Preencher com exemplos de informações (exemplo: 1º Ano, Banco de Dados, Chave Primária)
        if (index === 0) {
            preencherConteudoNaCelula(row, 0, 0, 0, 0); // Segunda, Aula 1, Banco de Dados, Chave Primária
            preencherConteudoNaCelula(row, 1, 1, 1, 0); // Terça, Aula 2, Programação Back-End, Java Básico
        }
        if (index === 1) {
            preencherConteudoNaCelula(row, 2, 0, 2, 1); // Quarta, Aula 1, Desenvolvimento de Sistemas, REST APIs
        }
    });
});
