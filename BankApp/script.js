"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

let currentAccount,timer;
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

const intlDate = (locale, date) => {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    month: "numeric",
  }).format(date);
};

const intlNumber = (locale, currency, num) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(num);
};

const dateDispaly = (date) => {
  const year = `${date.getFullYear()}`;
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const dateMonth = `${date.getDate()}`.padStart(2, 0);
  const hour = `${date.getHours()}`.padStart(2, 0);
  const mins = `${date.getMinutes()}`.padStart(2, 0);
  return `${year}/${month}/${dateMonth} ,${hour}:${mins}`;
};

const calcDate = (now, date, locale) => {
  const daysPassed = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));

  if (daysPassed == 0) return "Today";
  if (daysPassed == 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} ago`;
  return intlDate(locale, date);
};

const dispalyMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date"> ${calcDate(
      new Date(),
      new Date(account.movementsDates[i]),
      account.locale
    )}</div>
    <div class="movements__value">${intlNumber(
      account.locale,
      account.currency,
      mov
    )}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const startLogoutTimer = () => {
  let time = 120;

  const tick = () => {
    const mins = `${Math.trunc(time / 60)}`.padStart(2, 0);
    const secs = `${time % 60}`.padStart(2, 0);
    labelTimer.textContent = `${mins} :${secs}`;
    if (time == 0) {
      labelWelcome.textContent = "Login to Get Started";
      containerApp.style.opacity = 0;
      currentAccount = "";
      clearInterval(timer);
    }
    time--;
  };
  tick();
  timer = setInterval(tick, 1000);
  return timer
};

const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = `${intlNumber(
    account.locale,
    account.currency,
    account.balance
  )} `;
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

  labelSumIn.textContent = `${intlNumber(
    account.locale,
    account.currency,
    incomes
  )}`;
  labelSumOut.textContent = `${intlNumber(
    account.locale,
    account.currency,
    withdrawals
  )}`;
  labelSumInterest.textContent = `${intlNumber(
    account.locale,
    account.currency,
    interest
  )}`;
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

  if (currentAccount && currentAccount?.pin === +inputLoginPin.value) {
    if(timer){
      clearInterval(timer)
    }
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    labelDate.textContent = intlDate(currentAccount.locale, new Date());
    startLogoutTimer();
    DataDisplay(currentAccount);
  }

  inputLoginUsername.value = inputLoginPin.value = "";
  inputLoginPin.blur();
};

const transferAmmount = (e) => {
  e.preventDefault();
  if(timer){
    clearInterval(timer)
  }
  timer=startLogoutTimer();


  const amount = +inputTransferAmount.value;
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
    transferTo.movementsDates.push(new Date().toISOString());
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    DataDisplay(currentAccount);
  }
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
};

const closeAccount = (e) => {
  e.preventDefault();
  if(timer){
    clearInterval(timer)
  }
  timer=startLogoutTimer();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
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
  if(timer){
    clearInterval(timer)
  }
  timer=startLogoutTimer();
  const loanrequest = Math.floor(inputLoanAmount.value);
  if (
    loanrequest > 0 &&
    currentAccount.movements.some((movement) => movement > loanrequest * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanrequest);
      currentAccount.movementsDates.push(new Date().toISOString());
      DataDisplay(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = "";
};

btnLogin.addEventListener("click", loginAccount);
btnTransfer.addEventListener("click", transferAmmount);
btnClose.addEventListener("click", closeAccount);
btnLoan.addEventListener("click", takeLoan);
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  dispalyMovements(currentAccount, !isSorted);
  if(timer){
    clearInterval(timer)
  }
  timer=startLogoutTimer();
  isSorted = !isSorted;
});
