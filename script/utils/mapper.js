/**
 * Une objetos de dados e injeta uma lista sob uma chave específica.
 * @param {Object} dadosCabecalho - Objeto com {instituicao, turno, etc}
 * @param {Array} lista - O array de itens da grade
 * @param {string} nomeChaveLista - O nome que o Java espera para a lista (ex: 'itensGrade')
 */
export function unirDados(dadosCabecalho, lista, nomeChaveLista) {
    return {
        ...dadosCabecalho, // Espalha as propriedades que já existem (instituicao, turno, etc)
        ...lista // Cria a chave dinamicamente
    };
}