document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    if (navToggle && sidebar && content) {
        navToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            // Optionnel: déplacer le contenu pour ne pas être sous la sidebar
            // content.classList.toggle('sidebar-open');
        });
    }

    // Gérer la classe 'active' pour le lien de navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar a');

    navLinks.forEach(link => {
        // Obtenez le chemin relatif du lien
        const linkPath = new URL(link.href).pathname;

        // Si le chemin actuel correspond au chemin du lien, ajoutez la classe 'active'
        // Ou si c'est la page d'accueil et que le lien est 'index.html'
        if (currentPath === linkPath ||
           (currentPath === '/' && linkPath.endsWith('index.html')) ||
           (currentPath.endsWith('/') && linkPath.endsWith('index.html'))) {
            link.classList.add('active');
        }
    });

    // Optionnel: Fermer la sidebar quand un lien est cliqué sur mobile
    sidebar.addEventListener('click', function(event) {
        if (event.target.tagName === 'A' && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            // content.classList.remove('sidebar-open');
        }
    });
});