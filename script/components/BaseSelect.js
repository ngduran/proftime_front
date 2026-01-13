export class BaseSelect extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        const url = this.getAttribute('api-url');
        if (url) this.carregarDados(url);
    }

    // CSS ÚNICO: Se mudar aqui, muda em TODOS os selects do sistema
    get styles() {
        return `
            :host { display: block; margin-bottom: 1rem; }
            .label { font-weight: bold; margin-bottom: 5px; display: block; }
            .input-group { display: flex; align-items: center; border: 1px solid #ccc; border-radius: 4px; padding: 5px; }
            select { border: none; flex-grow: 1; outline: none; background: transparent; }
            .icon { margin: 0 10px; color: #666; }
        `;
    }

    render() {
        const label = this.getAttribute('label') || 'Selecione';
        const icon = this.getAttribute('icon') || 'fa-circle-question';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            <style>${this.styles}</style>
            
            <label class="label">${label}</label>
            <div class="input-group">
                <select id="main-select">
                    <option value="">Selecione...</option>
                </select>
                <i class="fa-solid ${icon} icon"></i>
            </div>
        `;

        this.shadowRoot.getElementById('main-select').addEventListener('change', (e) => {
            this.dispatchEvent(new CustomEvent('change-value', {
                detail: { value: e.target.value },
                composed: true
            }));
        });
    }

    async carregarDados(url) {
        const select = this.shadowRoot.getElementById('main-select');
        try {
            const response = await fetch(url);
            const json = await response.json();
            // Lógica genérica: assume que os dados vêm em uma lista 'data'
            json.data.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.uuid || item.id; 
                opt.textContent = item.nome || item.descricao;
                select.appendChild(opt);
            });
        } catch (err) { console.error("Erro na BaseSelect:", err); }
    }
}
customElements.define('base-select', BaseSelect);