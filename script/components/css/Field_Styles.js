export const fieldCss = new CSSStyleSheet();

fieldCss.replaceSync(`

    /* ===== 1 =====*/
    .input-group {
        position: relative; 
        width: 100%;
        display: flex;
        align-items: center;
    }

    select {
        width: 100%;
        padding: 12px 45px 12px 15px; /* 45px à direita reserva espaço para o botão de 32px */
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
        right: 5px;
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
    .edit-button:hover {    
        background-color: var(--color-primary);
        color: var(--color-accent);
    }

    /* ===== 7 =====*/
    .edit-button:active {
        transform: translateY(-50%) scale(0.95);
    }
    
    /* ===== 8 =====*/
    .edit-button svg {
        width: 16px;
        height: 16px;
    } 

    /* ===== 9 =====*/
    label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--color-text-dark);       
    }

    .label-container {
        position: relative;    /* CRUCIAL: O tooltip vai se basear aqui */ 
        display: flex;
        align-items: center; /* Alinha o texto e o ícone pela base da escrita */
        gap: 4px;              /* Espaçamento horizontal levemente aumentado para melhor respiro */
        margin-top: 15px;      /* Espaço superior do bloco */
        margin-bottom: 5px;    /* Espaço entre o rótulo e o campo de input/select */
    }
  
    .info-question {        
        color: var(--color-primary);
        position: relative;
    }

    .edit-button svg {
        width: 16px;
        height: 16px;
    }
        
`);

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

/* @description: Feedback visual de interatividade para o estado de 'hover'.
   @features 6:
     - Inversão de Cores: Alterna as variáveis de cor de fundo e do ícone para destacar a interatividade.
     - UX/Affordance: Confirma visualmente para o usuário que o elemento é clicável e está ativo.
     - Consistência: Utiliza o Design System (variáveis CSS) para manter a paleta de cores do projeto.
*/

/* @description: Feedback tátil (Haptic Feedback) para o estado de clique (active).
   @features 7:
     - Preservação do Layout: Mantém o translateY(-50%) para não perder o alinhamento vertical.
     - Efeito de Compressão: Utiliza scale(0.95) para simular que o botão foi fisicamente pressionado.
     - UX/Affordance: Oferece uma resposta imediata ao usuário de que a ação foi registrada.
*/

/* @description: Padronização dimensional do ícone interno (SVG).
   @features 8:
     - Escalonamento Preciso: Define um tamanho fixo de 16x16px para o ícone, garantindo que ele não transborde o botão.
     - Proporcionalidade: Mantém a relação de aspecto 1:1, essencial para a integridade visual de ícones vetoriais.
     - Alinhamento: Facilita a centralização absoluta dentro do .edit-button (que possui 32px), deixando uma margem equilibrada.
*/

/* @description: Refatoração do cabeçalho do campo (Label + Ícone de Ajuda).
   @features 9: 
     - Migração de margens estruturais para o container pai.
     - Alinhamento via 'baseline' para sincronia perfeita entre texto e ícone.
     - Limpeza de propriedades redundantes e correções manuais de posicionamento.
*/