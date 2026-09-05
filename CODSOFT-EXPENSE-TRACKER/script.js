/* =========================================================
   EXPENSE TRACKER
   Main JavaScript
========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const TRANSACTIONS_KEY = "codsoftExpenseTrackerTransactions";
const THEME_KEY = "codsoftExpenseTrackerTheme";


/* =========================================================
   CATEGORY DATA
========================================================= */

const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other"
];


const expenseCategories = [
    "Food",
    "Shopping",
    "Transport",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Rent",
    "Travel",
    "Other"
];


const allCategories = [
    ...new Set([
        ...incomeCategories,
        ...expenseCategories
    ])
];


/* =========================================================
   APPLICATION STATE
========================================================= */

let transactions = loadTransactions();

let currentTypeFilter = "all";

let currentCategoryFilter = "all";

let editingTransactionId = null;

let transactionToDelete = null;


/* =========================================================
   DOM ELEMENTS
========================================================= */

const transactionForm =
    document.getElementById("transactionForm");

const transactionTitle =
    document.getElementById("transactionTitle");

const transactionAmount =
    document.getElementById("transactionAmount");

const transactionType =
    document.getElementById("transactionType");

const transactionCategory =
    document.getElementById("transactionCategory");

const transactionDate =
    document.getElementById("transactionDate");

const submitButton =
    document.getElementById("submitButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const transactionList =
    document.getElementById("transactionList");

const emptyState =
    document.getElementById("emptyState");

const noResults =
    document.getElementById("noResults");

const transactionCount =
    document.getElementById("transactionCount");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpenses =
    document.getElementById("totalExpenses");

const currentBalance =
    document.getElementById("currentBalance");

const themeToggle =
    document.getElementById("themeToggle");

const themeIcon =
    document.getElementById("themeIcon");

const themeText =
    document.getElementById("themeText");

const deleteModal =
    document.getElementById("deleteModal");

const cancelDelete =
    document.getElementById("cancelDelete");

const confirmDelete =
    document.getElementById("confirmDelete");

const toast =
    document.getElementById("toast");


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    setDefaultDate();

    populateTransactionCategories();

    populateCategoryFilter();

    applySavedTheme();

    renderApplication();

});


/* =========================================================
   LOCAL STORAGE
========================================================= */

function loadTransactions() {

    try {

        const stored =
            localStorage.getItem(TRANSACTIONS_KEY);

        if (!stored) {
            return [];
        }

        const parsed =
            JSON.parse(stored);

        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed;

    } catch (error) {

        console.error(
            "Unable to load transactions:",
            error
        );

        return [];
    }
}


function saveTransactions() {

    try {

        localStorage.setItem(
            TRANSACTIONS_KEY,
            JSON.stringify(transactions)
        );

    } catch (error) {

        console.error(
            "Unable to save transactions:",
            error
        );

        showToast(
            "Unable to save transaction data."
        );
    }
}


/* =========================================================
   DEFAULT DATE
========================================================= */

function setDefaultDate() {

    if (!transactionDate.value) {

        const today =
            new Date();

        transactionDate.value =
            formatDateForInput(today);
    }
}


function formatDateForInput(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/* =========================================================
   CATEGORY MANAGEMENT
========================================================= */

function populateTransactionCategories(
    selectedCategory = ""
) {

    const type =
        transactionType.value;

    let categories = [];

    if (type === "income") {

        categories =
            incomeCategories;

    } else if (type === "expense") {

        categories =
            expenseCategories;

    } else {

        categories =
            allCategories;
    }

    transactionCategory.innerHTML =
        `<option value="">Select category</option>`;

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        if (category === selectedCategory) {
            option.selected = true;
        }

        transactionCategory.appendChild(option);
    });
}


function populateCategoryFilter() {

    categoryFilter.innerHTML =
        `<option value="all">All Categories</option>`;

    expenseCategories.forEach(category => {

        const option =
            document.createElement("option");

        option.value =
            category.toLowerCase();

        option.textContent =
            category;

        categoryFilter.appendChild(option);
    });
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

transactionType.addEventListener(
    "change",
    () => {

        populateTransactionCategories();

        clearFieldError(
            transactionCategory,
            "categoryError"
        );
    }
);


transactionForm.addEventListener(
    "submit",
    handleTransactionSubmit
);


cancelEditButton.addEventListener(
    "click",
    cancelEdit
);


searchInput.addEventListener(
    "input",
    renderApplication
);


categoryFilter.addEventListener(
    "change",
    () => {

        currentCategoryFilter =
            categoryFilter.value;

        renderApplication();
    }
);


document
    .querySelectorAll("[data-type-filter]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentTypeFilter =
                    button.dataset.typeFilter;

                document
                    .querySelectorAll(
                        "[data-type-filter]"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );
                    });

                button.classList.add("active");

                renderApplication();
            }
        );
    });


themeToggle.addEventListener(
    "click",
    toggleTheme
);


cancelDelete.addEventListener(
    "click",
    closeDeleteModal
);


confirmDelete.addEventListener(
    "click",
    confirmTransactionDelete
);


deleteModal.addEventListener(
    "click",
    event => {

        if (
            event.target === deleteModal
        ) {

            closeDeleteModal();
        }
    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !deleteModal.classList.contains("hidden")
        ) {

            closeDeleteModal();
        }
    }
);


/* =========================================================
   ADD / EDIT TRANSACTION
========================================================= */

function handleTransactionSubmit(event) {

    event.preventDefault();

    clearAllErrors();

    const title =
        transactionTitle.value.trim();

    const amount =
        Number(transactionAmount.value);

    const type =
        transactionType.value;

    const category =
        transactionCategory.value;

    const date =
        transactionDate.value;

    const isValid =
        validateTransaction(
            title,
            amount,
            type,
            category,
            date
        );

    if (!isValid) {
        return;
    }


    if (editingTransactionId !== null) {

        updateTransaction(
            title,
            amount,
            type,
            category,
            date
        );

    } else {

        addTransaction(
            title,
            amount,
            type,
            category,
            date
        );
    }
}


function validateTransaction(
    title,
    amount,
    type,
    category,
    date
) {

    let valid = true;


    if (!title) {

        showFieldError(
            transactionTitle,
            "titleError",
            "Please enter a transaction name."
        );

        valid = false;
    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        showFieldError(
            transactionAmount,
            "amountError",
            "Please enter a valid amount greater than zero."
        );

        valid = false;
    }


    if (!type) {

        showFieldError(
            transactionType,
            "typeError",
            "Please select a transaction type."
        );

        valid = false;
    }


    if (!category) {

        showFieldError(
            transactionCategory,
            "categoryError",
            "Please select a category."
        );

        valid = false;
    }


    if (!date) {

        showFieldError(
            transactionDate,
            "dateError",
            "Please select a date."
        );

        valid = false;
    }


    return valid;
}


function addTransaction(
    title,
    amount,
    type,
    category,
    date
) {

    const newTransaction = {

        id:
            createUniqueId(),

        title,

        amount,

        type,

        category,

        date,

        createdAt:
            Date.now()
    };


    transactions.push(
        newTransaction
    );


    saveTransactions();

    resetForm();

    renderApplication();

    showToast(
        "Transaction added successfully."
    );
}


function updateTransaction(
    title,
    amount,
    type,
    category,
    date
) {

    const index =
        transactions.findIndex(
            transaction =>
                transaction.id ===
                editingTransactionId
        );


    if (index === -1) {

        showToast(
            "Transaction could not be found."
        );

        cancelEdit();

        return;
    }


    transactions[index] = {

        ...transactions[index],

        title,

        amount,

        type,

        category,

        date
    };


    saveTransactions();

    resetForm();

    renderApplication();

    showToast(
        "Transaction updated successfully."
    );
}


/* =========================================================
   UNIQUE ID
========================================================= */

function createUniqueId() {

    return (
        Date.now().toString(36) +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );
}


/* =========================================================
   EDIT TRANSACTION
========================================================= */

function startEditTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    editingTransactionId =
        id;


    transactionTitle.value =
        transaction.title;

    transactionAmount.value =
        transaction.amount;

    transactionType.value =
        transaction.type;


    populateTransactionCategories(
        transaction.category
    );


    transactionDate.value =
        transaction.date;


    submitButton.innerHTML =
        `<span>✓</span> Save Changes`;


    cancelEditButton.classList.remove(
        "hidden"
    );


    document
        .querySelector(
            ".panel"
        )
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });


    transactionTitle.focus();
}


function cancelEdit() {

    editingTransactionId =
        null;

    resetForm();

    showToast(
        "Edit cancelled."
    );
}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    transactionForm.reset();

    editingTransactionId =
        null;

    submitButton.innerHTML =
        `<span>+</span> Add Transaction`;

    cancelEditButton.classList.add(
        "hidden"
    );

    populateTransactionCategories();

    setDefaultDate();

    clearAllErrors();
}


/* =========================================================
   DELETE TRANSACTION
========================================================= */

function startDeleteTransaction(id) {

    const transaction =
        transactions.find(
            item =>
                item.id === id
        );


    if (!transaction) {
        return;
    }


    transactionToDelete =
        id;


    deleteModal.classList.remove(
        "hidden"
    );


    deleteModal.setAttribute(
        "aria-hidden",
        "false"
    );


    confirmDelete.focus();
}


function closeDeleteModal() {

    transactionToDelete =
        null;

    deleteModal.classList.add(
        "hidden"
    );


    deleteModal.setAttribute(
        "aria-hidden",
        "true"
    );
}


function confirmTransactionDelete() {

    if (!transactionToDelete) {

        closeDeleteModal();

        return;
    }


    const transaction =
        transactions.find(
            item =>
                item.id ===
                transactionToDelete
        );


    transactions =
        transactions.filter(
            item =>
                item.id !==
                transactionToDelete
        );


    saveTransactions();

    closeDeleteModal();

    renderApplication();


    if (transaction) {

        showToast(
            `"${transaction.title}" deleted.`
        );

    } else {

        showToast(
            "Transaction deleted."
        );
    }
}


/* =========================================================
   RENDER APPLICATION
========================================================= */

function renderApplication() {

    updateSummary();

    updateCategoryFilterVisibility();

    const filteredTransactions =
        getFilteredTransactions();

    renderTransactions(
        filteredTransactions
    );

    updateTransactionCount(
        filteredTransactions.length
    );

    updateEmptyStates(
        filteredTransactions.length
    );
}


/* =========================================================
   SUMMARY CALCULATIONS
========================================================= */

function updateSummary() {

    const income =
        transactions
            .filter(
                transaction =>
                    transaction.type ===
                    "income"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Number(transaction.amount),
                0
            );


    const expenses =
        transactions
            .filter(
                transaction =>
                    transaction.type ===
                    "expense"
            )
            .reduce(
                (total, transaction) =>
                    total +
                    Number(transaction.amount),
                0
            );


    const balance =
        income - expenses;


    totalIncome.textContent =
        formatCurrency(income);

    totalExpenses.textContent =
        formatCurrency(expenses);

    currentBalance.textContent =
        formatCurrency(balance);


    currentBalance.style.color =
        balance < 0
            ? "var(--expense)"
            : "var(--balance)";
}


/* =========================================================
   FILTERING
========================================================= */

function getFilteredTransactions() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    return transactions
        .filter(transaction => {

            const matchesType =
                currentTypeFilter === "all" ||
                transaction.type ===
                    currentTypeFilter;


            const matchesCategory =
                currentCategoryFilter === "all" ||
                (
                    transaction.type ===
                        "expense" &&
                    transaction.category
                        .toLowerCase() ===
                        currentCategoryFilter
                );


            const searchableText =
                [
                    transaction.title,
                    transaction.description || "",
                    transaction.category,
                    transaction.type,
                    transaction.date
                ]
                    .join(" ")
                    .toLowerCase();


            const matchesSearch =
                !searchTerm ||
                searchableText.includes(
                    searchTerm
                );


            return (
                matchesType &&
                matchesCategory &&
                matchesSearch
            );
        })
        .sort(
            (a, b) => {

                const dateDifference =
                    new Date(b.date) -
                    new Date(a.date);


                if (
                    dateDifference !== 0
                ) {

                    return dateDifference;
                }


                return (
                    Number(b.createdAt || 0) -
                    Number(a.createdAt || 0)
                );
            }
        );
}


/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions(
    filteredTransactions
) {

    transactionList.innerHTML = "";


    filteredTransactions.forEach(
        transaction => {

            const item =
                createTransactionElement(
                    transaction
                );

            transactionList.appendChild(
                item
            );
        }
    );
}


function createTransactionElement(
    transaction
) {

    const article =
        document.createElement("article");


    article.className =
        "transaction-item";


    const main =
        document.createElement("div");

    main.className =
        "transaction-main";


    const title =
        document.createElement("h3");

    title.className =
        "transaction-title";

    title.textContent =
        transaction.title;


    const meta =
        document.createElement("div");

    meta.className =
        "transaction-meta";


    const date =
        document.createElement("span");

    date.className =
        "transaction-date";

    date.textContent =
        formatDisplayDate(
            transaction.date
        );


    const separator =
        document.createElement("span");

    separator.className =
        "meta-separator";

    separator.textContent =
        "•";


    const category =
        document.createElement("span");

    category.className =
        "category-badge";

    category.textContent =
        transaction.category;


    const typeBadge =
        document.createElement("span");

    typeBadge.className =
        "transaction-type-badge " +
        (
            transaction.type ===
            "income"
                ? "income-badge"
                : "expense-badge"
        );

    typeBadge.textContent =
        transaction.type ===
        "income"
            ? "Income"
            : "Expense";


    meta.append(
        date,
        separator,
        category,
        typeBadge
    );


    main.append(
        title,
        meta
    );


    const amount =
        document.createElement("div");

    amount.className =
        "transaction-amount " +
        transaction.type;

    amount.textContent =
        (
            transaction.type ===
            "income"
                ? "+ "
                : "- "
        ) +
        formatCurrency(
            transaction.amount
        );


    const actions =
        document.createElement("div");

    actions.className =
        "transaction-actions";


    const editButton =
        document.createElement("button");

    editButton.type =
        "button";

    editButton.className =
        "icon-button";

    editButton.title =
        "Edit transaction";

    editButton.setAttribute(
        "aria-label",
        `Edit ${transaction.title}`
    );

    editButton.textContent =
        "✎";


    editButton.addEventListener(
        "click",
        () =>
            startEditTransaction(
                transaction.id
            )
    );


    const deleteButton =
        document.createElement("button");

    deleteButton.type =
        "button";

    deleteButton.className =
        "icon-button delete";

    deleteButton.title =
        "Delete transaction";

    deleteButton.setAttribute(
        "aria-label",
        `Delete ${transaction.title}`
    );

    deleteButton.textContent =
        "×";


    deleteButton.addEventListener(
        "click",
        () =>
            startDeleteTransaction(
                transaction.id
            )
    );


    actions.append(
        editButton,
        deleteButton
    );


    article.append(
        main,
        amount,
        actions
    );


    return article;
}


/* =========================================================
   DATE FORMATTING
========================================================= */

function formatDisplayDate(
    dateString
) {

    if (!dateString) {
        return "No date";
    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {
        return dateString;
    }


    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]) - 1;

    const day =
        Number(parts[2]);


    const date =
        new Date(
            year,
            month,
            day
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================================================
   CURRENCY
========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2
        }
    ).format(
        Number(amount) || 0
    );
}


/* =========================================================
   TRANSACTION COUNT
========================================================= */

function updateTransactionCount(
    count
) {

    transactionCount.textContent =
        `${count} ${
            count === 1
                ? "Transaction"
                : "Transactions"
        }`;
}


/* =========================================================
   EMPTY STATES
========================================================= */

function updateEmptyStates(
    filteredCount
) {

    const totalCount =
        transactions.length;


    if (totalCount === 0) {

        emptyState.classList.remove(
            "hidden"
        );

        noResults.classList.add(
            "hidden"
        );

        transactionList.classList.add(
            "hidden"
        );

        return;
    }


    emptyState.classList.add(
        "hidden"
    );


    if (filteredCount === 0) {

        noResults.classList.remove(
            "hidden"
        );

        transactionList.classList.add(
            "hidden"
        );

    } else {

        noResults.classList.add(
            "hidden"
        );

        transactionList.classList.remove(
            "hidden"
        );
    }
}


/* =========================================================
   CATEGORY FILTER VISIBILITY
========================================================= */

function updateCategoryFilterVisibility() {

    if (
        currentTypeFilter === "income"
    ) {

        categoryFilter.disabled =
            true;

        categoryFilter.value =
            "all";

        currentCategoryFilter =
            "all";

    } else {

        categoryFilter.disabled =
            false;
    }
}


/* =========================================================
   VALIDATION HELPERS
========================================================= */

function showFieldError(
    input,
    errorId,
    message
) {

    input.classList.add(
        "input-error"
    );


    const errorElement =
        document.getElementById(
            errorId
        );


    errorElement.textContent =
        message;
}


function clearFieldError(
    input,
    errorId
) {

    input.classList.remove(
        "input-error"
    );


    const errorElement =
        document.getElementById(
            errorId
        );


    errorElement.textContent =
        "";
}


function clearAllErrors() {

    clearFieldError(
        transactionTitle,
        "titleError"
    );

    clearFieldError(
        transactionAmount,
        "amountError"
    );

    clearFieldError(
        transactionType,
        "typeError"
    );

    clearFieldError(
        transactionCategory,
        "categoryError"
    );

    clearFieldError(
        transactionDate,
        "dateError"
    );
}


/* =========================================================
   DARK MODE
========================================================= */

function applySavedTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_KEY
        );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        updateThemeButton(true);

    } else {

        document.body.classList.remove(
            "dark"
        );

        updateThemeButton(false);
    }
}


function toggleTheme() {

    const isDark =
        document.body.classList.toggle(
            "dark"
        );


    localStorage.setItem(
        THEME_KEY,
        isDark
            ? "dark"
            : "light"
    );


    updateThemeButton(
        isDark
    );
}


function updateThemeButton(
    isDark
) {

    if (isDark) {

        themeIcon.textContent =
            "☀";

        themeText.textContent =
            "Light Mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to light mode"
        );

    } else {

        themeIcon.textContent =
            "☾";

        themeText.textContent =
            "Dark Mode";

        themeToggle.setAttribute(
            "aria-label",
            "Switch to dark mode"
        );
    }
}


/* =========================================================
   TOAST MESSAGE
========================================================= */

let toastTimer;


function showToast(message) {

    clearTimeout(
        toastTimer
    );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );
}