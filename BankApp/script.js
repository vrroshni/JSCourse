"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////


const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

let currentAccount;
let isSorted = false;

const createUsername = (accounts) => {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((word) => word[0])
      .join("");
  });
};
createUsername(accounts);

const dispalyMovements = function (account, sort = false) {

  containerMovements.innerHTML = "";
  const movs = sort ? account.movements.slice().sort((a,b)=>a-b) : account.movements
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    // <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce(
    (acc, movement) => (acc + movement),
    0
  );
  labelBalance.textContent = `${account.balance} €`;
};

const calcDispalySummary = (account) => {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);

  const withdrawals = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => (acc += Math.abs(mov)), 0);
  labelSumIn.textContent = `${incomes} €`;
  labelSumOut.textContent = `${withdrawals} €`;

  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((interest) => interest >= 1)
    .reduce((acc, mov) => (acc += mov), 0);

  labelSumIn.textContent = `${incomes} €`;
  labelSumOut.textContent = `${withdrawals} €`;
  labelSumInterest.textContent = `${interest} €`;
};

const DataDisplay = (account) => {
  dispalyMovements(account);
  calcDisplayBalance(account);
  calcDispalySummary(account);
};

const loginAccount = (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (account) => account.username === inputLoginUsername.value
  );

  if (currentAccount && currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome Back ${currentAccount.owner.split(" ")[0]
      }`;
    containerApp.style.opacity = 100;
    DataDisplay(currentAccount);
  }

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
};

const transferAmmount = (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(
    (account) => account.username === inputTransferTo.value
  );
  if (
    currentAccount.balance > 0 &&
    transferTo &&
    amount <= currentAccount.balance &&
    transferTo?.username !== currentAccount.username
  ) {
    transferTo.movements.push(amount);
    currentAccount.movements.push(-amount);
    DataDisplay(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
};

const closeAccount = (e) => {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const pos = accounts.findIndex(
      (account) => account.username === currentAccount.username
    );
    accounts.splice(0, 1);
    containerApp.style.opacity = 0;
    currentAccount = "";
  }

  inputCloseUsername.value = inputClosePin.value = "";
};

const takeLoan = (e) => {
  e.preventDefault();
  const loanrequest = Number(inputLoanAmount.value);
  if (
    loanrequest > 0 &&
    currentAccount.movements.some((movement) => movement > loanrequest * 0.1)
  ) {
    currentAccount.movements.push(loanrequest);
    DataDisplay(currentAccount);
  }
  inputLoanAmount.value = "";
};



btnLogin.addEventListener("click", loginAccount);
btnTransfer.addEventListener("click", transferAmmount);
btnClose.addEventListener("click", closeAccount);
btnLoan.addEventListener("click", takeLoan);
btnSort.addEventListener("click",function(e){ 
  e.preventDefault()
  dispalyMovements(currentAccount, !isSorted)
  isSorted = !isSorted
});
