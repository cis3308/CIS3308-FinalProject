import data from "./transactions.json";

type Transaction = {
    t_date: string;
    t_type: string;
    title: string;
    category?: string;
    amount: number;
    currency: string;
    description?: string;
};

function renderMainPage(): void {
    const transactions: Transaction[] = data.transactions; // call backend
    const yenPerDollar = 150; // call backend

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

    // Monthly Budget
    const main = document.createElement("main");

    const overview = document.createElement("div");
    overview.className = "overview";

    const monthlyBudget = document.createElement("section");
    monthlyBudget.className = "monthly-budget";

    const monthlyTitle = document.createElement("h1");
    monthlyTitle.textContent = "Monthly Budget";

    const chartArea = document.createElement("div");
    chartArea.id = "budget-chart";

    monthlyBudget.append(monthlyTitle, chartArea);

    // Budget links
    const budgetLinks = document.createElement("nav");
    budgetLinks.className = "budget-links";

    const income_link = document.createElement("a");
    income_link.className = "budget-link";
    income_link.textContent = "Income";
    income_link.href = "incomepage.html";

    const expense_link = document.createElement("a");
    expense_link.className = "budget-link";
    expense_link.textContent = "Expense";
    expense_link.href = "expensepage.html";

    const budget_link = document.createElement("a");
    budget_link.className = "budget-link";
    budget_link.textContent = "Budget";
    budget_link.href = "BudgetPage.html";

    budgetLinks.append(income_link, expense_link, budget_link);
    overview.append(monthlyBudget, budgetLinks);

    // Recent Transactions
    const recentSection = document.createElement("section");
    recentSection.className = "income-page recent-transactions";

    const transactionsTitle = document.createElement("h2");
    transactionsTitle.textContent = "Recent Transactions";

    const table = document.createElement("table");
    table.className = "expense-table";
    table.setAttribute("aria-label", "Recent Transactions");

    const tableHead = document.createElement("thead");
    const headingRow = document.createElement("tr");

    for (const heading of ["Date", "Title", "Category", "Amount", "Details"]) {
        const column = document.createElement("th");
        column.scope = "col";
        column.textContent = heading;
        headingRow.append(column);
    }

    tableHead.append(headingRow);

    const tableBody = document.createElement("tbody");
    table.append(tableHead, tableBody);
    recentSection.append(transactionsTitle, table);

    // Details popup
    const popup = document.createElement("dialog");
    popup.className = "transaction-popup";
    popup.setAttribute("aria-labelledby", "details-title");

    const popupTitle = document.createElement("h2");
    popupTitle.id = "details-title";

    const detailList = document.createElement("div");

    const popupActions = document.createElement("div");
    popupActions.className = "popup-actions";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => popup.close());

    popupActions.append(closeButton);
    popup.append(popupTitle, detailList, popupActions);

    function addDetail(label: string, value: string): void {
        const line = document.createElement("p");

        const name = document.createElement("strong");
        name.textContent = `${label}: `;

        line.append(name, value);
        detailList.append(line);
    }

    function formatAmount(amount: number, currency: string): string {
        const number = amount.toLocaleString("en-US", {
            maximumFractionDigits: currency === "JPY" ? 0 : 2
        });

        return `${number} ${currency}`;
    }

    function openDetails(transaction: Transaction): void {
        const currency = transaction.currency.trim().toUpperCase();

        popupTitle.textContent = transaction.t_type === "income"
            ? "Income Details"
            : "Expense Details";

        detailList.replaceChildren();

        addDetail("Date", transaction.t_date);
        addDetail("Title", transaction.title);
        addDetail("Category", transaction.category || "");
        addDetail("Amount", formatAmount(transaction.amount, currency));

        if (currency === "JPY") {
            addDetail("In USD", formatAmount(transaction.amount / yenPerDollar, "USD"));
        } else if (currency === "USD") {
            addDetail("In JPY", formatAmount(transaction.amount * yenPerDollar, "JPY"));
        }

        addDetail("Description", transaction.description || "");
        popup.showModal();
    }

    // Four most recent transactions
    const recentTransactions = [...transactions]
        .sort((a, b) => b.t_date.localeCompare(a.t_date))
        .slice(0, 4);

    for (const transaction of recentTransactions) {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.t_date;

        const titleCell = document.createElement("td");
        titleCell.textContent = transaction.title;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = transaction.category || "";

        const amountCell = document.createElement("td");
        const currency = transaction.currency.trim().toUpperCase();
        amountCell.textContent = formatAmount(transaction.amount, currency);

        const detailsCell = document.createElement("td");

        const detailsButton = document.createElement("button");
        detailsButton.type = "button";
        detailsButton.className = "expense-details-button";
        detailsButton.textContent = "•••";
        detailsButton.setAttribute("aria-label", `Details for ${transaction.title}`);
        detailsButton.addEventListener("click", () => openDetails(transaction));

        detailsCell.append(detailsButton);
        row.append(dateCell, titleCell, categoryCell, amountCell, detailsCell);
        tableBody.append(row);
    }

    if (recentTransactions.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "No transactions yet.";

        row.append(cell);
        tableBody.append(row);
    }

    main.append(overview, recentSection);
    document.body.append(header, main, popup);
}

renderMainPage();