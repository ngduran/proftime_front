import { ENV } from '../../env-config.js'

const BASE_URL = ENV.BASE_URL;
//const BASE_URL = "https://aad6a90435c4.ngrok-free.app";

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
    BASE_URL: BASE_URL,

    USUARIO: {
        CREATE: { path: `${BASE_URL}${R_USUARIO}/create`, method: 'POST' },
        READ:   { path: `${BASE_URL}${R_USUARIO}/read`,   method: 'POST' },
        UPDATE: { path: `${BASE_URL}${R_USUARIO}/update`, method: 'PUT'  },
        DELETE: { path: `${BASE_URL}${R_USUARIO}/delete`, method: 'DELETE'}
    },

    AUTH: {
        LOGIN: { path: `${BASE_URL}${R_LOGIN}/login`, method: 'POST' }
    },

    PROFESSOR_GRADE: {
        CREATE_ITEM: { path: `${BASE_URL}${R_GRADE_PROFESSOR}/create-item`, method: 'POST' }
    },

    INSTITUICAO: {
        CREATE:  { path: `${BASE_URL}${R_INSTITUICAO}/create`,   method: 'POST' },
        FINDALL: { path: `${BASE_URL}${R_INSTITUICAO}/find-all`, method: 'GET'  },
    },

    ESTADO: {
        FINDALL:  { path: `${BASE_URL}${R_ESTADO}/find-all`, method: 'GET' },
    },
    
    MUNICIPIO: {
        POR_ESTADO:  { path: `${BASE_URL}${R_MUNICIPIO}/listar-por-estado`, method: 'GET' },
    },
    
    ADMINISTRACAO: {
        FINDALL:  { path: `${BASE_URL}${R_ADMINISTRACAO}/find-all`, method: 'GET' },
    },

    CONTA: {
        CREATE:  { path: `${BASE_URL}${R_CONTA}/create`, method: 'POST' },
    },


    

};