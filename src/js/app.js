const mobileMenuBtn = document.querySelector('#mobile-menu');
const sidebar = document.querySelector('.sidebar');
const cerrarMenuMobile = document.querySelector('#cerrar-menu');

if(mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.classList.add('mostrar');
    });
    cerrarMenuMobile.addEventListener('click', function() {
        sidebar.classList.remove('mostrar');
    });
}