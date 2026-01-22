export const field_style = new CSSStyleSheet();

// Existem classes compartilhas entre input e select

field_style.replaceSync(`

        /* Utilizado para manter as caixas zeradas e aplicar as medidas do container pai*/
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box; /* Crucial: padding não aumenta o tamanho da caixa */
        }

        .field-label {
            width: 100%;       /* Ocupa toda a largura do .field-group */
            border: none;      /* Remove a borda padrão do navegador */
            outline: none;     /* Remove a linha de destaque ao clicar */
            padding: 0 0px;   /* Adiciona um respiro interno para o texto não colar na borda */
            height: 40px;
            flex: 1 1 auto;
            font-size: 1.0rem;

            /* gap: 4px;
            margin-top: 15px;
            margin-bottom: 5px; */
        }

        .field-input {
            width: 100%;       /* Ocupa toda a largura do .field-group */
            border: none;      /* Remove a borda padrão do navegador */
            outline: none;     /* Remove a linha de destaque ao clicar */
            padding: 0 10px;   /* Adiciona um respiro interno para o texto não colar na borda */
            //background: white; /* Cor de fundo para o campo */
            height: 40px;
            flex: 1 1 auto;
            font-size: 1.0rem;

            border: 1px solid var(--color-accent);
            border-radius: 8px;
            color: var(--color-text-dark);
            background-color: var(--color-input-bg);
            transition: border-color 0.2s, box-shadow 0.2s;
            appearance: none !important;
            -webkit-appearance: none !important;
            cursor: pointer; 
        }

        .field-time {
            width: 100%;       /* Ocupa toda a largura do .field-group */
            border: none;      /* Remove a borda padrão do navegador */
            outline: none;     /* Remove a linha de destaque ao clicar */
            padding: 0 10px;   /* Adiciona um respiro interno para o texto não colar na borda */
            background: white; /* Cor de fundo para o campo */
            height: 40px;
            flex: 1 1 auto;
            font-size: 1.0rem;

            border: 1px solid var(--color-accent);
            border-radius: 8px;
            color: var(--color-text-dark);
            background-color: var(--color-input-bg);
            transition: border-color 0.2s, box-shadow 0.2s;
            appearance: none !important;
            -webkit-appearance: none !important;
            cursor: pointer; 
        }
    
        .field-select {
            width: 100%;       /* Ocupa toda a largura do .field-group */
            border: none;      /* Remove a borda padrão do navegador */
            outline: none;     /* Remove a linha de destaque ao clicar */
            padding: 0 10px;   /* Adiciona um respiro interno para o texto não colar na borda */
            background: white; /* Cor de fundo para o campo */
            height: 40px;
            flex: 1 1 auto;
            font-size: 1.0rem;

            border: 1px solid var(--color-accent);
            border-radius: 8px;
            color: var(--color-text-dark);
            background-color: var(--color-input-bg);
            transition: border-color 0.2s, box-shadow 0.2s;
            appearance: none !important;
            -webkit-appearance: none !important;
            cursor: pointer; 
        }

        input[type="time"]::-webkit-calendar-picker-indicator {
            margin-right: 28px; /* Desloca o ícone do relógio para longe da borda direita */
            cursor: pointer;
        }

         /* ===== 2 =====*/
        input:focus {
            border-color: var(--color-accent);
            box-shadow: 0 0 0 2px rgba(175, 126, 23, 0.2);
            outline: none;
        }

        /* ===== 4 =====*/
        input.invalid, select.invalid {
            border: 1px solid #ff4d4d !important;
            background-color: #fffafa !important;
        }

        input.valid, select.valid {
            border: 1px solid #28a745 !important; 
            background-color: #f8fff9 !important;
        }

        .error-message {
            position: absolute;
            top: 100%;
            margin-top: 2px;   
            left: 0px;    
            font-size: 12px;
            color: #ff4d4d;
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