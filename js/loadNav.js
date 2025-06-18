function includeNav() {
  fetch('/TRC25-Documentation-Mecanique/composants/nav.html')
    .then(response => {
      if (!response.ok) throw new Error("Navigation introuvable");
      return response.text();
    })
    .then(data => {
      document.getElementById('header').innerHTML = data;
    })
    .catch(error => {
      console.error("Erreur de chargement de la nav :", error);
    });
}

document.addEventListener('DOMContentLoaded', includeNav);
