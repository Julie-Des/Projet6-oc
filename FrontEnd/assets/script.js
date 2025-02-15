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

function switchToEditMode() {
  displayEditBanner();
  displayEditButton();
  handleModalClosing();
  handleModalPhotoGallery();
  handleModalAddPhoto();
  handleWorkCreation();
}

// FONCTIONS

async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  const retrievedWorks = await response.json();
  return retrievedWorks;
}

function displayWorks(worksToDisplay) {
  const gallery = document.querySelector(".gallery");
  worksToDisplay.forEach((work) => {
    const figure = document.createElement("figure");
    figure.id = work.id;
    const imageWork = document.createElement("img");
    imageWork.src = work.imageUrl;
    const titleWork = document.createElement("figcaption");
    titleWork.innerText = work.title;

    gallery.appendChild(figure);
    figure.appendChild(imageWork);
    figure.appendChild(titleWork);
  });
}

function addCategoryButtons() {
  const filters = document.querySelector(".filters");
  filters.innerHTML = "";
  // "All" button
  const allButton = document.createElement("button");
  allButton.innerText = "Tous";
  allButton.classList.add("active");
  filters.appendChild(allButton);

  allButton.addEventListener("click", () => {
    clearGallery();
    activeFiltersButton(allButton);
    displayWorks(works);
  });

  // Buttons by categories
  const categories = new Set(works.map((work) => work.category.name));
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.innerText = category;
    filters.appendChild(categoryButton);

    categoryButton.addEventListener("click", () => {
      activeFiltersButton(categoryButton);
      const filteredWorksByCategory = works.filter((work) => work.category.name === category);
      clearGallery();
      displayWorks(filteredWorksByCategory);
    });
  });
}

function activeFiltersButton(button) {
  document.querySelectorAll(".filters button").forEach((btn) => {
    btn.classList.remove("active");
  });
  button.classList.add("active");
}

function clearGallery() {
  document.querySelector(".gallery").innerHTML = "";
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

function displayEditButton() {
  const edits = document.querySelector(".edits");
  const editsIcon = document.createElement("img");
  editsIcon.src = "./assets/icons/pen-to-square-black.png";
  edits.appendChild(editsIcon);
  const editsText = document.createElement("a");
  editsText.innerText = "modifier";
  edits.appendChild(editsText);
  const modal = document.getElementById("modal");

  edits.addEventListener("click", async (event) => {
    event.preventDefault;
    modal.style.display = "flex";
    switchDisplayComponents(".modal-add-photo", ".modal-gallery");
  });
}

function handleModalClosing() {
  const closeCrosses = document.querySelectorAll(".close-cross");
  closeCrosses.forEach((closeCross) =>
    closeCross.addEventListener("click", () => {
      closeModal();
      clearMessage(".success-message");
      clearMessage(".unsuccess-message");
      clearMessage(".error-message");
      clearForm();
    })
  );

  modal.addEventListener("click", () => {
    closeModal();
    clearMessage(".success-message");
    clearMessage(".unsuccess-message");
    clearMessage(".error-message");
    clearForm();
  });

  const modalWindow = document.querySelector(".modal-window");
  modalWindow.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

function closeModal() {
  modal.style.display = "none";
}

function clearForm() {
  const form = document.querySelector(".add-photo-form");
  form.reset();
  if (photoPreview) {
    photoPreview = null;
  }
}

function clearMessage(selector) {
  document.querySelector(selector).innerText = "";
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

    // Delete a work
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

function handleModalAddPhoto() {
  const addPhotoButton = document.querySelector(".add-photo-button");
  addPhotoButton.addEventListener("click", async () => {
    switchDisplayComponents(".modal-gallery", ".modal-add-photo");
    displayListOfCategories();

    if (photoPreview) {
      switchDisplayComponents(".dropzone-empty", ".dropzone-full");
    } else {
      switchDisplayComponents(".dropzone-full", ".dropzone-empty");
    }
    addValidationFormListeners();
  });

  // Go back to the modal gallery
  const arrowLeft = document.querySelector(".arrow-left");
  arrowLeft.addEventListener("click", () => {
    switchDisplayComponents(".modal-add-photo", ".modal-gallery");
    clearMessage(".success-message");
    clearMessage(".unsuccess-message");
    clearMessage(".error-message");
  });

  // Transfert an image
  // To click on the input
  const fileInput = document.getElementById("fileElem");
  fileInput.addEventListener("change", () => {
    transferPhoto(fileInput);
  });
  // Drag and drop
  const dropZoneEmpty = document.querySelector(".dropzone-empty");
  dropZoneEmpty.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
  dropZoneEmpty.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    transferPhoto(event.dataTransfer);
  });
}

async function displayListOfCategories() {
  const selectCategory = document.getElementById("category");
  const selectedCategory = selectCategory.value;
  const response = await fetch("http://localhost:5678/api/categories");
  const categories = await response.json();
  selectCategory.innerHTML = '<option value="">Sélectionner une catégorie</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    selectCategory.appendChild(option);
  });

  if (selectedCategory) {
    selectCategory.value = selectedCategory;
  }
}

function transferPhoto(inputElement) {
  clearMessage(".success-message");
  clearMessage(".unsuccess-message");
  const dropZoneFull = document.querySelector(".dropzone-full");
  const fileInput = document.getElementById("fileElem");
  const errorMessage = document.querySelector(".error-message");
  const maxFileSize = 4 * 1024 * 1024;
  const allowedFileTypes = ["image/jpeg", "image/png"];

  const files = inputElement.files;
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
      switchDisplayComponents(".dropzone-empty", ".dropzone-full");
      dropZoneFull.innerHTML = `<img src="${e.target.result}" class="photo-preview">`;
      clearMessage(".error-message");
      photoPreview = e.target.result;
      validateForm();
    };
    reader.readAsDataURL(file);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    fileInput.files = dataTransfer.files;

    validateForm();
  }
}

function validateForm() {
  const fileInput = document.getElementById("fileElem");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const validateButton = document.querySelector(".validate-btn");
  const errorMessage = document.querySelector(".error-message");

  const fileInputIsValid = fileInput.files.length > 0;
  const titleInputIsValid = titleInput.value.trim().length > 2;
  const categoryIsSelected = categorySelect.value !== "";
  const errorOnFile = errorMessage.innerText != "";

  if (fileInputIsValid && titleInputIsValid && categoryIsSelected && !errorOnFile) {
    validateButton.classList.add("active");
    return true;
  } else {
    validateButton.classList.remove("active");
    return false;
  }
}

function addValidationFormListeners() {
  const fileInput = document.getElementById("fileElem");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const messageTitleInput = document.querySelector(".message-input-title");

  fileInput.addEventListener("change", validateForm);
  titleInput.addEventListener("input", () => {
    const titleInputIsValid = titleInput.value.trim().length > 2;
    if (titleInputIsValid) {
      titleInput.style.outline = "none";
      clearMessage(".message-input-title");
    } else {
      titleInput.style.outline = "1px solid red";
      messageTitleInput.innerText = "Le titre doit contenir plus de 2 caractères";
    }
    validateForm();
  });
  categorySelect.addEventListener("change", validateForm);
}

function handleWorkCreation() {
  const fileInput = document.getElementById("fileElem");
  const form = document.querySelector(".add-photo-form");
  const titleInput = document.getElementById("title");
  const categorySelect = document.getElementById("category");
  const successMessage = document.querySelector(".success-message");
  const unsuccessMessage = document.querySelector(".unsuccess-message");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (validateForm()) {
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
          throw new Error("Erreur lors de l'envoi de l'image");
        }

        const result = await response.json();
        successMessage.innerText = "Photo ajoutée avec succès !";
        works.push({
          id: result.id,
          title: result.title,
          imageUrl: result.imageUrl,
          categoryId: result.categoryId,
          userId: result.userId,
          category: {
            id: result.categoryId,
            name: categorySelect.options[categorySelect.selectedIndex].text,
          },
        });
        clearGallery();
        clearGalleryOfModal();
        handleModalPhotoGallery();
        displayWorks(works);
        addCategoryButtons();
        clearForm();
        validateForm();
        switchDisplayComponents(".dropzone-full", ".dropzone-empty");
      } catch (error) {
        console.error("Erreur :", error);
        unsuccessMessage.innerText = "Une erreur est survenue lors de l'envoi";
      }
    }
  });
}

function clearGalleryOfModal() {
  document.querySelector(".modal-gallery-photos").innerHTML = "";
}

function switchDisplayComponents(classToHide, classToDisplay) {
  const elementToHide = document.querySelector(classToHide);
  const elementToDisplay = document.querySelector(classToDisplay);
  elementToHide.style.display = "none";
  elementToDisplay.style.display = "flex";
}
