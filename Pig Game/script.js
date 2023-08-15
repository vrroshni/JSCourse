"use strict";

const diceEl = document.querySelector(".dice");

const player0 = document.querySelector(".player--0");
const player1 = document.querySelector(".player--1");

const diceRollBtn = document.querySelector(".btn--roll");
const newBtn = document.querySelector(".btn--new");
const holdBtn = document.querySelector(".btn--hold");

let playing, scores, currentScore, activePlayer;

const init = () => {
  scores = [0, 0];
  playing = true;
  currentScore = 0;
  activePlayer = 0;
  document.querySelector(`.player--1`).classList.remove("player--active");
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add("player--active");
  diceEl.classList.add("hidden");
  document.querySelector("#score--0").textContent = 0;
  document.getElementById("score--1").textContent = 0;
  document.getElementById("current--0").textContent = 0;
  document.getElementById("current--1").textContent = 0;

    document.querySelector(`.player--0`).classList.remove("player--winner");
    document.querySelector(`.player--1`).classList.remove("player--winner");

};

init();

const switchPlayer = () => {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle("player--active");
  player1.classList.toggle("player--active");
  diceEl.classList.add("hidden");
};

const rolldice = () => {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove("hidden");
    diceEl.src = `dice-${dice}.png`;

    if (dice !== 1) {
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchPlayer();
    }
  }
};

const holdScore = () => {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    if (scores[activePlayer] >= 12) {
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
      diceEl.classList.add("hidden");
      return;
    }
    switchPlayer();
  }
};

diceRollBtn.addEventListener("click", rolldice);
holdBtn.addEventListener("click", holdScore);
newBtn.addEventListener("click", init);
