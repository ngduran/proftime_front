import { Base_Time } from '../base/Base_Time.js';

class Hora_Inicio_Field extends Base_Time {
    constructor() {
        super(); 
    }
    
    connectedCallback() {
        super.render();        
    }
    
}

customElements.define('hora-inicio-field', Hora_Inicio_Field);