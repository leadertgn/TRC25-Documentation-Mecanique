document.addEventListener('DOMContentLoaded', function() {

    // IMPORTANT : Configurez le chemin de base de votre dépôt GitHub Pages
    // Si votre URL est par exemple : https://votre_utilisateur.github.io/mon-depot/
    // Alors repoBase doit être '/mon-depot'
    // Si vous êtes à la racine d'un domaine personnalisé, laissez ''
    const repoBase = '/TRC25-Documentation-Mecanique'; 
    
    // Fonction pour charger le contenu HTML dans un élément spécifié
    function loadHTML(elementId, filePath) {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erreur HTTP! Statut: ${response.status} - Fichier: ${filePath}`);
                }
                return response.text();
            })
            .then(html => {
                const targetElement = document.getElementById(elementId);
                if (targetElement) {
                    targetElement.innerHTML = html;
                    if (elementId === 'navbar-placeholder') {
                        applyActiveClass();
                        setupSidebarToggle();
                    }
                } else {
                    console.error(`Élément avec l'ID '${elementId}' non trouvé dans le DOM.`);
                }
            })
            .catch(error => console.error(`Erreur lors du chargement de ${filePath}:`, error));
    }

    // Le chemin vers le dossier 'includes' est relatif au fichier script.js
    // Si script.js est dans js/, et includes/ est à la racine, alors c'est '../includes/'
    const includesPath = '../includes/';

    // Charge la navigation et le pied de page
    loadHTML('navbar-placeholder', includesPath + 'navbar.html');
    loadHTML('footer-placeholder', includesPath + 'footer.html');

    // Gère la classe 'active' pour le lien de navigation courant
    function applyActiveClass() {
        const navLinks = document.querySelectorAll('.sidebar a');
        let currentPathname = window.location.pathname; // Ex: /TRC25-Documentation-Mecanique/pieces/piece3.html

        // Normalise le chemin actuel en retirant le repoBase s'il est présent
        // Cela rend la comparaison plus robuste pour les déploiements GitHub Pages
        if (currentPathname.startsWith(repoBase)) {
            currentPathname = currentPathname.substring(repoBase.length);
        }

        // S'assurer que la page d'accueil ('/' ou '/index.html') est gérée
        if (currentPathname === '/' || currentPathname === '/index.html') {
            currentPathname = '/index.html'; // Normalise pour une comparaison simple
        }

        navLinks.forEach(link => {
            let linkHref = link.getAttribute('href'); // Récupère le href tel que dans le HTML (ex: /TRC25-Documentation-Mecanique/pieces/piece3.html)
            let linkPathname = new URL(linkHref, window.location.origin).pathname; // Convertit en chemin absolu (ex: /TRC25-Documentation-Mecanique/pieces/piece3.html)

            // Normalise le chemin du lien de la même manière que le chemin actuel
            if (linkPathname.startsWith(repoBase)) {
                linkPathname = linkPathname.substring(repoBase.length);
            }
            if (linkPathname === '/' || linkPathname === '/index.html') {
                linkPathname = '/index.html';
            }
            
            // Si le lien est vers le dépôt GitHub externe, on l'ignore pour la classe active
            if (linkHref.startsWith('http') || linkHref.startsWith('https')) {
                return; 
            }

            // Compare le chemin actuel normalisé avec le chemin du lien normalisé
            if (currentPathname === linkPathname) {
                link.classList.add('active');
            } else {
                link.classList.remove('active'); // S'assurer qu'il n'y a qu'une seule active
            }
        });
    }

    // Configure le bouton de basculement de la sidebar et la fermeture au clic
    function setupSidebarToggle() {
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