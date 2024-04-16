// Script.js
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalAmountElement = document.getElementById("total-amount");
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseChart = null; // Declare chart globally to update later

function renderExpenses() {
    expenseList.innerHTML = "";
    let totalAmount = 0;
    let chartLabels = [];
    let chartData = [];

    for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        const expenseRow = document.createElement("tr");
        expenseRow.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount}</td>
            <td class="delete-btn" data-id="${i}">Delete</td>
        `;
        expenseList.appendChild(expenseRow);
        totalAmount += expense.amount;
        chartLabels.push(expense.name);
        chartData.push(expense.amount);
    }
    totalAmountElement.textContent = totalAmount.toFixed(2);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    updateChart(chartLabels, chartData);
}

function addExpense(event) {
    event.preventDefault();
    const expenseNameInput = document.getElementById("expense-name");
    const expenseAmountInput = document.getElementById("expense-amount");
    const expenseName = expenseNameInput.value;
    const expenseAmount = parseFloat(expenseAmountInput.value);

    expenseNameInput.value = "";
    expenseAmountInput.value = "";

    if (expenseName === "" || isNaN(expenseAmount)) {
        alert("Please enter valid expense details.");
        return;
    }

    const expense = { name: expenseName, amount: expenseAmount };
    expenses.push(expense);
    renderExpenses();
}

function deleteExpense(event) {
    if (event.target.classList.contains("delete-btn")) {
        const expenseIndex = parseInt(event.target.getAttribute("data-id"));
        expenses.splice(expenseIndex, 1);
        renderExpenses();
    }
}

function updateChart(labels, data) {
    if (expenseChart) {
        expenseChart.destroy(); // Destroy the old chart instance before creating new one
    }
    const ctx = document.getElementById("expenseChart").getContext('2d');
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

expenseForm.addEventListener("submit", addExpense);
expenseList.addEventListener("click", deleteExpense);
renderExpenses(); // Render initial expenses on page load
