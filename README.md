# Sophie Bluel: Building a Dynamic Web Page with JavaScript 🧱

## 🎯 Project Objectives

This project consisted of developing a **dynamic web page** for an **interior architect’s portfolio** using **JavaScript** and a **REST API**.  
The goal was to make the website interactive, allowing dynamic content updates and administration features.

This project is part of the Web Integrator training course – OpenClassrooms.

---

## 🧠 Skills Developed

- **JavaScript DOM Manipulation** – Creating, updating, and deleting elements dynamically from JavaScript.  
- **Event Handling** – Managing user actions such as form submissions, clicks, and modal triggers.  
- **API Integration** – Fetching and sending data to a REST API using `fetch()` and asynchronous JavaScript.
- **API Documentation Reading** – Interpreting and using a Swagger (OpenAPI) specification to understand available endpoints, request formats, and response structures before integrating them into the project.  
- **Authentication Logic** – Implementing login functionality and token-based authentication.  
- **Media Upload Functionality** – Developing a modal component to upload and manage new media files.  
- **Front-End Architecture** – Organizing code in a clear, modular, and maintainable structure.  
- **Tool Mastery** – Working efficiently with **Figma**, **VS Code**, and **GitHub** for professional project workflows.

---

## ⚙️ Technical Stack

- **Languages:** HTML5, CSS3, JavaScript (ES6+)  
- **Tools:** Visual Studio Code, Git, GitHub  
- **Design Reference:** Figma  
- **API Communication:** Fetch API (GET, POST, DELETE)
- **API Documentation:** Swagger (OpenAPI specification) 
- **Development Environment:** Local API server provided for testing authentication and data persistence
- **Project management Tool:** Kanban

---

## 🚀 Features Implemented

### 🖼️ Dynamic Project Gallery
- Fetches and displays all works from the API.  
- Implements filtering by category.  
- Dynamically updates the DOM without page reload.

### 🔐 Administrator Login Page
- Login form created from scratch.  
- Authentication handled via API with token storage in localStorage.  
- Conditional rendering of admin features based on authentication state.

### 📤 Media Upload Modal
- Custom modal component developed with vanilla JavaScript.  
- Allows administrator to upload, preview, and add new works to the API.  
- Includes validation for file format and required fields.

### ⚡ API Interaction
- Fetching and displaying works from the API.  
- Secure POST requests for adding new projects.  
- DELETE functionality for removing existing works.

### 💡 User Interaction & UX
- Smooth DOM updates and transitions for better user experience.  
- Responsive design aligned with the Figma mockups.  
- Error handling and connection form feedback integrated into the interface.

---

## 📦 Getting Started

- Launch the backend from your terminal by following the instructions in the ReadMe file.
- If you want to view the backend and frontend code, do so in two different instances of VSCode to avoid any problems.

---

## 🌍 Deployment

The project is deployed on Render:
https://projet6-oc-front.onrender.com/

Please note that portfolio images (from the backend) may take a few seconds to display, due to the limitation of the free Render account.

If you want to test the features after administrator login:

**email:** sophie.bluel@test.tld

**password:** S0phie

## 📬 Contact

Deshayes Julie - julie.deshayes14@gmail.com

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
