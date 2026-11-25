import data from "./transactions.json";

type Expense = {
    t_date: string;
    title: string;
    amount: number;
    currency: string;
    description: string;
};

function renderExpensePage(): void {
    // Navigation
    const header = document.createElement("header");

    const navbar = document.createElement("nav");
    navbar.className = "topbar";

    const homeLink = document.createElement("a");
    homeLink.className = "brand";
    homeLink.href = "mainpage.html";
    homeLink.textContent = "Budgeting";

    const appTitle = document.createElement("span");
    appTitle.className = "app-title";

    const budgetingTab = document.createElement("span");
    budgetingTab.textContent = "Budgeting App";

    const splitTab = document.createElement("span");
    splitTab.textContent = "Split";

    appTitle.append(budgetingTab, splitTab);

    const accountMenu = document.createElement("details");
    accountMenu.className = "account";

    const accountLabel = document.createElement("summary");
    accountLabel.textContent = "Account";

    const accountPanel = document.createElement("div");
    accountPanel.className = "account-panel";
    accountPanel.textContent = "Guest account";

    accountMenu.append(accountLabel, accountPanel);
    navbar.append(homeLink, appTitle, accountMenu);
    header.append(navbar);

    // Load expenses
    const expenses: Expense[] = [];

    for (const transaction of data.transactions) {
        if (transaction.t_type !== "expense") {
            continue;
        }

        expenses.push({
            t_date: transaction.t_date,
            title: transaction.title.trim(),
            amount: transaction.amount,
            currency: transaction.currency.trim().toUpperCase(),
            description:
                "description" in transaction && typeof transaction.description === "string"
                    ? transaction.description
                    : ""
        });
    }

    // Overview
    const monthlyBudgetJPY = 10_000_000;

    const main = document.createElement("main");
    main.className = "income-page";

    const overview = document.createElement("div");
    overview.className = "overview";

    const monthlyExpense = document.createElement("section");
    monthlyExpense.className = "expense";

    const expenseTitle = document.createElement("h1");
    monthlyExpense.append(expenseTitle);

    const monthlyBudgetLeft = document.createElement("section");
    monthlyBudgetLeft.className = "monthly-budget-left";

    overview.append(monthlyExpense, monthlyBudgetLeft);

    function formatAmount(amount: number, currency: string): string {
        return `${amount.toLocaleString("en-US")} ${currency}`;
    }

    function updateOverview(): void {
        const totals = new Map<string, number>([["JPY", 0]]);

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

    // Search, filters and transaction table
    const transactions = document.createElement("section");
    transactions.className = "recent-transactions";

    transactions.innerHTML = `
        <div class="transaction-toolbar expense-toolbar">
            <input type="search" placeholder="Search transactions" aria-label="Search transactions">

            <select name="title-filter" aria-label="Filter by title"></select>

            <select name="sort" aria-label="Sort transactions">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
                <option value="lowest">Amount: low to high</option>
                <option value="highest">Amount: high to low</option>
            </select>

            <button type="button">New</button>
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
    `;

    const searchInput = transactions.querySelector<HTMLInputElement>('input[type="search"]')!;
    const titleFilter = transactions.querySelector<HTMLSelectElement>('[name="title-filter"]')!;
    const sortSelect = transactions.querySelector<HTMLSelectElement>('[name="sort"]')!;
    const newButton = transactions.querySelector("button")!;
    const tableBody = transactions.querySelector("tbody")!;

    // One popup for both New and Details
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
    const popupTitle = popup.querySelector("h2")!;
    const titleInput = form.querySelector<HTMLInputElement>('[name="title"]')!;
    const titleSuggestions = form.querySelector("datalist")!;
    const descriptionInput = form.querySelector<HTMLTextAreaElement>('[name="description"]')!;
    const amountInput = form.querySelector<HTMLInputElement>('[name="amount"]')!;
    const currencySelect = form.querySelector<HTMLSelectElement>('[name="currency"]')!;
    const dateInput = form.querySelector<HTMLInputElement>('[name="date"]')!;
    const cancelButton = form.querySelector<HTMLButtonElement>('button[type="button"]')!;
    const saveButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    let editingExpense: Expense | null = null;

    // Use the same titles in the filter and in the popup suggestions.
    function updateTitleOptions(): void {
        const selectedTitle = titleFilter.value;
        const titles = new Map<string, string>();

        for (const title of ["Groceries", "Rent", "Transport", "Coffee", "Dinner"]) {
            titles.set(title.toLowerCase(), title);
        }

        for (const expense of expenses) {
            const key = expense.title.toLowerCase();
            if (!titles.has(key)) {
                titles.set(key, expense.title);
            }
        }

        const sortedTitles = Array.from(titles.values()).sort((a, b) =>
            a.localeCompare(b)
        );

        titleFilter.replaceChildren(new Option("All titles", ""));
        titleSuggestions.replaceChildren();

        for (const title of sortedTitles) {
            titleFilter.add(new Option(title, title.toLowerCase()));
            titleSuggestions.append(new Option(title, title));
        }

        titleFilter.value = titles.has(selectedTitle) ? selectedTitle : "";
    }

    function openPopup(expense: Expense | null): void {
        editingExpense = expense;
        form.reset();
        amountInput.setCustomValidity("");

        if (expense) {
            popupTitle.textContent = "Expense Details";
            saveButton.textContent = "Save Changes";

            titleInput.value = expense.title;
            descriptionInput.value = expense.description;
            amountInput.value = String(expense.amount);
            currencySelect.value = expense.currency;
            dateInput.value = expense.t_date;
        } else {
            popupTitle.textContent = "New Expense";
            saveButton.textContent = "Add";

            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const day = String(today.getDate()).padStart(2, "0");
            dateInput.value = `${today.getFullYear()}-${month}-${day}`;
        }

        popup.showModal();
        titleInput.focus();
    }

    function renderTable(): void {
        const search = searchInput.value.trim().toLowerCase();

        const visibleExpenses = expenses.filter((expense) => {
            const title = expense.title.toLowerCase();
            const text = [
                expense.t_date,
                title,
                expense.amount,
                formatAmount(expense.amount, expense.currency)
            ].join(" ").toLowerCase();

            return (!titleFilter.value || title === titleFilter.value)
                && text.includes(search);
        });

        visibleExpenses.sort((a, b) => {
            switch (sortSelect.value) {
                case "oldest":
                    return a.t_date.localeCompare(b.t_date);
                case "title":
                    return a.title.localeCompare(b.title);
                case "lowest":
                    return a.currency.localeCompare(b.currency) || a.amount - b.amount;
                case "highest":
                    return a.currency.localeCompare(b.currency) || b.amount - a.amount;
                default:
                    return b.t_date.localeCompare(a.t_date);
            }
        });

        tableBody.replaceChildren();

        for (const expense of visibleExpenses) {
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

        if (visibleExpenses.length === 0) {
            const cell = tableBody.insertRow().insertCell();
            cell.colSpan = 4;
            cell.textContent = "No matching expenses.";
        }
    }

    // Events
    searchInput.addEventListener("input", renderTable);
    titleFilter.addEventListener("change", renderTable);
    sortSelect.addEventListener("change", renderTable);

    newButton.addEventListener("click", () => openPopup(null));
    cancelButton.addEventListener("click", () => popup.close());
    amountInput.addEventListener("input", () => amountInput.setCustomValidity(""));

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        if (!title) {
            titleInput.value = "";
            titleInput.reportValidity();
            return;
        }

        const amount = Number(amountInput.value);
        if (!Number.isSafeInteger(amount) || amount <= 0) {
            amountInput.setCustomValidity("Enter a valid positive whole number.");
            amountInput.reportValidity();
            return;
        }

        const values: Expense = {
            t_date: dateInput.value,
            title,
            amount,
            currency: currencySelect.value,
            description: descriptionInput.value.trim()
        };

        if (editingExpense) {
            Object.assign(editingExpense, values);
        } else {
            expenses.unshift(values);
        }

        updateTitleOptions();
        updateOverview();
        renderTable();
        popup.close();
    });

    updateTitleOptions();
    updateOverview();
    renderTable();

    main.append(overview, transactions);
    document.body.append(header, main, popup);
}

renderExpensePage();