const works = await getWorks();
let photoPreview = null;
main();

async function main() {
  displayWorks(works);
  addCategoryButtons();
  const token = window.localStorage.getItem("token");
  if (token) {
    switchToEditMode();
    displayLogoutButton();
  }
}

function displayLogoutButton() {
  const logout = document.querySelector(".logout");
  logout.innerText = "logout";
  logout.addEventListener("click", (event) => {
    event.preventDefault();
    window.localStorage.removeItem("token");
    window.location.href = "./assets/login.html";
  });
}

function switchToEditMode() {
  displayEditBanner();
  displayEditButton();
  handleModalClosing();
  handleModalPhotoGallery();
  createDropZone();
  handleWorkCreation();
}

function handleWorkCreation() {
  const fileInput = document.getElementById("fileElem");
  const form = document.querySelector(".add-photo-form");
  const dropZoneEmpty = document.querySelector(".dropzone-empty");
  const dropZoneFull = document.querySelector(".dropzone-full");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const message = document.querySelector(".message");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const token = window.localStorage.getItem("token");
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'image.");
      }

      const result = await response.json();
      message.innerText = "Photo ajoutée avec succès !";
      works.push(result);
      clearGallery();
      clearGalleryOfModal();
      handleModalPhotoGallery();
      displayWorks(works);
      form.reset();
      validateForm();
      dropZoneEmpty.style.display = "flex";
      dropZoneFull.style.display = "none";
      photoPreview = null;

    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  });
}

function createDropZone() {
  const addPhotoButton = document.querySelector(".add-photo-button");
  const dropZoneFull = document.querySelector(".dropzone-full");
  const modalGallery = document.querySelector(".modal-gallery");
  const modalAddPhoto = document.querySelector(".modal-add-photo");
  const dropZoneEmpty = document.querySelector(".dropzone-empty");

  addPhotoButton.addEventListener("click", async () => {
    modalGallery.style.display = "none";
    modalAddPhoto.style.display = "flex";

    if (photoPreview) {
      dropZoneEmpty.style.display = "none";
      dropZoneFull.style.display = "flex";
    } else {
    dropZoneFull.style.display = "none";
    dropZoneEmpty.style.display = "flex";
    }
    addValidationListeners();
  });

  // Retour en arrière vers modale Galerie photo
  const arrowLeft = document.querySelector(".arrow-left");
  arrowLeft.addEventListener("click", () => {
    modalGallery.style.display = "flex";
    modalAddPhoto.style.display = "none";
    clearSuccessMessage();
  });

  // Transfert d'une image
  // En cliquant sur l'input
  const fileInput = document.getElementById("fileElem");
  fileInput.addEventListener("change", () => {
    transferPhoto(fileInput);
  });
  // Drag and drop
  dropZoneEmpty.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  dropZoneEmpty.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    transferPhoto(event.dataTransfer);
  });
}

function handleModalPhotoGallery() {
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
      const token = window.localStorage.getItem("token");
      const response = await fetch(`http://localhost:5678/api/works/${work.id}`, {
        method: "delete",
        headers: { Authorization: `Bearer ${token}` },
      });
      const statusResponse = response.status;
      if (statusResponse === 204) {
        photoContainer.remove();
        const indexOfWork = works.indexOf(work);
        works.splice(indexOfWork, 1);
        document.getElementById(work.id).remove();
      }
    });
  });
}

function handleModalClosing() {
  const closeCrosses = document.querySelectorAll(".close-cross");
  closeCrosses.forEach((closeCross) => closeCross.addEventListener("click", () => {
    closeModal();
    clearSuccessMessage();
  }));
  modal.addEventListener("click", () => {
    closeModal();
    clearSuccessMessage();
  });

  const modalWindow = document.querySelector(".modal-window");
  modalWindow.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

function displayEditButton() {
  const edits = document.querySelector(".edits");
  const editsIcon = document.createElement("img");
  editsIcon.src = "./assets/icons/pen-to-square-black.png";
  edits.appendChild(editsIcon);
  const editsText = document.createElement("a");
  editsText.innerText = "modifier";
  edits.appendChild(editsText);
  const modal = document.getElementById("modal");
  const modalGallery = document.querySelector(".modal-gallery");
  const modalAddPhoto = document.querySelector(".modal-add-photo");
  edits.addEventListener("click", async (event) => {
    event.preventDefault;
    modal.style.display = "flex";
    modalGallery.style.display = "flex";
    modalAddPhoto.style.display = "none";
    // Liste des catégories
    const selectCategory = document.getElementById("category");
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    selectCategory.innerHTML = '<option value="">Sélectionner une catégorie</option>';
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      selectCategory.appendChild(option);
    });
  });
}

function displayEditBanner() {
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
}

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();
  return works;
}

function addCategoryButtons() {
  const filters = document.querySelector(".filters");
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
  const categories = new Set(works.map((work) => work.category.name));
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
}

// Fonction pour afficher les travaux
function displayWorks(worksToDisplay) {
  // Récupération de l'élément du DOM qui accueille la galerie
  const gallery = document.querySelector(".gallery");
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

// Fonction pour effacer la galerie de la modale
function clearGalleryOfModal() {
  document.querySelector(".modal-gallery-photos").innerHTML = "";
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
  clearSuccessMessage();
  const dropZoneFull = document.querySelector(".dropzone-full");
  const dropZoneEmpty = document.querySelector(".dropzone-empty");
  const fileInput = document.getElementById("fileElem");
  const errorMessage = document.querySelector(".error-message");
  const maxFileSize = 4 * 1024 * 1024;
  const allowedFileTypes = ["image/jpeg", "image/png"];
 
  const files = typeOfUpload.files;
  if (files.length > 0) {
    const file = files[0];

    if (!allowedFileTypes.includes(file.type)) {
      errorMessage.innerText = "Seuls les formats JPG et PNG sont acceptés";
      return;
    }

    if (file.size > maxFileSize) {
      errorMessage.innerText = "La taille de l'image ne doit pas dépasser 4 Mo";
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      dropZoneEmpty.style.display = "none";
      dropZoneFull.style.display = "flex";
      dropZoneFull.innerHTML = `<img src="${e.target.result}" class="photo-preview">`;
      errorMessage.innerText = "";
      photoPreview = e.target.result;
    };
    reader.readAsDataURL(file);
    
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    validateForm()
  }
}

function validateForm() {
  const fileInput = document.getElementById("fileElem");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const validateButton = document.querySelector(".validate-btn");
 

  const FileInputIsValid = fileInput.files.length > 0;
  const titleInputIsValid = titleInput.value.trim().length > 2;
  const categoryIsSelected = categorySelect.value !== "";

  if (FileInputIsValid && titleInputIsValid && categoryIsSelected) {
    validateButton.classList.add("active");
  } else {
    validateButton.classList.remove("active");
  }
}

function addValidationListeners() {
  const fileInput = document.getElementById("fileElem");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const messageTitleInput = document.querySelector(".message-input-title");

  fileInput.addEventListener("change", validateForm);
  titleInput.addEventListener("input", () => {
    const titleInputIsValid = titleInput.value.trim().length > 2;
    if (titleInputIsValid) {
      titleInput.style.outline = "none";
      messageTitleInput.innerText = "";
    } else {
      titleInput.style.outline = "1px solid red";
      messageTitleInput.innerText = "Le titre doit contenir plus de 2 caractères";
    }
    validateForm();
  });
  categorySelect.addEventListener("change", validateForm);
}

function clearSuccessMessage() {
  const message = document.querySelector(".message");
  message.innerText = "";
}