import {login,supabase} from './src/supabaseClient'
function renderLoginPage(): void {
    const main = document.createElement("main");
    main.className = "login-page";

    const loginButton = document.createElement("button");
    loginButton.type = "button";
    loginButton.textContent = "Login";

    const mainPageButton = document.createElement("button");
    mainPageButton.type = "button";
    mainPageButton.textContent = "Go to the main page";

    loginButton.addEventListener("click",()=>login(supabase));

    mainPageButton.addEventListener("click", () => {
        window.location.href = "mainpage.html";
    });

    main.append(loginButton, mainPageButton);
    document.body.append(main);
}

renderLoginPage();