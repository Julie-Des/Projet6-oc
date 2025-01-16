const response = await fetch("http://localhost:5678/api/users/login", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: `{"email": "sophie.bluel@test.tld","password": "S0phie"}`
});
const login = await response.json();
console.log(login);


// Stockage du token dans le localStorage
window.localStorage.setItem("token", "login.token");

const token = window.localStorage.getItem("token");
console.log(token);

