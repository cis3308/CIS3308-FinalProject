import './setBudgetStyle.css'
//import * as db from './db/Queries'
export async function set_budget_page(){
    document.querySelector<HTMLDivElement>('#app')!.innerHTML=`
        <div>
            <header>
                <nav>
                    <img src="" alt="logo" />
                    <a href="#">
                        My Budget
                    </a>
                    <a href="#">
                        Split
                    </a>
                    <div class="profile">
                        <a>Profile</a>
                    </div>
                    <button id="logout">logout</button>
                </nav>
            </header>
        </div>

        <div class="budget-page">
            <div class="pie-chart">
                <div class="title">
                    <h1>January</h1>
                </div>
                <div id="pieChart">
                    <svg width="200" height="200">

                    </svg>
                </div>
                <div class="date-range">
                    <label for="range">Select Budget Range:</label>
                    <select id="month-start">
                        <option value="" disabled selected>-- Select a Month --</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                    <span>to</span>
                    <select id="month-finish">
                        <option value="" disabled selected>-- Select a Month --</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>
                </div>
            </div>

            <div class="budget">
                <div class="title">
                    <h2>Budget</h2>
                </div>
                <div class="budget-list">
                    <div class="income-budget">
                        <div class="income">
                            income
                        </div>
                        <div class="income-button">
                            <button id="add">+</button>
                        </div>
                    </div>
                    <div class="expense">
                        <div class="expense-category">
                            <div class="top">
                                <svg width="10" height="10"></svg>
                                <span>Food</span>
                                <input type="number" id="category-budget" name="category-budget" placeholder="Enter your budget">
                            </div>
                        </div>

                        <div class="budget-button">
                            <button id="add">+</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="save">
            <button id="save-budget">save</button>
        </div>
    `
}

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