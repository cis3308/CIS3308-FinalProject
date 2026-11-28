import data from "./transactions.json";
import {logout} from './src/supabaseClient'

type Expense = {
    id?: string | number;
    t_date: string;
    title: string;
    category?: string;
    amount: number;
    currency: string;
    description?: string;
};

function renderExpensePage(): void {
    // call backend
    const expenses: Expense[] = data.transactions.filter(item => item.t_type === "expense");

    const categories: string[] = []; // call backend
    const monthlyBudgetJPY = 10_000_000; // call backend
    const yenPerDollar = 150; // call backend

    function getToday(): string {
        const today = new Date();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${today.getFullYear()}-${month}-${day}`;
    }

    function formatAmount(amount: number, currency: string): string {
        const number = amount.toLocaleString("en-US", {
            maximumFractionDigits: currency === "JPY" ? 0 : 2
        });

        return `${number} ${currency}`;
    }

    let selectedMonth = getToday().slice(0, 7);
    let editingExpense: Expense | null = null;

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
    const logout_btn=document.createElement('button')
    logout_btn.textContent='logout'
    logout_btn.onclick=logout
    accountMenu.append(accountLabel, accountPanel,logout_btn);
    navbar.append(homeLink, appTitle, accountMenu,logout_btn);
    header.append(navbar);

    // Month
    const main = document.createElement("main");
    main.className = "income-page";

    const monthControls = document.createElement("div");
    monthControls.className = "month-controls";

    const previousMonth = document.createElement("button");
    previousMonth.type = "button";
    previousMonth.id = "previous-month";
    previousMonth.textContent = "←";
    previousMonth.setAttribute("aria-label", "Previous month");

    const monthLabel = document.createElement("strong");
    monthLabel.id = "selected-month";

    const nextMonth = document.createElement("button");
    nextMonth.type = "button";
    nextMonth.id = "next-month";
    nextMonth.textContent = "→";
    nextMonth.setAttribute("aria-label", "Next month");

    monthControls.append(previousMonth, monthLabel, nextMonth);

    // Expense and budget
    const overview = document.createElement("div");
    overview.className = "overview";

    const expenseSection = document.createElement("section");
    expenseSection.className = "expense";

    const expenseTotal = document.createElement("h1");
    expenseTotal.id = "expense-total";

    const chartArea = document.createElement("div");
    chartArea.id = "expense-chart";
    chartArea.style.minHeight = "120px";

    expenseSection.append(expenseTotal, chartArea);

    const budgetSection = document.createElement("section");
    budgetSection.className = "monthly-budget-left";

    const budgetTitle = document.createElement("div");
    budgetTitle.textContent = "Monthly Budget Left";

    const budgetJPY = document.createElement("strong");
    budgetJPY.id = "budget-jpy";

    const budgetUSD = document.createElement("strong");
    budgetUSD.id = "budget-usd";

    budgetSection.append(budgetTitle, budgetJPY, budgetUSD);
    overview.append(expenseSection, budgetSection);

    // Filters and New button
    const recentSection = document.createElement("section");
    recentSection.className = "recent-transactions";

    const toolbar = document.createElement("div");
    toolbar.className = "transaction-toolbar expense-toolbar";

    const titleFilter = document.createElement("select");
    titleFilter.setAttribute("aria-label", "Filter by title");
    titleFilter.add(new Option("All titles", ""));
    titleFilter.disabled = true;

    const categoryFilter = document.createElement("select");
    categoryFilter.id = "category-filter";
    categoryFilter.setAttribute("aria-label", "Filter by category");
    categoryFilter.add(new Option("All categories", ""));
    categoryFilter.disabled = categories.length === 0;

    const sortSelect = document.createElement("select");
    sortSelect.setAttribute("aria-label", "Sort transactions");
    sortSelect.disabled = true;

    const sortOptions = [
        "Sort by",
        "Newest first",
        "Oldest first",
        "Title A–Z",
        "Amount: low to high",
        "Amount: high to low"
    ];

    for (const option of sortOptions) {
        sortSelect.add(new Option(option, option));
    }

    const newButton = document.createElement("button");
    newButton.type = "button";
    newButton.id = "new-expense";
    newButton.textContent = "New";

    toolbar.append(titleFilter, categoryFilter, sortSelect, newButton);

    // Expense table
    const table = document.createElement("table");
    table.className = "expense-table";
    table.setAttribute("aria-label", "Expense transactions");

    const tableHead = document.createElement("thead");
    const headingRow = document.createElement("tr");

    for (const heading of ["Date", "Title", "Category", "Amount", "Details"]) {
        const column = document.createElement("th");
        column.scope = "col";
        column.textContent = heading;
        headingRow.append(column);
    }

    const tableBody = document.createElement("tbody");

    tableHead.append(headingRow);
    table.append(tableHead, tableBody);
    recentSection.append(toolbar, table);
    main.append(monthControls, overview, recentSection);

    // Popup
    const popup = document.createElement("dialog");
    popup.className = "transaction-popup";
    popup.setAttribute("aria-labelledby", "expense-popup-title");

    const form = document.createElement("form");

    const popupTitle = document.createElement("h2");
    popupTitle.id = "expense-popup-title";

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Date";

    const dateInput = document.createElement("input");
    dateInput.name = "date";
    dateInput.type = "date";
    dateInput.required = true;
    dateLabel.append(dateInput);

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title";

    const titleInput = document.createElement("input");
    titleInput.name = "title";
    titleInput.type = "text";
    titleInput.placeholder = "e.g. Groceries";
    titleInput.required = true;
    titleInput.setAttribute("list", "expense-titles");
    titleLabel.append(titleInput);

    const titleSuggestions = document.createElement("datalist");
    titleSuggestions.id = "expense-titles";

    const categoryLabel = document.createElement("label");
    categoryLabel.textContent = "Category";

    const categorySelect = document.createElement("select");
    categorySelect.name = "category";
    categorySelect.add(new Option("Select category", ""));
    categorySelect.disabled = categories.length === 0;
    categoryLabel.append(categorySelect);

    for (const category of categories) {
        categoryFilter.add(new Option(category, category));
        categorySelect.add(new Option(category, category));
    }

    const amountRow = document.createElement("div");
    amountRow.className = "popup-amount-row";

    const amountLabel = document.createElement("label");
    amountLabel.textContent = "Amount";

    const amountInput = document.createElement("input");
    amountInput.name = "amount";
    amountInput.type = "text";
    amountInput.inputMode = "numeric";
    amountInput.pattern = "0*[1-9][0-9]*";
    amountInput.title = "Enter a whole number greater than 0";
    amountInput.required = true;
    amountLabel.append(amountInput);

    const currencyLabel = document.createElement("label");
    currencyLabel.textContent = "Currency";

    const currencySelect = document.createElement("select");
    currencySelect.name = "currency";
    currencySelect.add(new Option("JPY (¥)", "JPY"));
    currencySelect.add(new Option("USD ($)", "USD"));
    currencyLabel.append(currencySelect);

    amountRow.append(amountLabel, currencyLabel);

    const convertedAmount = document.createElement("output");
    convertedAmount.id = "converted-amount";

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description";

    const descriptionInput = document.createElement("textarea");
    descriptionInput.name = "description";
    descriptionInput.rows = 3;
    descriptionInput.placeholder = "Add a note (optional)";
    descriptionLabel.append(descriptionInput);

    const popupActions = document.createElement("div");
    popupActions.className = "popup-actions";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "cancel-expense";
    cancelButton.textContent = "Cancel";

    const saveButton = document.createElement("button");
    saveButton.type = "submit";

    popupActions.append(cancelButton, saveButton);
    form.append(
        popupTitle,
        dateLabel,
        titleLabel,
        titleSuggestions,
        categoryLabel,
        amountRow,
        convertedAmount,
        descriptionLabel,
        popupActions
    );

    popup.append(form);

    function updateConversion(): void {
        const amount = Number(amountInput.value);
        convertedAmount.textContent = "";

        if (!Number.isFinite(amount) || amount <= 0) return;

        if (currencySelect.value === "JPY") {
            convertedAmount.textContent = "≈ " + formatAmount(amount / yenPerDollar, "USD");
        } else if (currencySelect.value === "USD") {
            convertedAmount.textContent = "≈ " + formatAmount(amount * yenPerDollar, "JPY");
        }
    }

    function openPopup(expense: Expense | null): void {
        editingExpense = expense;
        form.reset();
        amountInput.setCustomValidity("");

        titleSuggestions.replaceChildren();
        const titles = new Set<string>();

        for (const item of expenses) {
            titles.add(item.title.trim());
        }

        titles.forEach(title => titleSuggestions.append(new Option(title, title)));

        if (expense) {
            popupTitle.textContent = "Expense Details";
            saveButton.textContent = "Save Changes";

            dateInput.value = expense.t_date;
            titleInput.value = expense.title.trim();
            amountInput.value = String(expense.amount);
            descriptionInput.value = expense.description || "";

            const currency = expense.currency.trim().toUpperCase();
            currencySelect.value = currency;

            if (!currencySelect.value) {
                currencySelect.add(new Option(currency, currency));
                currencySelect.value = currency;
            }

            if (expense.category && categories.includes(expense.category)) {
                categorySelect.value = expense.category;
            }
        } else {
            popupTitle.textContent = "New Expense";
            saveButton.textContent = "Add";

            const today = getToday();
            dateInput.value = today.startsWith(selectedMonth)
                ? today
                : `${selectedMonth}-01`;

            categorySelect.value = categoryFilter.value;
            currencySelect.value = "JPY";
        }

        updateConversion();
        popup.showModal();
        titleInput.focus();
    }

    function renderMonth(): void {
        const [year, month] = selectedMonth.split("-");
        monthLabel.textContent = `${month} / ${year}`;
        tableBody.replaceChildren();

        let totalJPY = 0;

        // call backend
        for (const expense of expenses) {
            if (expense.t_date.slice(0, 7) !== selectedMonth) continue;

            const currency = expense.currency.trim().toUpperCase();

            if (currency === "JPY") {
                totalJPY += expense.amount;
            } else if (currency === "USD") {
                totalJPY += expense.amount * yenPerDollar;
            }

            if (categoryFilter.value && expense.category !== categoryFilter.value) {
                continue;
            }

            const row = document.createElement("tr");

            const dateCell = document.createElement("td");
            dateCell.textContent = expense.t_date;

            const titleCell = document.createElement("td");
            titleCell.textContent = expense.title.trim();

            const categoryCell = document.createElement("td");
            categoryCell.textContent = expense.category || "";

            const amountCell = document.createElement("td");
            amountCell.textContent = formatAmount(expense.amount, currency);

            const detailsCell = document.createElement("td");

            const detailsButton = document.createElement("button");
            detailsButton.type = "button";
            detailsButton.className = "expense-details-button";
            detailsButton.textContent = "•••";
            detailsButton.setAttribute("aria-label", `Details for ${expense.title}`);
            detailsButton.addEventListener("click", () => openPopup(expense));

            detailsCell.append(detailsButton);
            row.append(dateCell, titleCell, categoryCell, amountCell, detailsCell);
            tableBody.append(row);
        }

        if (tableBody.rows.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = 5;
            cell.textContent = categoryFilter.value
                ? "No expenses in this category for this month."
                : "No expenses for this month.";

            row.append(cell);
            tableBody.append(row);
        }

        const spentJPY = formatAmount(totalJPY, "JPY");
        const spentUSD = formatAmount(totalJPY / yenPerDollar, "USD");
        expenseTotal.textContent = `Expense: ${spentJPY} / ${spentUSD}`;

        const remainingJPY = monthlyBudgetJPY - totalJPY;
        budgetJPY.textContent = formatAmount(remainingJPY, "JPY");
        budgetUSD.textContent = formatAmount(remainingJPY / yenPerDollar, "USD");
    }

    function changeMonth(step: number): void {
        const [year, month] = selectedMonth.split("-").map(Number);
        const date = new Date(year, month - 1 + step, 1);
        const newMonth = String(date.getMonth() + 1).padStart(2, "0");

        selectedMonth = `${date.getFullYear()}-${newMonth}`;
        renderMonth();
    }

    previousMonth.addEventListener("click", () => changeMonth(-1));
    nextMonth.addEventListener("click", () => changeMonth(1));
    newButton.addEventListener("click", () => openPopup(null));
    cancelButton.addEventListener("click", () => popup.close());
    categoryFilter.addEventListener("change", renderMonth);
    currencySelect.addEventListener("change", updateConversion);

    amountInput.addEventListener("input", () => {
        amountInput.setCustomValidity("");
        updateConversion();
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const amount = Number(amountInput.value);

        if (!title) {
            titleInput.value = "";
            titleInput.reportValidity();
            return;
        }

        if (!Number.isSafeInteger(amount) || amount <= 0) {
            amountInput.setCustomValidity("Enter a positive whole number.");
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

        if (categorySelect.value) {
            values.category = categorySelect.value;
        }

        if (editingExpense) {
            // call backend
            Object.assign(editingExpense, values);
        } else {
            // call backend
            expenses.unshift(values);
        }

        selectedMonth = values.t_date.slice(0, 7);
        renderMonth();
        popup.close();
    });

    document.body.append(header, main, popup);
    renderMonth();
}

renderExpensePage();