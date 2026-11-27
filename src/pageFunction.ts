import * as Q from "./db/Queries"

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

const show_events = document.getElementById("event-entries");
const show_transaction_amount = document.getElementById("trans-amt");
const show_transactions = document.getElementById("trans-entries");
const show_total_balance = document.getElementById("total-balance");

const add_balance = document.getElementById("set-budget");
const new_transaction = document.getElementById("new-trans");

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

});

dropdownMonthFinish?.addEventListener('change', (event: Event) => {

});

addBudgetCategory?.addEventListener("click", () => {
    
});

addBudgetIncome?.addEventListener("click", () => {
    
});

saveBudgetCategoryAmount?.addEventListener("click", () => {

});

show_transaction_amount?.addEventListener("click", () =>
{
    const money = Q.showTransactionAmount();
    return money;
});