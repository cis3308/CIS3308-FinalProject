function renderLoginPage(): void {
    const main = document.createElement("main");
    main.className = "login-page";

    const loginButton = document.createElement("button");
    loginButton.type = "button";
    loginButton.textContent = "Login";

    const mainPageButton = document.createElement("button");
    mainPageButton.type = "button";
    mainPageButton.textContent = "Go to the main page";

    loginButton.addEventListener("click", () => {
        // call backend
        loginButton.textContent = "Logged in";
        loginButton.classList.add("logged-in");
        loginButton.disabled = true;
    });

    mainPageButton.addEventListener("click", () => {
        window.location.href = "mainpage.html";
    });

    main.append(loginButton, mainPageButton);
    document.body.append(main);
}

renderLoginPage();