import data from "./transactions.json";

function renderMainPage(): void {
    
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

    // Pie
    const chartArea = document.createElement("div");
    chartArea.id = "budget-chart";

    monthlyBudget.append(monthlyTitle, chartArea);

    // Income expense
    const budgetLinks = document.createElement("nav");
    budgetLinks.className = "budget-links";

    const sectionNames = ["Income", "Expense", "Budget"];

    const income_link = document.createElement("a");
    income_link.className = "budget-link";
    income_link.textContent = "Income";
    income_link.href = "incomepage.html";

    budgetLinks.append(income_link);

    const expense_link = document.createElement("a");
    expense_link.className = "budget-link";
    expense_link.textContent = "Expense";
    expense_link.href = "expensepage.html";
    budgetLinks.append(expense_link);
    

    const budget_link = document.createElement("a");
    budget_link.className = "budget-link";
    budget_link.textContent = "Budget";
    
    budgetLinks.append(budget_link);

    overview.append(monthlyBudget, budgetLinks);

    // Recent Transactions
    const transactions = document.createElement("section");
    transactions.className = "recent-transactions";

    const transactionsTitle = document.createElement("h2");
    transactionsTitle.textContent = "Recent Transactions";

    const transactionList = document.createElement("ul");
    transactionList.id = "transaction-list";
    for (const transaction of data.transactions.slice(0, 4)) {
            const item = document.createElement("li");
            
            item.textContent =
                item.textContent = `${transaction.t_date}\t${transaction.title}\t${transaction.amount} ${transaction.currency} \t•••`;

            transactionList.append(item);
    }
    transactions.append(transactionsTitle, transactionList);

    // Main
    main.append(overview, transactions);
    document.body.append(header, main);

}

renderMainPage()
