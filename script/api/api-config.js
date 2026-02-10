import { ENV } from '../../env-config.js'

// Definimos as duas bases separadamente
const PROF_URL = ENV.PROFESSOR_API;
const AUCT_URL = ENV.AUCTORITAS_API;

const R_USUARIO         = "/usuario";
const R_CONTA           = "/conta";
const R_PROFESSOR       = "/professor";
const R_LOGIN           = "/auth";
const R_GRADE_PROFESSOR = "/grades-professores";
const R_INSTITUICAO     = "/instituicoes";
const R_ESTADO          = "/estados";
const R_MUNICIPIO       = "/municipios";
const R_ADMINISTRACAO   = "/administracoes";

export const API_MAP = {
    
    // Mantemos as URLs base caso precise em algum lugar
    BASE_URL_PROFESSOR: PROF_URL,
    BASE_URL_AUCTORITAS: AUCT_URL,

    USUARIO: {
        CREATE: { path: `${AUCT_URL}${R_USUARIO}/create`, method: 'POST' },
        READ:   { path: `${AUCT_URL}${R_USUARIO}/read`,   method: 'POST' },
        UPDATE: { path: `${AUCT_URL}${R_USUARIO}/update`, method: 'PUT'  },
        DELETE: { path: `${AUCT_URL}${R_USUARIO}/delete`, method: 'DELETE'}
    },

    AUTH: {
        LOGIN: { path: `${AUCT_URL}${R_LOGIN}/login`, method: 'POST' }
    },

    CONTA: {
        CREATE:  { path: `${AUCT_URL}${R_CONTA}/create`, method: 'POST' },
    },

    PROFESSOR_GRADE: {
        CREATE_ITEM: { path: `${PROF_URL}${R_GRADE_PROFESSOR}/create-item`, method: 'POST' }
    },

    INSTITUICAO: {
        CREATE:  { path: `${PROF_URL}${R_INSTITUICAO}/create`,   method: 'POST' },
        FINDALL: { path: `${PROF_URL}${R_INSTITUICAO}/find-all`, method: 'GET'  },
    },

    ESTADO: {
        FINDALL:  { path: `${PROF_URL}${R_ESTADO}/find-all`, method: 'GET' },
    },
    
    MUNICIPIO: {
        POR_ESTADO:  { path: `${PROF_URL}${R_MUNICIPIO}/listar-por-estado`, method: 'GET' },
    },
    
    ADMINISTRACAO: {
        FINDALL:  { path: `${PROF_URL}${R_ADMINISTRACAO}/find-all`, method: 'GET' },
    },
    

};