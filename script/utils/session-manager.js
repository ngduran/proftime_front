/**
 * Gerenciador dinâmico de persistência em sessão.
 * Centraliza todas as operações de leitura e escrita no navegador.
 */
export const SessionManager = {

    // CREATE / UPDATE (Salvar ou Alterar)
    salvar(chave, valor) {
        if (!valor) {
            console.warn(`[Session] Tentativa de salvar valor vazio para a chave: ${chave}`);
            return;
        }
        sessionStorage.setItem(chave, valor);
        console.log(`[Session] Salvo/Alterado: ${chave} = ${valor}`);
    },

    // READ (Consultar)
    consultar(chave) {
        const valor = sessionStorage.getItem(chave);
        if (!valor) {
            console.info(`[Session] Nenhuma informação encontrada para a chave: ${chave}`);
        }
        return valor;
    },

    // DELETE (Excluir uma chave específica)
    excluir(chave) {
        if (sessionStorage.getItem(chave)) {
            sessionStorage.removeItem(chave);
            console.log(`[Session] Item removido: ${chave}`);
        }
    },

    // DELETE ALL (Excluir todos os dados da sessão)
    excluirTodos() {
        sessionStorage.clear();
        console.warn("[Session] Toda a sessão foi limpa (Logout/Reset).");
    }
};