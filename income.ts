import data from "./transactions.json";

type Income = {
    t_date: string;
    title: string;
    amount: number;
    currency: string;
    description: string;
};

function renderIncomePage(): void {
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

    // Load income and calculate the remaining JPY budget
    const incomes: Income[] = [];
    const monthlyBudgetJPY = 10_000_000;
    let totalExpenseJPY = 0;
    // data will come from backend

    for (const transaction of data.transactions) {
        const currency = transaction.currency.trim().toUpperCase();

        if (transaction.t_type === "expense" && currency === "JPY") {
            totalExpenseJPY += transaction.amount;
        }

        if (transaction.t_type !== "income") {
            continue;
        }

        incomes.push({
            t_date: transaction.t_date,
            title: transaction.title.trim(),
            amount: transaction.amount,
            currency,
            description:
                "description" in transaction && typeof transaction.description === "string"
                    ? transaction.description
                    : ""
        });
    }

    // Overview
    const main = document.createElement("main");
    main.className = "income-page";

    const overview = document.createElement("div");
    overview.className = "overview";

    const monthlyIncome = document.createElement("section");
    monthlyIncome.className = "income";

    const incomeTitle = document.createElement("h1");
    monthlyIncome.append(incomeTitle);

    const monthlyBudgetLeft = document.createElement("section");
    monthlyBudgetLeft.className = "monthly-budget-left";

    overview.append(monthlyIncome, monthlyBudgetLeft);

    function formatAmount(amount: number, currency: string): string {
        return `${amount.toLocaleString("en-US")} ${currency}`;
    }

    const remainingBudget = monthlyBudgetJPY - totalExpenseJPY;
    monthlyBudgetLeft.textContent =
        `Monthly Budget Left\n${formatAmount(remainingBudget, "JPY")}`;

    function updateIncomeTotal(): void {
        const totals = new Map<string, number>([["JPY", 0]]);

        for (const income of incomes) {
            const previousTotal = totals.get(income.currency) ?? 0;
            totals.set(income.currency, previousTotal + income.amount);
        }

        const amounts: string[] = [];
        totals.forEach((amount, currency) => {
            amounts.push(formatAmount(amount, currency));
        });

        incomeTitle.textContent = `Income: ${amounts.join(" / ")}`;
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
                <option value="title">Title A-Z</option>
                <option value="lowest">Amount: low to high</option>
                <option value="highest">Amount: high to low</option>
            </select>

            <button type="button">New</button>
        </div>

        <table class="expense-table" aria-label="Income transactions">
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

    // New income and details popup
    const popup = document.createElement("dialog");
    popup.className = "transaction-popup";
    popup.setAttribute("aria-labelledby", "income-popup-title");

    popup.innerHTML = `
        <form>
            <h2 id="income-popup-title">New Income</h2>

            <label>
                Title
                <input name="title" type="text" list="income-titles"
                       placeholder="e.g. Salary" required>
            </label>
            <datalist id="income-titles"></datalist>

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

    let editingIncome: Income | null = null;

    function updateTitleOptions(): void {
        const selectedTitle = titleFilter.value;
        const titles = new Map<string, string>();

        for (const title of ["Salary", "Freelance", "Scholarship", "Allowance", "Gift"]) {
            titles.set(title.toLowerCase(), title);
        }

        for (const income of incomes) {
            const key = income.title.toLowerCase();
            if (!titles.has(key)) {
                titles.set(key, income.title);
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

    function openPopup(income: Income | null): void {
        editingIncome = income;
        form.reset();
        amountInput.setCustomValidity("");

        if (income) {
            popupTitle.textContent = "Income Details";
            saveButton.textContent = "Save Changes";

            titleInput.value = income.title;
            descriptionInput.value = income.description;
            amountInput.value = String(income.amount);
            currencySelect.value = income.currency;
            dateInput.value = income.t_date;
        } else {
            popupTitle.textContent = "New Income";
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

        const visibleIncomes = incomes.filter((income) => {
            const title = income.title.toLowerCase();
            const text = [
                income.t_date,
                title,
                income.amount,
                formatAmount(income.amount, income.currency)
            ].join(" ").toLowerCase();

            return (!titleFilter.value || title === titleFilter.value)
                && text.includes(search);
        });

        visibleIncomes.sort((a, b) => {
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

        for (const income of visibleIncomes) {
            const row = tableBody.insertRow();

            row.insertCell().textContent = income.t_date;
            row.insertCell().textContent = income.title;
            row.insertCell().textContent = formatAmount(income.amount, income.currency);

            const detailsButton = document.createElement("button");
            detailsButton.type = "button";
            detailsButton.className = "expense-details-button";
            detailsButton.textContent = "•••";
            detailsButton.setAttribute("aria-label", `Edit ${income.title}, ${income.t_date}`);
            detailsButton.addEventListener("click", () => openPopup(income));

            row.insertCell().append(detailsButton);
        }

        if (visibleIncomes.length === 0) {
            const cell = tableBody.insertRow().insertCell();
            cell.colSpan = 4;
            cell.textContent = "No matching income transactions.";
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

        const values: Income = {
            t_date: dateInput.value,
            title,
            amount,
            currency: currencySelect.value,
            description: descriptionInput.value.trim()
        };

        if (editingIncome) {
            Object.assign(editingIncome, values);
        } else {
            incomes.unshift(values);
        }

        updateTitleOptions();
        updateIncomeTotal();
        renderTable();
        popup.close();
    });

    updateTitleOptions();
    updateIncomeTotal();
    renderTable();

    main.append(overview, transactions);
    document.body.append(header, main, popup);
}

renderIncomePage();