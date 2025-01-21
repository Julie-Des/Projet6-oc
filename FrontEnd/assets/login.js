sendLogin();

function sendLogin() {
  const loginForm = document.querySelector(".login-form");
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const loginValues = {
      email: event.target.querySelector("[name=email]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginValues),
    });

    const statusResponse = response.status;
    if (statusResponse === 404) {
      MessageAndInputsError404();
    } 
    else if (statusResponse === 401) {
      MessageAndInputError401();
    }
    else {
      const responseJson = await response.json();
      // Stockage du token dans le localStorage
      window.localStorage.setItem("token", responseJson.token);
      window.location.href = "../index.html";
    }
  });
}

function MessageAndInputsError404() {
  // Message d'erreur
  const errorMessage = document.querySelector(".error-message");
  errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";

  // Bordure rouge inputs
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");
  inputEmail.classList.add("error-input");
  inputPassword.classList.add("error-input");
}

function MessageAndInputError401() {
  // Message d'erreur
  const errorMessage = document.querySelector(".error-message");
  errorMessage.innerText = "Erreur dans le mot de passe";

   // Bordure rouge input password
   const inputPassword = document.getElementById("password");
   inputPassword.classList.add("error-input");
}