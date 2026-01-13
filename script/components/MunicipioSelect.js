import { BaseSelect } from './BaseSelect.js';

class MunicipioSelect extends BaseSelect {
    constructor() {
        super();
    }

    // Sobrescrevemos o carregamento para não carregar nada ao iniciar
    connectedCallback() {
        this.render();
        this.setAttribute('label', 'Município');
        this.setAttribute('icon', 'fa-city');
        
        // O select começa desabilitado até ter um estado
        this.shadowRoot.getElementById('main-select').disabled = true;
    }

    // Método exclusivo para buscar cidades baseado no Estado
    async carregarPorEstado(idEstado) {
        const select = this.shadowRoot.getElementById('main-select');
        select.disabled = false;
        
        // Limpa as opções anteriores (mantendo apenas a primeira)
        select.innerHTML = '<option value="">Carregando cidades...</option>';

        try {
            // Usando sua rota de API que agora aceita o ID do estado
            const response = await fetch(`/api/municipios?idEstado=${idEstado}`);
            const json = await response.json();

            select.innerHTML = '<option value="">Selecione o município</option>';
            
            json.data.forEach(muni => {
                const opt = document.createElement('option');
                opt.value = muni.uuid || muni.id;
                opt.textContent = muni.nome;
                select.appendChild(opt);
            });
        } catch (err) {
            select.innerHTML = '<option value="">Erro ao carregar</option>';
            console.error(err);
        }
    }
}

customElements.define('municipio-select', MunicipioSelect);