import data from "./transactions.json";

type Expense = {
    t_date: string;
    title: string;
    amount: number;
    currency: string;
    description: string;
};

function renderExpensePage(): void {
    const expenses: Expense[] = [];
    const monthlyBudgetJPY = 10_000_000;

    for (const transaction of data.transactions) {
        if (transaction.t_type === "expense") {
            let description = "";

            if ("description" in transaction && typeof transaction.description === "string") {
                description = transaction.description;
            }

            expenses.push({
                t_date: transaction.t_date,
                title: transaction.title.trim(),
                amount: transaction.amount,
                currency: transaction.currency.trim().toUpperCase(),
                description: description
            });
        }
    }

    // Navigation
    const header = document.createElement("header");

    header.innerHTML = `
        <nav class="topbar">
            <a class="brand" href="budgetingapppage.html">Budgeting</a>

            <span class="app-title">
                <span>Budgeting App</span>
                <span>Split</span>
            </span>

            <details class="account">
                <summary>Account</summary>
                <div class="account-panel">Guest account</div>
            </details>
        </nav>
    `;

    // Overview and expense table
    const main = document.createElement("main");
    main.className = "income-page";

    main.innerHTML = `
        <div class="overview">
            <section class="expense">
                <h1></h1>
            </section>

            <section class="monthly-budget-left"></section>
        </div>

        <section class="recent-transactions">
            <div class="transaction-toolbar expense-toolbar">
                <button type="button" disabled>Sort</button>
                <button type="button" disabled>Filter</button>
                <button type="button" id="new-expense">New</button>
            </div>

            <table class="expense-table" aria-label="Expenses">
                <thead>
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Title</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Details</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </section>
    `;

    const expenseTitle = main.querySelector("h1")!;
    const monthlyBudgetLeft = main.querySelector(".monthly-budget-left")!;
    const tableBody = main.querySelector("tbody")!;
    const newButton = main.querySelector("#new-expense")!;

    // New and Edit popup
    const popup = document.createElement("dialog");
    popup.className = "transaction-popup";
    popup.setAttribute("aria-labelledby", "expense-popup-title");

    popup.innerHTML = `
        <form>
            <h2 id="expense-popup-title">New Expense</h2>

            <label>
                Title
                <input name="title" type="text" list="expense-titles"
                       placeholder="e.g. Groceries" required>
            </label>
            <datalist id="expense-titles"></datalist>

            <label>
                Description
                <textarea name="description" rows="3"
                          placeholder="Add a note (optional)"></textarea>
            </label>

            <div class="popup-amount-row">
                <label>
                    Amount
                    <input name="amount" type="text" inputmode="numeric"
                           pattern="0*[1-9][0-9]*"
                           title="Enter a whole number greater than 0" required>
                </label>

                <label>
                    Currency
                    <select name="currency">
                        <option value="JPY">JPY (¥)</option>
                        <option value="USD">USD ($)</option>
                    </select>
                </label>
            </div>

            <label>
                Date
                <input name="date" type="date" required>
            </label>

            <div class="popup-actions">
                <button type="button">Cancel</button>
                <button type="submit">Add</button>
            </div>
        </form>
    `;

    const form = popup.querySelector("form")!;
    const popupTitle = form.querySelector("h2")!;
    const titleInput = form.querySelector<HTMLInputElement>('[name="title"]')!;
    const titleSuggestions = form.querySelector("datalist")!;
    const descriptionInput = form.querySelector("textarea")!;
    const amountInput = form.querySelector<HTMLInputElement>('[name="amount"]')!;
    const currencySelect = form.querySelector("select")!;
    const dateInput = form.querySelector<HTMLInputElement>('[name="date"]')!;
    const cancelButton = form.querySelector<HTMLButtonElement>('button[type="button"]')!;
    const saveButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    let editingExpense: Expense | null = null;

    function formatAmount(amount: number, currency: string): string {
        return `${amount.toLocaleString("en-US")} ${currency}`;
    }

    function updateOverview(): void {
        const totals = new Map<string, number>();
        totals.set("JPY", 0);

        for (const expense of expenses) {
            const previousTotal = totals.get(expense.currency) ?? 0;
            totals.set(expense.currency, previousTotal + expense.amount);
        }

        const amounts: string[] = [];

        totals.forEach((amount, currency) => {
            amounts.push(formatAmount(amount, currency));
        });

        expenseTitle.textContent = `Expense: ${amounts.join(" / ")}`;

        const remainingBudget = monthlyBudgetJPY - (totals.get("JPY") ?? 0);
        monthlyBudgetLeft.textContent =
            `Monthly Budget Left\n${formatAmount(remainingBudget, "JPY")}`;
    }

    function openPopup(expense: Expense | null): void {
        editingExpense = expense;
        form.reset();
        amountInput.setCustomValidity("");

        if (expense) {
            popupTitle.textContent = "Edit Expense";
            saveButton.textContent = "Save";
            titleInput.value = expense.title;
            descriptionInput.value = expense.description;
            amountInput.value = String(expense.amount);

            if (!Array.from(currencySelect.options).some(option => option.value === expense.currency)) {
                currencySelect.add(new Option(expense.currency, expense.currency));
            }

            currencySelect.value = expense.currency;
            dateInput.value = expense.t_date;
        } else {
            popupTitle.textContent = "New Expense";
            saveButton.textContent = "Add";
        }

        popup.showModal();
    }

    function renderTable(): void {
        tableBody.replaceChildren();
        titleSuggestions.replaceChildren();

        const titles = new Set<string>();

        for (const expense of expenses) {
            titles.add(expense.title);

            const row = tableBody.insertRow();
            row.insertCell().textContent = expense.t_date;
            row.insertCell().textContent = expense.title;
            row.insertCell().textContent = formatAmount(expense.amount, expense.currency);

            const detailsButton = document.createElement("button");
            detailsButton.type = "button";
            detailsButton.className = "expense-details-button";
            detailsButton.textContent = "•••";
            detailsButton.setAttribute("aria-label", `Edit ${expense.title}, ${expense.t_date}`);
            detailsButton.addEventListener("click", () => openPopup(expense));

            row.insertCell().append(detailsButton);
        }

        titles.forEach(title => {
            titleSuggestions.append(new Option(title, title));
        });

        if (expenses.length === 0) {
            const cell = tableBody.insertRow().insertCell();
            cell.colSpan = 4;
            cell.textContent = "No expenses yet.";
        }
    }

    newButton.addEventListener("click", () => openPopup(null));
    cancelButton.addEventListener("click", () => popup.close());
    amountInput.addEventListener("input", () => amountInput.setCustomValidity(""));

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const amount = Number(amountInput.value);

        if (title === "") {
            titleInput.value = "";
            titleInput.reportValidity();
            return;
        }

        if (!Number.isSafeInteger(amount) || amount <= 0) {
            amountInput.setCustomValidity("Enter a valid positive whole number.");
            amountInput.reportValidity();
            return;
        }

        const values: Expense = {
            t_date: dateInput.value,
            title: title,
            amount: amount,
            currency: currencySelect.value,
            description: descriptionInput.value.trim()
        };

        if (editingExpense) {
            Object.assign(editingExpense, values);
        } else {
            expenses.unshift(values);
        }

        updateOverview();
        renderTable();
        popup.close();
    });

    document.body.append(header, main, popup);
    updateOverview();
    renderTable();
}

renderExpensePage();