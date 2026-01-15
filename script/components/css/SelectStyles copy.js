export const selectCss = new CSSStyleSheet();


/* @description: Reset de UI nativa e padronização do box model para elementos select.
   @features 1: 
     - Desativa o estilo padrão do SO (appearance: none).
     - Layout 100% com zona de escape de 45px à direita para ícones de edição.
     - Estilização via CSS Variables e arredondamento de 8px.
     - Feedback de interatividade com cursor pointer e transições suaves de 0.2s.
*/

/* @description: Define o estado visual de foco (focus) do elemento select.
   @features 2:
     - Remove o contorno padrão do navegador (outline: none) para personalização.
     - Aplica realce na borda através de variável de cor de destaque.
     - Implementa um anel de foco externo (focus ring) via box-shadow translúcido.
     - Garante acessibilidade visual mantendo o feedback de navegação por teclado.
*/

/* @description: Customização do indicador visual e feedback de interatividade.
   @features 3:
     - Substitui a seta nativa por um ícone SVG customizado via background-image.
     - Posicionamento absoluto do ícone à direita (15px) e centralizado verticalmente.
     - Garante a affordance de clique em todo o campo através do cursor pointer.
     - Controle de repetição (no-repeat) para evitar artefatos visuais no background.
*/

/* @description: Gerenciamento visual dos estados de validação do formulário.
   @features 4:
     - Feedback Semântico: Aplica cores universais (vermelho/verde) para erro e sucesso.
     - Sobrescrita Segura: Utiliza !important para garantir a aplicação do estado sobre estilos base.
     - Contraste e Legibilidade: Ajusta levemente o background-color para reforçar a percepção do estado.
     - UX/Acessibilidade: Facilita a identificação imediata de campos que requerem correção ou estão validados.
*/

/* @description: Posicionamento e estilização do botão de ação flutuante (Edit Button).
   @features 5:
     - Posicionamento Absoluto: Fixado à direita (25px) e centralizado verticalmente via transform: translateY.
     - Design Circular: Dimensões fixas (32x32px) com border-radius de 50% para formato de botão de ação (FAB).
     - Flexbox Center: Garante o alinhamento perfeito do ícone interno em ambos os eixos.
     - Camada Visual: Utiliza cores do design system e transições suaves para feedback de interação.
*/

/* @description: Refatoração do cabeçalho do campo (Label + Ícone de Ajuda).
   @features 6: 
     - Migração de margens estruturais para o container pai.
     - Alinhamento via 'baseline' para sincronia perfeita entre texto e ícone.
     - Limpeza de propriedades redundantes e correções manuais de posicionamento.
*/

selectCss.replaceSync(`

    /* ===== 1 =====*/
    .input-group select {
        width: 100%;
        padding: 12px 45px 12px 15px; /* Padding extra à direita para o botão de editar */
        border: 1px solid var(--color-accent);
        border-radius: 8px;
        font-size: 1rem;
        color: var(--color-text-dark);
        background-color: var(--color-input-bg);
        transition: border-color 0.2s, box-shadow 0.2s;
        appearance: none !important;
        -webkit-appearance: none !important;        
        cursor: pointer;        
    }

    /* ===== 2 =====*/
    select:focus {
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px rgba(175, 126, 23, 0.2);
        outline: none;
    }
     
    /* ===== 3 =====*/
    /* Este talves possa retirar pois não vi nada de diferente */
    select {
        background-image: url("data:image/svg+xml,..."); 
        background-repeat: no-repeat;
        background-position: right 15px center;
    }

    /* ===== 4 =====*/
    select.invalid {
        border: 1px solid #ff4d4d !important;
        background-color: #fffafa !important;
    }

    select.valid {
        border: 1px solid #28a745 !important; 
        background-color: #f8fff9 !important;
    }

    /* ===== 5 =====*/
    .edit-button {
        position: absolute;
        right: 25px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background-color: var(--color-accent);
        color: var(--color-primary);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    /* ===== 6 =====*/
    label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-dark);       
    }

    .label-container {
        display: flex;
        align-items: baseline; /* Alinha o texto e o ícone pela base da escrita */
        gap: 4px;              /* Espaçamento horizontal levemente aumentado para melhor respiro */
        margin-top: 15px;      /* Espaço superior do bloco */
        margin-bottom: 5px;    /* Espaço entre o rótulo e o campo de input/select */
    }

    .info-question {
        color: var(--color-primary);
        font-size: 0.9rem;            
    }

`);