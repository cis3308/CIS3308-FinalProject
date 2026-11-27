import data from "./transactions.json";

type Income = {
    t_date: string;
    title: string;
    amount: number;
    currency: string;
    description: string;
};

function renderIncomePage(): void {
    const incomes: Income[] = [];
    const monthlyBudgetJPY = 10_000_000;

    for (const item of data.transactions) {
        if (item.t_type !== "income") {
            continue;
        }

        let description = "";

        if ("description" in item && typeof item.description === "string") {
            description = item.description;
        }

        incomes.push({
            t_date: item.t_date,
            title: item.title.trim(),
            amount: item.amount,
            currency: item.currency.trim().toUpperCase(),
            description
        });
    }

    function getToday(): string {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${today.getFullYear()}-${month}-${day}`;
    }

    function formatAmount(amount: number, currency: string): string {
        return `${amount.toLocaleString("en-US")} ${currency}`;
    }

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

    const main = document.createElement("main");
    main.className = "income-page";
    main.innerHTML = `
        <div class="overview">
            <section class="income"><h1></h1></section>
            <section class="monthly-budget-left"></section>
        </div>

        <section class="recent-transactions">
            <div class="transaction-toolbar expense-toolbar">
                <label>
                    Month
                    <input type="month" name="month" required>
                </label>

                <select aria-label="Filter by title" disabled>
                    <option>All titles</option>
                </select>

                <select aria-label="Sort transactions" disabled>
                    <option>Sort by</option>
                    <option>Newest first</option>
                    <option>Oldest first</option>
                    <option>Title A–Z</option>
                    <option>Amount: low to high</option>
                    <option>Amount: high to low</option>
                </select>

                <button type="button" id="new-income">New</button>
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
        </section>
    `;

    const monthInput = main.querySelector<HTMLInputElement>('[name="month"]')!;
    const incomeTitle = main.querySelector("h1")!;
    const budgetLeft = main.querySelector(".monthly-budget-left")!;
    const tableBody = main.querySelector("tbody")!;
    const newButton = main.querySelector("#new-income")!;

    monthInput.value = getToday().slice(0, 7);

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
    const popupTitle = form.querySelector("h2")!;
    const titleInput = form.querySelector<HTMLInputElement>('[name="title"]')!;
    const titleSuggestions = form.querySelector("datalist")!;
    const descriptionInput = form.querySelector("textarea")!;
    const amountInput = form.querySelector<HTMLInputElement>('[name="amount"]')!;
    const currencySelect = form.querySelector("select")!;
    const dateInput = form.querySelector<HTMLInputElement>('[name="date"]')!;
    const cancelButton = form.querySelector<HTMLButtonElement>('button[type="button"]')!;
    const saveButton = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    let editingIncome: Income | null = null;

    function openPopup(income: Income | null): void {
        editingIncome = income;
        form.reset();
        amountInput.setCustomValidity("");

        const titles = new Set(["Salary", "Freelance", "Scholarship", "Allowance", "Gift"]);
        for (const item of incomes) {
            titles.add(item.title);
        }

        titleSuggestions.replaceChildren();
        titles.forEach(title => titleSuggestions.append(new Option(title, title)));

        if (income) {
            popupTitle.textContent = "Income Details";
            saveButton.textContent = "Save Changes";
            titleInput.value = income.title;
            descriptionInput.value = income.description;
            amountInput.value = String(income.amount);
            currencySelect.value = income.currency;

            if (currencySelect.value === "") {
                currencySelect.add(new Option(income.currency, income.currency));
                currencySelect.value = income.currency;
            }

            dateInput.value = income.t_date;
        } else {
            popupTitle.textContent = "New Income";
            saveButton.textContent = "Add";

            const today = getToday();
            dateInput.value = today.startsWith(monthInput.value)
                ? today
                : `${monthInput.value}-01`;
        }

        popup.showModal();
        titleInput.focus();
    }

    function renderMonth(): void {
        const selectedMonth = monthInput.value;
        const totals = new Map<string, number>([["JPY", 0]]);
        tableBody.replaceChildren();

        for (const income of incomes) {
            if (income.t_date.slice(0, 7) !== selectedMonth) {
                continue;
            }

            const previousTotal = totals.get(income.currency) ?? 0;
            totals.set(income.currency, previousTotal + income.amount);

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

        if (tableBody.rows.length === 0) {
            const cell = tableBody.insertRow().insertCell();
            cell.colSpan = 4;
            cell.textContent = "No income transactions for this month.";
        }

        const amounts: string[] = [];
        totals.forEach((amount, currency) => {
            amounts.push(formatAmount(amount, currency));
        });
        incomeTitle.textContent = `Income: ${amounts.join(" / ")}`;

        // The remaining budget uses the selected month's JPY expenses.
        let spentJPY = 0;

        for (const item of data.transactions) {
            if (
                item.t_type === "expense" &&
                item.currency.trim().toUpperCase() === "JPY" &&
                item.t_date.slice(0, 7) === selectedMonth
            ) {
                spentJPY += item.amount;
            }
        }

        budgetLeft.textContent =
            `Monthly Budget Left\n${formatAmount(monthlyBudgetJPY - spentJPY, "JPY")}`;
    }

    monthInput.addEventListener("change", () => {
        if (!monthInput.value) {
            monthInput.value = getToday().slice(0, 7);
        }
        renderMonth();
    });

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

        monthInput.value = values.t_date.slice(0, 7);
        renderMonth();
        popup.close();
    });

    document.body.append(header, main, popup);
    renderMonth();
}

renderIncomePage();