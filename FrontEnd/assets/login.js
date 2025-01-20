sendLogin();

function sendLogin() {
  const loginForm = document.querySelector(".login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const loginValues = {
      email: event.target.querySelector("[name=email").value,
      password: event.target.querySelector("[name=password]").value,
    };
    console.log(loginValues);
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginValues),
    });

    const statusResponse = response.status;
    console.log(statusResponse);
    if (statusResponse === 401 || statusResponse === 404) {
      displayError();
    } else {
      const responseJson = await response.json();
      // Stockage du token dans le localStorage
      window.localStorage.setItem("token", responseJson.token);
      window.location.href = "../index.html";
    }
  });
}

function displayError() {
  // Message d'erreur
  const loginSection = document.getElementById("login");
  const errorMessage = document.createElement("p");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = "Erreur dans l’identifiant ou le mot de passe";
  loginSection.appendChild(errorMessage);

  // Bordure rouge inputs
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");

  inputEmail.classList.add("error-input");
  inputPassword.classList.add("error-input");
}
