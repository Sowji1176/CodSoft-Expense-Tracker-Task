# EXPENSE TRACKER

## 🌐 Visit Website

Visit the live Expense Tracker: https://sowji1176.github.io/CodSoft-Expense-Tracker-Task/

## 📌 Overview

The **Expense Tracker** is a responsive personal finance management application designed to help users monitor their income and expenses efficiently.

The application allows users to add, edit, delete, search, and filter transactions while automatically calculating total income, total expenses, and current balance.

Transaction data is stored using **Local Storage**, allowing financial records to remain available even after refreshing or reopening the browser.

## 🎯 Objective

The objective of this project is to create a simple, responsive, and user-friendly expense tracking application that helps users understand and manage their personal finances.

The application focuses on:

- Income and expense management
- Financial summaries
- Transaction history
- Category-based organization
- Search and filtering
- Local data persistence
- Responsive user experience

## ✨ Features

### 💰 Financial Summary

The dashboard provides three important financial statistics:

- **Total Income**
- **Total Expenses**
- **Current Balance**

The values are automatically updated whenever transactions are added, edited, or deleted.

### ➕ Add Transactions

Users can add financial transactions by providing:

- Transaction title
- Amount
- Transaction type
- Category
- Date

The application validates the required information before saving the transaction.

### 📋 Transaction History

All saved transactions are displayed in an organized transaction history.

Each transaction includes:

- Transaction title
- Amount
- Income/Expense type
- Category
- Date

### ✏️ Edit Transactions

Users can edit existing transactions and update their:

- Title
- Amount
- Type
- Category
- Date

The financial summary automatically recalculates after editing.

### 🗑️ Delete Transactions

Users can remove unwanted transactions.

A confirmation step is included before permanently deleting a transaction.

### 🔎 Search

The application provides a search feature that allows users to quickly find transactions based on their title or related information.

### 🏷️ Category Filtering

Expenses can be organized and filtered using categories such as:

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Education
- Other

This makes it easier to understand spending patterns.

### 🔄 Transaction Filtering

Users can filter transactions by:

- All
- Income
- Expenses

This allows users to quickly view specific types of financial activity.

### 💾 Local Storage

Transaction data is stored using the browser's **Local Storage**.

This means the user's data remains available after:

- Page refresh
- Browser reopening
- Returning to the application later

No external database is required.

### 🌙 Dark Mode

The application includes a dark mode option for a more comfortable viewing experience.

The selected theme is also saved using Local Storage.

### 📱 Responsive Design

The interface is designed to work across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile devices

The layout automatically adapts to smaller screens for better usability.

## 🎨 Design Focus

The interface focuses on creating a professional and easy-to-understand financial dashboard.

Key design principles include:

- Clean visual hierarchy
- Simple navigation
- Clear financial statistics
- Readable transaction information
- Consistent spacing
- Responsive layouts
- Accessible form controls
- Clear income and expense distinction

## 💡 User Experience

The application was designed to make expense tracking simple and efficient.

Users can:

1. Add a transaction
2. View their financial summary
3. Review transaction history
4. Search for transactions
5. Filter transactions
6. Edit existing records
7. Delete unwanted records
8. Switch between light and dark modes

All changes are reflected immediately in the interface.

## 🧮 Financial Calculations

The application automatically calculates:

### Total Income

The sum of all income transactions.

### Total Expenses

The sum of all expense transactions.

### Current Balance

**Current Balance = Total Income − Total Expenses**

These values update automatically whenever transaction data changes.

## 🛡️ Validation

The application includes basic input validation to prevent incomplete or invalid transactions.

Required information is checked before a transaction is saved.

## 🛠️ Technologies Used

- **HTML5** – Application structure
- **CSS3** – Styling and responsive design
- **JavaScript** – Application logic and interactivity
- **Local Storage API** – Persistent transaction data

## 📂 Project Structure

CODSOFT-TASK3-EXPENSE-TRACKER/
│
├── index.html
├── style.css
└── script.js
