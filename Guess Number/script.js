"use strict";
let secretNumber;
let score = 20;
let highScore = 0;


const guesssnumber = () => {
    secretNumber = Math.trunc(Math.random() * 10) + 1;
    if (secretNumber === 0) {
        guesssnumber();
    }
    console.log(secretNumber, typeof secretNumber);
    return secretNumber;
};
guesssnumber();

const setHighScore = () => {
    if (score > highScore) {
        highScore = score;
        document.querySelector(".highscore").textContent = highScore;
    }
};



const compareNumber = (message) => {
    if (score > 1) {
        score--;
        document.querySelector(".score").textContent = score;
        document.querySelector(".message").textContent = message;
    } else {
        document.querySelector(".score").textContent = 0;
        document.querySelector(".message").textContent = "You lose..Game Over🥲";
    }
};






document.querySelector(".check").addEventListener("click", function () {
    const guess = Number(document.querySelector(".guess").value);

    if (!guess) {
        document.querySelector(".message").textContent = "🚫Enter A Number";
    } else if (guess === secretNumber) {
        if (score > 0) {
            score++;
            document.querySelector(".score").textContent = score;
            document.querySelector("body").style.backgroundColor = "#60b347";
            document.querySelector(".number").style.width = "30rem";
            document.querySelector(".number").textContent = secretNumber;
            document.querySelector(".message").textContent = "Your Guess is right✔️";
            setHighScore();
        } else {
            document.querySelector(".message").textContent = "You lose..Game Over🥲";
        }
    } else {
        const message =
            guess > secretNumber
                ? "Your guess is Too High📈"
                : "Your Guess is Too Low📉";
        compareNumber(message);
    }
});

//reset functionality
const reset = () => {
    document.querySelector("body").style.backgroundColor = "#222";
    document.querySelector(".number").style.width = "15rem";
    document.querySelector(".guess").value = "";
    document.querySelector(".message").textContent = "Start guessing...";
    score = 20;
    document.querySelector(".score").textContent = score;
    document.querySelector(".number").textContent = "?";
    guesssnumber();
};

document.querySelector(".again").addEventListener("click", reset);
