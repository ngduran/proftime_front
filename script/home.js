const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menu-toggle');
const overlay = document.getElementById('overlay');
const mainFrame = document.getElementById('main-frame');

// Abre/Fecha menu mobile
function toggleMenu() {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Navegação entre iframes
function navegar(url, elemento) {
    // Troca o conteúdo
    mainFrame.src = url;

    // Atualiza estado visual do menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    elemento.parentElement.classList.add('active');

    // Se estiver no mobile, fecha o menu após clicar
    if (window.innerWidth <= 768) {
        toggleMenu();
    }
}