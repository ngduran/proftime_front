const BASE_URL = "http://127.0.0.1:8080";
//const BASE_URL = "https://959fb2ef6375.ngrok-free.app";

const R_USUARIO         = "/usuario";
const R_CONTA           = "/conta";
const R_PROFESSOR       = "/professor";
const R_LOGIN           = "/auth"
const R_GRADE_PROFESSOR = "/grades-professores";
const R_INSTITUICAO     = "/instituicoes"

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

    // CONTA: {
    //     CREATE: { path: `${BASE_URL}${R_CONTA}/create`, method: 'POST' },
    //     BUSCAR: { path: `${BASE_URL}${R_CONTA}/read`,   method: 'POST' }
    // },

    PROFESSOR_GRADE: {
        CREATE_ITEM: { path: `${BASE_URL}${R_GRADE_PROFESSOR}/create-item`, method: 'POST' }
    },

    INSTITUICAO: {
        CREATE: { path: `${BASE_URL}${R_INSTITUICAO}/create`, method: 'POST' },
    }


};