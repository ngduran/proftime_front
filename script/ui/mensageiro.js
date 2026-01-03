// Substituindo o alert por algo visual
export const Mensagem = {
    async sucesso(texto) {        

        if (typeof Swal !== 'undefined') {
            return await window.Swal.fire({ 
                            icon: 'success', 
                            title: 'Sucesso', 
                            text: texto, 
                            confirmButtonColor: '#28a745' 
                        });
        } else {
            console.warn("SweetAlert não carregado. Usando alert comum.");
            alert(texto);
            return Promise.resolve();
        }      
    },

    async erro(status, texto) {
        if (typeof Swal !== 'undefined') {
            return await window.Swal.fire({
                            icon: 'error',
                            title: `Erro ${status}`,
                            text: texto,                          
                            confirmButtonColor: '#dc3545'
                        });        
        } else {
            console.warn("SweetAlert não carregado. Usando alert comum.");
            alert(texto);
            return Promise.resolve();
        }  
    },

    async aviso(texto) {
        if (typeof Swal !== 'undefined') {
            return await window.Swal.fire({
                            icon: 'warning',
                            title: 'Atenção',
                            text: texto,
                            confirmButtonColor: '#dfeb43ff'
                        });        
        } else {
            console.warn("SweetAlert não carregado. Usando alert comum.");
            alert(texto);
            return Promise.resolve();
        }  
    }
};