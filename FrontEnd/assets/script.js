// Récupération des travaux depuis l'API
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

// Récupération de l'élément du DOM qui accueille la galerie
const gallery = document.querySelector(".gallery");
// Initialisation du set
const categories = new Set();

generateWorks(works);

function generateWorks(worksToDisplay) {

  for (let i = 0; i < worksToDisplay.length; i++) {
    const work = worksToDisplay[i];
    // Création d'une balise dédiée à un travail
    const figure = document.createElement("figure");
    // Création des balises
    const imageWork = document.createElement("img");
    imageWork.src = work.imageUrl;
    const titleWork = document.createElement("figcaption");
    titleWork.innerText = work.title;

    // Attachement de la balise figure à gallery
    gallery.appendChild(figure);
    // Attachement des autres balises à figure
    figure.appendChild(imageWork);
    figure.appendChild(titleWork);

    // Récupération des catégories sans doublon
    categories.add(work.category.name);
  }
}

// Récupération de l'élément du DOM qui accueille les filtres
const filters = document.querySelector(".filters");

// Gestion du bouton "Tous"
const allButton = document.createElement("button");
allButton.innerText = "Tous";
filters.appendChild(allButton);
allButton.addEventListener("click", () => {
  document.querySelector(".gallery").innerHTML = "";
  generateWorks(works);
})

// Gestion des boutons en fonction des catégories
categories.forEach ((category) => {
  const categoryButton = document.createElement("button");
  categoryButton.innerText = category;
  filters.appendChild(categoryButton);
  categoryButton.addEventListener("click", function() {
    const filteredWorksByCategory = works.filter(function(work) {
      return work.category.name === category;
    })
    document.querySelector(".gallery").innerHTML = "";
    generateWorks(filteredWorksByCategory);
  })
  
})


