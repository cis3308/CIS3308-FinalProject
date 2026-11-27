import data from "./mockData.json";
declare const d3: typeof import("d3");

interface Expense {
    category: string;
    budget: number;
    spent: number;
}

const expenses: Expense[] = data.expenses;

console.log(expenses);

///////////////////////////////////////////////
const mockdata = expenses.map(expense => ({
    category: expense.category,
    value: expense.budget
}));

const width = 400;
const height = 400;
const radius = (Math.min(width, height) / 2) - 10;

const svg = d3.select("#pie-chart-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`)

const color = d3.scaleOrdinal(d3.schemeTableau10);

const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

function update(mockdata){
    const nonZeroData = mockdata.filter(d => d.value > 0);
    const pieData = pie(nonZeroData);

    svg.selectAll("path")
        .data(pieData, d => d.data.category)
        .join("path")
        .attr("fill", d => color(d.data.category))
        .attr("stroke", "#fff")
        .attr("stroke-width", 4)
        .transition().duration(400)
        .attr("d", arc);

}

update(mockdata); 
///////////////////////////////////////////////

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

const budgetList = document.getElementById("expense-list");

function displayExpenses() {

    if (!budgetList) return;

    budgetList.innerHTML = "";

    expenses.forEach(expense => {

        const category = document.createElement("div");
        category.classList.add("expense-category");

        category.innerHTML = `
            <div class="top">
                <span>${expense.category}</span>
                <span class="amount">${expense.budget}</span>
            </div>

            <div class="bar">
                <svg width="20" height="10"></svg>
            </div>

            <span>Spent: ${expense.spent}</span>
            <span>Left: ${expense.budget - expense.spent}</span>
        `;

        budgetList.appendChild(category);
    });
}

displayExpenses();

addButton?.addEventListener("click", () => {
    addCategoryPopup?.classList.remove("hidden");
});
cancelButton?.addEventListener("click", () => {
    console.log("cancel");
    addCategoryPopup?.classList.add("hidden");
});

let doneEditing = false;

editButton?.addEventListener("click", () => {

    const amounts = document.querySelectorAll<HTMLElement>(".amount");

    if (!doneEditing) {

        amounts.forEach((amount, index) => {

            const input = document.createElement("input");

            input.type = "number";
            input.value = String(expenses[index].budget);
            input.classList.add("amount");

            amount.replaceWith(input);
        });

        editButton.textContent = "Save";
        doneEditing = true;

    } else {

        const inputs = document.querySelectorAll<HTMLInputElement>(".amount");

        inputs.forEach((input, index) => {

            expenses[index].budget = Number(input.value);
        });

        displayExpenses();

        const updatedData = expenses.map(expense => ({
            category: expense.category,
            value: expense.budget
        }));

        update(updatedData);

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