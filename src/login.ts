import {supabase,login} from './supabaseClient'
export function renderLoginPage(): void {
    const main = document.createElement("main");
    main.className = "login-page";

    const mainPageButton = document.createElement("button");
    mainPageButton.type = "button";
    mainPageButton.textContent = "Go to the main page";

    mainPageButton.addEventListener("click", () => {
        window.location.href = "mainpage.html";
    });
    let btn=document.createElement('button')
    btn.textContent='login'
    btn.onclick=async()=>{login(supabase)}
    main.append(mainPageButton,btn);
    document.body.append(main);
}