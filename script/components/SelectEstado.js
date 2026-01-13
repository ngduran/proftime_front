class SelectEstado extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Isolamento total
    }

    connectedCallback() {
        this.render();
        this.buscarEstados();
    }

    // O CSS e o HTML vivem aqui dentro
    render() {
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; margin-bottom: 15px; font-family: sans-serif; }
            .input-group { display: flex; align-items: center; gap: 10px; }
            select { 
                padding: 8px; border: 1px solid #ccc; border-radius: 4px; flex-grow: 1; 
            }
            .info-question { color: #007bff; cursor: help; }
            .edit-button { 
                background: none; border: none; cursor: pointer; color: #555; 
            }
            /* Importando FontAwesome para dentro do Shadow DOM */
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
        </style>

        <label for="estado"><slot>Estado (UF)</slot></label>
        <div class="input-group">
            <select id="estado">
                <option value="">Selecione o estado</option>
            </select>
            <i class="fa-solid fa-circle-question info-question" title="Em qual estado fica?"></i>
            <button type="button" class="edit-button">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
        </div>
        `;
    }

    async buscarEstados() {
        const select = this.shadowRoot.getElementById('estado');
       // Escuta a mudança no select
        select.addEventListener('change', (e) => {
            const idEstado = e.target.value;
            
            // Criamos o "Grito" (Evento Customizado)
            const eventoEstadoAlterado = new CustomEvent('estado-selecionado', {
                detail: { id: idEstado }, // Passamos o ID (ou UUID) aqui
                bubbles: true,           // Permite que o evento suba na árvore do HTML
                composed: true           // PERMITE QUE O EVENTO SAIA DO SHADOW DOM
            });

            // Dispara o evento
            this.dispatchEvent(eventoEstadoAlterado);
        });
    }
}

// Definindo a nova tag HTML
customElements.define('select-estado', SelectEstado);



//   async buscarEstados() {
//         const select = this.shadowRoot.getElementById('estado');
//         try {
//             // Aqui você usaria sua lógica de fetch/executarOperacao
//             const response = await fetch('/api/estados');
//             const dados = await response.json();
            
//             // Supondo que você use MapStruct no back, os dados já vêm limpos
//             dados.data.forEach(est => {
//                 const opt = document.createElement('option');
//                 opt.value = est.id_estado; // Ou UUID conforme sua regra
//                 opt.textContent = est.nome;
//                 select.appendChild(opt);
//             });
//         } catch (e) {
//             console.error("Erro ao carregar estados", e);
//         }
//     }