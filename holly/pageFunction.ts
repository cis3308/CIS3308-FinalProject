import {logout} from '../src/supabaseClient'
const nav=document.querySelector<HTMLDivElement>('nav')
const logout_btn=document.createElement('button')
logout_btn.textContent='logout'
logout_btn.onclick=logout
nav?.appendChild(logout_btn)

console.log("pageFunction.ts is running");

const addButton = document.getElementById("add");
const editButton = document.getElementById("edit");

const addCategoryPopup = document.getElementById("category-popup-container");
const cancelButton = document.getElementById("cancel");

const dropdownMonthStart = document.querySelector<HTMLSelectElement>('#month-start');
const dropdownMonthFinish = document.querySelector<HTMLSelectElement>('#month-finish');
const saveBudgetButton = document.getElementById("save-budget");

const addBudgetCategory = document.getElementById("budget-button");
const addBudgetIncome = document.getElementById("income-button");

const saveBudgetCategoryAmount = document.getElementById("save-category-budget");

let doneEditing = false;

addButton?.addEventListener("click", () => {
    addCategoryPopup?.classList.remove("hidden");
});
cancelButton?.addEventListener("click", () => {
    console.log("cancel");
    addCategoryPopup?.classList.add("hidden");
});

editButton?.addEventListener("click", () => {

    const amounts = document.querySelectorAll(".amount");

    if (!doneEditing) {

        for (const amount of amounts) {
            const currentCategoryBudget = amount.textContent;

            const input = document.createElement("input");
            input.type = "number";
            input.value = currentCategoryBudget ?? "";

            amount.replaceWith(input);
            input.classList.add("amount");
        };

        editButton.textContent = "Save";
        doneEditing = true;

    }
    else {

        const inputs = document.querySelectorAll<HTMLInputElement>(
            ".amount"
        );

        for (const input of inputs) {
            const newCategoryBudget = document.createElement("span");

            newCategoryBudget.classList.add("amount");
            newCategoryBudget.textContent = input.value;

            input.replaceWith(newCategoryBudget);
        };

        editButton.textContent = "Edit";
        doneEditing = false;
    }

});

saveBudgetButton?.addEventListener("click", () => {

});

dropdownMonthStart?.addEventListener('change', (event: Event) => {
    console.log(event)
});

dropdownMonthFinish?.addEventListener('change', (event: Event) => {
    console.log(event)
});

addBudgetCategory?.addEventListener("click", () => {

});

addBudgetIncome?.addEventListener("click", () => {

});

saveBudgetCategoryAmount?.addEventListener("click", () => {

});