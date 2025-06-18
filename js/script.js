document.addEventListener('DOMContentLoaded', function() {

    // Fonction pour charger le contenu HTML dans un élément spécifié
    function loadHTML(elementId, filePath) {
        fetch(filePath)
            .then(response => {
                // Vérifie si la requête a réussi
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status} - Fichier: ${filePath}`);
                }
                return response.text(); // Récupère le contenu HTML sous forme de texte
            })
            .then(html => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = html; // Insère le HTML dans l'élément cible

                    // Logique spécifique APRES le chargement de la navbar
                    if (elementId === 'navbar-placeholder') {
                        applyActiveClass();       // Applique la classe 'active' aux liens
                        setupSidebarToggle();     // <-- NOUVEAU : Initialise les écouteurs ici après chargement
                    }
                } else {
                    console.error(`Élément avec l'ID '${elementId}' non trouvé dans le DOM.`);
                }
            })
            .catch(error => console.error(`Erreur lors du chargement de ${filePath}:`, error));
    }

    // Détermine le chemin correct vers le dossier 'includes'
    const currentPathname = window.location.pathname;
    // <<< À MODIFIER SI LE NOM DE VOTRE DÉPÔT EST DIFFÉRENT SUR GITHUB PAGES
    const repoBase = '/TRC25-Documentation-Mecanique'; 

    let pathToIncludes = '';
    if (currentPathname.endsWith('/index.html') || currentPathname === '/' || currentPathname.endsWith('/telechargements.html')) {
        pathToIncludes = './includes/';
    } else if (currentPathname.includes('/pieces/') || currentPathname.includes('/assemblage/')) {
        pathToIncludes = '../includes/';
    } else {
        pathToIncludes = './includes/'; // Fallback
    }

    // Charge la navigation et le pied de page
    loadHTML('navbar-placeholder', pathToIncludes + 'navbar.html');
    loadHTML('footer-placeholder', pathToIncludes + 'footer.html');

    // --- Fonctions existantes et mises à jour pour la sidebar et les liens actifs ---

    // Gère la classe 'active' pour le lien de navigation courant
    function applyActiveClass() {
        // Nous devons re-sélectionner les liens car ils ont été injectés dynamiquement
        const navLinks = document.querySelectorAll('.sidebar a');
        
        navLinks.forEach(link => {
            let linkPathname = new URL(link.href).pathname;

            let normalizedCurrent = currentPathname.startsWith(repoBase) ? currentPathname.substring(repoBase.length) : currentPathname;
            let normalizedLink = linkPathname.startsWith(repoBase) ? linkPathname.substring(repoBase.length) : linkPathname;

            normalizedCurrent = normalizedCurrent.endsWith('/') && normalizedCurrent !== '/' ? normalizedCurrent.slice(0, -1) : normalizedCurrent;
            normalizedLink = normalizedLink.endsWith('/') && normalizedLink !== '/' ? normalizedLink.slice(0, -1) : normalizedLink;

            if ((normalizedCurrent === '' || normalizedCurrent === '/' || normalizedCurrent === '/index.html') &&
                (normalizedLink === '' || normalizedLink === '/' || normalizedLink === '/index.html')) {
                link.classList.add('active');
            }
            else if (normalizedLink === normalizedCurrent) {
                link.classList.add('active');
            }
            else if (link.getAttribute('href').includes('.html')) {
                const currentFile = normalizedCurrent.substring(normalizedCurrent.lastIndexOf('/') + 1);
                if (link.getAttribute('href') === currentFile) {
                    link.classList.add('active');
                }
            }
        });
    }

    // Configure le bouton de basculement de la sidebar et la fermeture au clic
    function setupSidebarToggle() {
        // Nous devons re-sélectionner le bouton et la sidebar car ils sont injectés
        const navToggle = document.querySelector('.nav-toggle');
        const sidebar = document.querySelector('.sidebar');

        if (navToggle && sidebar) {
            navToggle.addEventListener('click', function() {
                sidebar.classList.toggle('open');
            });

            sidebar.addEventListener('click', function(event) {
                if (event.target.tagName === 'A' && window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }
});