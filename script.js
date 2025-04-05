const form = document.getElementById('transaction-form');
const list = document.getElementById('transaction-list');
const balanceEl = document.getElementById('balance');
const resetBtn = document.getElementById('reset-data');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let chart;

function updateChart(income, expense) {
  const ctx = document.getElementById('expenseChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#4caf50', '#f44336']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function updateUI() {
  list.innerHTML = '';
  let balance = 0;
  let income = 0;
  let expense = 0;

  transactions.forEach((txn, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${txn.description} - ₹${txn.amount} (${txn.type})
      <div>
        <button class="edit-btn" onclick="editTransaction(${index})">✏️</button>
        <button class="delete-btn" onclick="deleteTransaction(${index})">❌</button>
      </div>
    `;
    list.appendChild(li);

    if (txn.type === 'income') {
      income += txn.amount;
      balance += txn.amount;
    } else {
      expense += txn.amount;
      balance -= txn.amount;
    }
  });

  balanceEl.textContent = balance.toFixed(2);
  localStorage.setItem('transactions', JSON.stringify(transactions));
  updateChart(income, expense);
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const description = document.getElementById('description').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const type = document.getElementById('type').value;

  if (description && amount) {
    transactions.push({ description, amount, type });
    updateUI();
    form.reset();
  }
});

function deleteTransaction(index) {
  transactions.splice(index, 1);
  updateUI();
}

function editTransaction(index) {
  const txn = transactions[index];
  document.getElementById('description').value = txn.description;
  document.getElementById('amount').value = txn.amount;
  document.getElementById('type').value = txn.type;
  transactions.splice(index, 1);
  updateUI();
}

resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all transactions?')) {
    transactions = [];
    updateUI();
  }
});

updateUI();
