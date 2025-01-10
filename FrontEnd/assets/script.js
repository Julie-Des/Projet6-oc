// Récupération des travaux depuis l'API
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();
console.log(works);

// Récupération de l'élément du DOM qui accueille la gallery
const gallery = document.querySelector(".gallery");
// Initialisation du set
const categories = new Set();

for (let i = 0; i < works.length; i++) {
  const work = works[i];
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
console.log(categories[0]);

// Récupération de l'élément du DOM qui accueille les filtres
const filters = document.querySelector(".filters");
// Création du bouton "Tous"
const tousButton = document.createElement("button");
tousButton.innerText = "Tous";
filters.appendChild(tousButton);

// Création des boutons en fonction des catégories
categories.forEach ((category) =>{
  const categoryButton = document.createElement("button");
  categoryButton.innerText = category;
  filters.appendChild(categoryButton);
})
