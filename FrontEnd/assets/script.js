// Récupération des travaux depuis l'API
const response = await fetch("http://localhost:5678/api/works");
const works = await response.json();

// Récupération de l'élément du DOM qui accueille la galerie
const gallery = document.querySelector(".gallery");
// Récupération de l'élément du DOM qui accueille les filtres
const filters = document.querySelector(".filters");
// Récupération des catégories
const categories = new Set(works.map((work) => work.category.name));

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
});

// Gestion des boutons en fonction des catégories
categories.forEach((category) => {
  const categoryButton = document.createElement("button");
  categoryButton.innerText = category;
  filters.appendChild(categoryButton);

  categoryButton.addEventListener("click", () => {
    activeButton(categoryButton);
    const filteredWorksByCategory = works.filter((work) => work.category.name === category);
    clearGallery();
    displayWorks(filteredWorksByCategory);
  });
});

// Mode édition:
const token = window.localStorage.getItem("token");
if (token) {
  // Bande noire
  const bannerEditContainer = document.querySelector(".banner-edit-containeur");
  const bannerEdit = document.createElement("div");
  bannerEdit.classList.add("bannerEdit");
  bannerEditContainer.appendChild(bannerEdit);
  const bannerEditIcon = document.createElement("img");
  bannerEditIcon.src = "./assets/icons/pen-to-square.png";
  bannerEdit.appendChild(bannerEditIcon);
  const bannerEditText = document.createElement("p");
  bannerEditText.innerText = "Mode édition";
  bannerEdit.appendChild(bannerEditText);

  // Logout dans la navbar
  const logout = document.querySelector(".logout");
  logout.innerText = "logout";
  logout.addEventListener("click", (event) => {
    event.preventDefault();
    window.localStorage.removeItem("token");
    window.location.href = "./assets/login.html";
  });

  // Icone pour modifier
  const edits = document.querySelector(".edits");
  const editsIcon = document.createElement("img");
  editsIcon.src = "./assets/icons/pen-to-square-black.png";
  edits.appendChild(editsIcon);
  const editsText = document.createElement("a");
  editsText.innerText = "modifier";
  edits.appendChild(editsText);

  // Ouverture de la modale
  const modal = document.getElementById("modal");
  const modalGallery = document.querySelector(".modal-gallery");
  const modalAddPhoto = document.querySelector(".modal-add-photo");
  edits.addEventListener("click", (event) => {
    event.preventDefault;
    modal.style.display = "flex";
    modalGallery.style.display = "flex";
    modalAddPhoto.style.display = "none";
  });

  // fermeture de la modale
  const closeCrosses = document.querySelectorAll(".close-cross");
  closeCrosses.forEach((closeCross) => closeCross.addEventListener("click", closeModal));
  modal.addEventListener("click", closeModal);
  const modalWindow = document.querySelector(".modal-window");
  modalWindow.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Affichage des photos de la galerie
  const modalGalleryPhotos = document.querySelector(".modal-gallery-photos");
  works.forEach((work) => {
    const photoContainer = document.createElement("div");
    modalGalleryPhotos.appendChild(photoContainer);
    photoContainer.classList.add("photo-containeur");
    const photo = document.createElement("img");
    photo.src = work.imageUrl;
    photoContainer.appendChild(photo);
    photo.classList.add("photo-gallery");
    const trashIcon = document.createElement("img");
    trashIcon.src = "./assets/icons/trash.png";
    photoContainer.appendChild(trashIcon);
    trashIcon.classList.add("trash-icon");

    // Suppression d'un travail
    trashIcon.addEventListener("click", async () => {
      const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
      });
      const statusResponse = response.status;
      if (statusResponse === 204) {
        photoContainer.remove();
        document.getElementById(work.id).remove();
      }
    });
  });

  // Ouverture modale "Ajout photo"
  const addPhotoButton = document.querySelector(".add-photo-button");
  addPhotoButton.addEventListener("click", async () => {
    modalGallery.style.display = "none";
    modalAddPhoto.style.display = "flex";
    // Liste de catégories
    const selectCategory = document.getElementById("category");
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    selectCategory.innerHTML = '<option value="">';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      selectCategory.appendChild(option);
    })
  });

  // Retour en arrière vers modale Galerie photo
  const arrowLeft = document.querySelector(".arrow-left");
  arrowLeft.addEventListener("click", () => {
    modalGallery.style.display = "flex";
    modalAddPhoto.style.display = "none";
  });

  // Transfert d'une image
  const dropZone = document.querySelector(".add-photo-container");
  // En cliquant sur l'input
  const uploadInput = document.getElementById("fileElem");
    uploadInput.addEventListener("change", () => {
      transferPhoto(uploadInput);
    });
  // Drag and drop 
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    transferPhoto(event.dataTransfer);
  });

  // Récupération des catégories


  

  

  
}

// FONCTIONS

// Fonction pour afficher les travaux
function displayWorks(worksToDisplay) {
  worksToDisplay.forEach((work) => {
    // Création d'une balise dédiée à un travail
    const figure = document.createElement("figure");
    // Ajout d'un id à chaque figure
    figure.id = work.id;
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
  });
}

// Fonction pour effacer la galerie
function clearGallery() {
  document.querySelector(".gallery").innerHTML = "";
}

// Fonction pour gérer l'état actif des boutons de filtres
function activeButton(button) {
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
}

// Fonction pour fermer la modale
function closeModal() {
  modal.style.display = "none";
}

// Fonction pour transférer une photo
function transferPhoto(typeOfUpload) {
  const dropZone = document.querySelector(".add-photo-container");
  const errorMessage = document.querySelector(".error-message");
  const maxFileSize = 4 * 1024 * 1024;
  const allowedFileTypes = ["image/jpeg", "image/png"];
  let uploadedFile = null;
  const files = typeOfUpload.files;
  if (files.length > 0) {
    const file = files[0];

    if (!allowedFileTypes.includes(file.type)) {
      errorMessage.innerText = "Seuls les formats JPG et PNG sont acceptés";
      uploadedFile = null;
      return;
    }

    if (file.size > maxFileSize) {
      errorMessage.innerText = "La taille de l'image ne doit pas dépasser 4 Mo";
      uploadedFile = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      dropZone.innerHTML = `<img src="${e.target.result}" class="photo-preview">`;
    };
    reader.readAsDataURL(file);
    uploadedFile = file;
  }
}

// Fonction pour valider le titre
// function validateTitle(newPhotoTitle) {
//   const newPhotoTitle = document.getElementById("title");
//   if (newPhotoTitle.length >= 2) {
//     return true
//   }
//   return false
// }