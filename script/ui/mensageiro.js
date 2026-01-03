// Substituindo o alert por algo visual
export const Mensagem = {
    sucesso(texto) {
        Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: texto,
            //timer: 3000
            confirmButtonColor: '#28a745'
        });
    },

    erro(status, texto) {
        Swal.fire({
            icon: 'error',
            title: `Erro ${status}`,
            text: texto,
            //confirmButtonColor: '#d33'
            confirmButtonColor: '#dc3545'
        });
    },

    aviso(texto) {
        Swal.fire({
            icon: 'warning',
            title: 'Atenção',
            text: texto
        });
    }
};