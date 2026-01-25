import { Base_Field } from '../../base/Base_Field.js';

class Nome_Field extends Base_Field {

   // 1. Atributos Estáticos
    static i18n = {
        pt: {
            label                  = "Telefone" 
                                            
        },
        es: {
            label:       "Correo electrónico",
            placeholder: "tu_mejor_correo@mail.com",
            tooltip:     "Correo electrónico utilizado para acceder a la aplicación",
            erro:        "Por favor, introduce un correo electrónico válido."
        }
    };

}

// 6. Definição do Web Component
customElements.define('nome-field', Nome_Field);