/**
 * StorageService - Classe Genérica para persistência em LocalStorage
 */
export class Storage_Service {
    /**
     * @param {string} storageKey - A chave única no LocalStorage (ex: 'grade_prof')
     */
    constructor(storageKey) {
        this._DB_KEY = storageKey;
    }
v
    /**
     * Inicializa a estrutura baseada em uma configuração externa.
     */
    inicializar(config) {
        if (!localStorage.getItem(this._DB_KEY)) {
            const estrutura = {
                metadata: {
                    ...config,
                    criadoEm: new Date().toISOString(),
                    // Mantém a conformidade com o requisito de idioma [cite: 2026-01-27]
                    //idioma: sessionStorage.getItem('official_language') || 'pr' 
                },
                itens: []
            };
            localStorage.setItem(this._DB_KEY, JSON.stringify(estrutura));
            this._log("Estrutura Genérica Inicializada", "info");
        }
    }

    obterDados() {
        const raw = localStorage.getItem(this._DB_KEY);
        return raw ? JSON.parse(raw) : { metadata: {}, itens: [] };
    }

    _log(msg, tipo) {
        const cores = { info: "color: #3498db;", erro: "color: #e74c3c;" };
        console.log(`%c[STORAGE: ${this._DB_KEY}] %c${msg}`, "font-weight: bold;", cores[tipo] || "");
    }


    /**
     * Salva os dados verificando se a posição já está ocupada.
     */
    salvarAula(novaAula) {
        // 1. Obtém a lista atual (sempre garantindo que seja um Array plano)
        const dadosBrutos = localStorage.getItem(this._DB_KEY);

        console.log("==================================================");
        console.log("Imprimindo os  brutos  capturados do local storage")
        console.log("==================================================");
        console.log(dadosBrutos);

        let itens = [];
        
        try {
            const parseado = JSON.parse(dadosBrutos);
            // Se houver a estrutura antiga {itens: []}, extraímos apenas o array
            itens = Array.isArray(parseado) ? parseado : (parseado.itens || []);
        } catch (e) {
            itens = [];
        }

        // 2. Regra de Negócio: Verifica sobreposição (Chave Composta: Dia + Posição)
        // const conflito = itens.find(a => 
        //     a.diaSemana.valor === novaAula.diaSemana.valor && 
        //     a.posicaoAula.valor === novaAula.posicaoAula.valor
        // );

        // --- ADEQUAÇÃO PARA COORDENADAS ---
        // Extraímos os valores que representam a localização física na tabela
        const colNova = String(novaAula.diaSemana?.valor); // Representa a Coluna
        const linNova = String(novaAula.posicaoAula?.valor); // Representa a Linha

        // 2. Regra de Negócio: Verifica se já existe algo nessa Linha e Coluna
        const conflito = itens.find(itemExistente => 
            String(itemExistente.diaSemana?.valor) === colNova && 
            String(itemExistente.posicaoAula?.valor) === linNova
        );



        if (conflito) {
            return { sucesso: false, mensagem: "Este horário já está preenchido!" };
        }

        // 3. Adiciona e Salva
        itens.push(novaAula);
        localStorage.setItem(this._DB_KEY, JSON.stringify(itens));

        return { sucesso: true, itens: itens };
    }









}