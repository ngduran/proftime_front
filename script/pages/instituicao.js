import { inicializarTooltips } from "../ui/dom-utils.js";
import { bloquearButton, configurarAbrirRelogioAoClicar, desbloquearButton, navegarPara } from "../utils/form-helper.js";
import { validarNome, validarComboBox, validarCampoTime } from "../utils/validador.js";

inicializarTooltips();

configurarAbrirRelogioAoClicar('horarioInicial');
configurarAbrirRelogioAoClicar('horaAula');

async function salvar() {

    if ( !validarFormulario( 'instituicaoForm'                             ) ) { return; }
    if ( !validarNome()                                                      ) { return; }
    if ( !validarComboBox  ( 'administracao',  'Selecione a administracao' ) ) { return; }
    if ( !validarComboBox  ( 'estado',         'Selecione o estado'        ) ) { return; }
    if ( !validarComboBox  ( 'cidade',         'Selecione a cidade'        ) ) { return; }
    if ( !validarCampoTime ( 'horarioInicial', 'Selecione uma hora válida' ) ) { return; }
    if ( !validarCampoTime ( 'horaAula',       'Selecione uma hora válida' ) ) { return; }
    

    try {

        bloquearButton('cadastrarBtn', 'Salvando...');

    } catch (error) {

    } finally {
        desbloquearButton('cadastrarBtn', 'Salvar');
    }


}

function voltarAoInicio() {
    navegarPara('home');
}

// Validação em tempo real ao sair do campo (Blur)
document.getElementById('nome'           ).addEventListener('blur',         validarNome                                                       );
document.getElementById('administracao'  ).addEventListener('blur', () => { validarComboBox   ( 'administracao',  'Selecione a instituição'   ); } );
document.getElementById('estado'         ).addEventListener('blur', () => { validarComboBox   ( 'estado',         'Selecione o estado'        ); } );
document.getElementById('cidade'         ).addEventListener('blur', () => { validarComboBox   ( 'cidade',         'Selecione a cidade'        ); } );
document.getElementById('horarioInicial' ).addEventListener('blur', () => { validarCampoTime  ( 'horarioInicial', 'Selecione uma hora válida' ); } );
document.getElementById('horaAula'       ).addEventListener('blur', () => { validarCampoTime  ( 'horaAula',       'Selecione uma hora válida' ); } );

document.getElementById('cadastrarBtn'  ).addEventListener('click', salvar         );
document.getElementById('voltarBtn'     ).addEventListener('click', voltarAoInicio );