import {login,supabase} from './src/supabaseClient'
function renderLoginPage(): void {
    const main = document.createElement("main");
    main.className = "login-page";

    const loginButton = document.createElement("button");
    loginButton.type = "button";
    loginButton.textContent = "Login";

    loginButton.addEventListener("click",()=>login(supabase));

    main.append(loginButton);
    document.body.append(main);
}

renderLoginPage();