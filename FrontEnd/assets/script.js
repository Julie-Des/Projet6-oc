// Récupération des travaux depuis l'API
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

// Récupération de l'élément du DOM qui accueille la galerie
const gallery = document.querySelector(".gallery");
// Récupération de l'élément du DOM qui accueille les filtres
const filters = document.querySelector(".filters");
// Récupération des catégories
const categories = new Set(works.map(work => work.category.name));

displayWorks(works);

// Gestion du bouton "Tous"
const allButton = document.createElement("button");
allButton.innerText = "Tous";
allButton.classList.add("active");
filters.appendChild(allButton);

allButton.addEventListener("click", () => {
  clearGallery();
  activeButton(allButton);
  displayWorks(works);
})

// Gestion des boutons en fonction des catégories
categories.forEach(category => {
  const categoryButton = document.createElement("button");
  categoryButton.innerText = category;
  filters.appendChild(categoryButton);

  categoryButton.addEventListener("click", () => {
    activeButton(categoryButton);
    const filteredWorksByCategory = works.filter(work => work.category.name === category);
    clearGallery();
    displayWorks(filteredWorksByCategory);
  });
});


// Mode édition:
const token = window.localStorage.getItem("token");
if (token) {
  // Bande noire
  const bandEditionContainer = document.querySelector(".bandEditionContaineur");
  const bandEdition = document.createElement("div");
  bandEdition.classList.add("bandEdition");
  bandEditionContainer.appendChild(bandEdition);
  const bandEditionIcon = document.createElement("img");
  bandEditionIcon.src = "./assets/icons/pen-to-square.png";
  bandEdition.appendChild(bandEditionIcon);
  const bandEditionText = document.createElement("p");
  bandEditionText.innerText = "Mode édition";
  bandEdition.appendChild(bandEditionText);

  // Logout dans la navbar
  const logout = document.querySelector(".logout");
  logout.innerText = "logout";

  // Icone pour modifier
  const modifications = document.querySelector(".modifications");
  const modificationsIcon = document.createElement("img");
  modificationsIcon.src = "./assets/icons/pen-to-square-black.png";
  modifications.appendChild(modificationsIcon);
  const modificationsText = document.createElement("button");
  modificationsText.innerText = "modifier";
  modifications.appendChild(modificationsText);
}


// FONCTIONS

// Fonction pour afficher les travaux
function displayWorks(worksToDisplay) {

  worksToDisplay.forEach(work => {
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
  })
}

// Fonction pour effacer la galerie
function clearGallery() {
  document.querySelector(".gallery").innerHTML = "";
}

// Fonction pour gérer l'état actif des boutons
function activeButton(button) {
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
}