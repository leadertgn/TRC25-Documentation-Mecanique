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

                    // Logique spécifique après le chargement de la navbar
                    if (elementId === 'navbar-placeholder') {
                        applyActiveClass();       // Applique la classe 'active' aux liens
                        setupSidebarToggle();     // Initialise les écouteurs pour le bouton burger et la fermeture au clic
                    }
                } else {
                    console.error(`Élément avec l'ID '${elementId}' non trouvé dans le DOM.`);
                }
            })
            .catch(error => console.error(`Erreur lors du chargement de ${filePath}:`, error));
    }

    // Détermine le chemin correct vers le dossier 'includes'
    // C'est crucial car les chemins relatifs changent selon le dossier de la page actuelle.
    const currentPathname = window.location.pathname; // Ex: /TRC25-Documentation-Mecanique/pieces/piece1.html ou /TRC25-Documentation-Mecanique/index.html
    const repoBase = '/TRC25-Documentation-Mecanique'; // <<< À MODIFIER SI LE NOM DE VOTRE DÉPÔT EST DIFFÉRENT SUR GITHUB PAGES

    let pathToIncludes = '';
    if (currentPathname.endsWith('/index.html') || currentPathname === '/' || currentPathname.endsWith('/telechargements.html')) {
        // La page est à la racine du dépôt ou dans son dossier principal
        pathToIncludes = './includes/';
    } else if (currentPathname.includes('/pieces/') || currentPathname.includes('/assemblage/')) {
        // La page est dans un sous-dossier comme 'pieces/' ou 'assemblage/'
        pathToIncludes = '../includes/';
    } else {
        // Fallback pour d'autres cas non prévus, si nécessaire
        pathToIncludes = './includes/'; // Par défaut, tente la racine
    }


    // Charge la navigation et le pied de page
    // Ces appels déclenchent les fonctions subséquentes après le chargement.
    loadHTML('navbar-placeholder', pathToIncludes + 'navbar.html');
    loadHTML('footer-placeholder', pathToIncludes + 'footer.html');


    // --- Fonctions existantes et mises à jour pour la sidebar et les liens actifs ---

    // Gère la classe 'active' pour le lien de navigation courant
    function applyActiveClass() {
        // Nous devons re-sélectionner les liens car ils ont été injectés dynamiquement
        const navLinks = document.querySelectorAll('.sidebar a');
        
        navLinks.forEach(link => {
            let linkPathname = new URL(link.href).pathname;

            // Normalisation pour comparer avec l'URL actuelle du navigateur
            let normalizedCurrent = currentPathname.startsWith(repoBase) ? currentPathname.substring(repoBase.length) : currentPathname;
            let normalizedLink = linkPathname.startsWith(repoBase) ? linkPathname.substring(repoBase.length) : linkPathname;

            // Supprime les slashes de fin (sauf pour la racine '/')
            normalizedCurrent = normalizedCurrent.endsWith('/') && normalizedCurrent !== '/' ? normalizedCurrent.slice(0, -1) : normalizedCurrent;
            normalizedLink = normalizedLink.endsWith('/') && normalizedLink !== '/' ? normalizedLink.slice(0, -1) : normalizedLink;

            // Cas de la page d'accueil (index.html)
            if ((normalizedCurrent === '' || normalizedCurrent === '/' || normalizedCurrent === '/index.html') &&
                (normalizedLink === '' || normalizedLink === '/' || normalizedLink === '/index.html')) {
                link.classList.add('active');
            }
            // Pour les autres pages, comparaison directe ou par "contient" pour les sous-dossiers
            else if (normalizedLink === normalizedCurrent) {
                link.classList.add('active');
            }
            // Gérer les liens relatifs dans navbar.html pour les pages dans des sous-dossiers (ex: pieces/piece1.html)
            // L'attribut href dans navbar.html est 'piece1.html', pas '/pieces/piece1.html'
            else if (link.getAttribute('href').includes('.html')) { // S'assurer que c'est un lien vers un fichier HTML
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
                // Ferme la sidebar si un lien est cliqué, mais seulement sur les petits écrans
                if (event.target.tagName === 'A' && window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    // Note : applyActiveClass() et setupSidebarToggle() sont appelées
    // après que la navbar a été chargée par loadHTML('navbar-placeholder', ...)
});