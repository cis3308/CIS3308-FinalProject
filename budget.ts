import data from "./budget.json";
declare const d3: typeof import("d3");

interface Expense {
    category: string;
    budget: number;
    spent: number;
}

const savedExpenses = localStorage.getItem("expenses");

const expenses: Expense[] = savedExpenses
    ? JSON.parse(savedExpenses)
    : data.expenses;


///////////////////////////////////////////////
const chartElement = document.querySelector("#pie-chart-container");
const chartContainer = d3.select(chartElement);

console.log("D3:", d3);
console.log("Chart element:", chartElement);
console.log("Expenses:", expenses);

const mockdata = expenses.map(expense => ({
    category: expense.category,
    value: expense.budget
}));

const width = 150;
const height = 150;
const radius = (Math.min(width, height) / 2) - 10;

const svg = chartContainer
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
    .attr("stroke-width", 2)
    .transition().duration(400)
    .attr("d", arc);

}

update(mockdata);


///////////////////////////////////////////////

const addButton = document.getElementById("add");
const editButton = document.getElementById("edit");

const addCategoryPopup = document.getElementById("category-popup-container");
const cancelButton = document.getElementById("cancel");

//////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////
const budgetMonth = document.getElementById(".set-title h1");

function displayMonth()
{
    //if month slected display month title
}

//////////////////////////////////////////////////////////
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

        localStorage.setItem("expenses", JSON.stringify(expenses));

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


////////////////////////////////////////////////////////////


const dropdownStart = document.querySelector<HTMLSelectElement>('#start');
const dropdownEnd = document.querySelector<HTMLSelectElement>('#end');

dropdownStart?.addEventListener("change", () => {
    const selectedStart = dropdownStart.value;
});

dropdownEnd?.addEventListener("change", () => {
    const selectedEnd = dropdownEnd.value;
});



///////////////////////////////////////////////


const setBudgetList = document.getElementById("set-expense-list");

function displaySetExpenses() {

    if (!setBudgetList) return;

    setBudgetList.innerHTML = "";

    expenses.forEach(expense => {

        const setCategory = document.createElement("div");
        setCategory.classList.add("set-expense-category");

        setCategory.innerHTML = `
            <div class="set-top">
                <span>${expense.category}</span>
                <span class="set-amount">${expense.budget}</span>
            </div>
        `;

        setBudgetList.appendChild(setCategory);
    });
}

displaySetExpenses();


///////////////////////////////////////////

const editSetCategory = document.querySelector("#edit-set-category");

let doneSetEditing =false;

editSetCategory?.addEventListener("click", () => {

    const amounts = document.querySelectorAll<HTMLElement>(".set-amount");

    if (!doneSetEditing) {

        amounts.forEach((amount, index) => {

            const input = document.createElement("input");

            input.type = "number";
            input.value = String(expenses[index].budget);
            input.classList.add("set-amount");

            amount.replaceWith(input);
        });

        editSetCategory.textContent = "Save";
        doneSetEditing = true;

    } else {

        const inputs = document.querySelectorAll<HTMLInputElement>(".set-amount");

        inputs.forEach((input, index) => {

            expenses[index].budget = Number(input.value);
        });

        localStorage.setItem("expenses", JSON.stringify(expenses));

        displayExpenses();

        const updatedData = expenses.map(expense => ({
            category: expense.category,
            value: expense.budget
        }));

        update(updatedData);

        editSetCategory.textContent = "Edit";
        doneSetEditing = false;
    }
});


///////////////////////////////////////////


const saveBudgetButton = document.getElementById("save-budget");

saveBudgetButton?.addEventListener("click", () => {
    if(!setBudgetList) return;

    
});



///////////////////////////////////////////

const addBudgetCategory = document.getElementById("set-add");

addBudgetCategory?.addEventListener("click", () => {

    const setCategory = document.createElement("div");
    setCategory.classList.add("set-expense-category");

    setCategory.innerHTML = `
        <select class="category-select">
            <option value="">--Choose a category--</option>
            <option value="rent">rent</option>
        </select>

        <input
            type="number"
            class="new-category-budget"
            placeholder="Budget"
            min="0"
        >
    `

    setBudgetList?.appendChild(setCategory);

});

////////////////////////////////////////////////////////////////

const saveSetCategoryAmount = document.getElementById("save-category-budget");

saveSetCategoryAmount?.addEventListener("click", () => {

});