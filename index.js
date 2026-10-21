
// ========================================
// 1. USERNAME
// ========================================

let userName = localStorage.getItem("userName");


// ========================================
// 2. SPLASH SCREEN AND WELCOME MESSAGE
// ========================================

const intro = document.getElementById("intro");
const game = document.getElementById("game");
const welcomeMessage = document.getElementById("welcomeMessage");

// Display splash screen first
intro.style.display = "flex";
game.style.display = "none";

// Wait 5 seconds before displaying the game
setTimeout(function () {

    // Hide splash screen
    intro.style.display = "none";

    // Ask for username only if one has not been saved
    if (!userName || !userName.trim()) {

        userName = prompt("Enter your username:");

        if (!userName || !userName.trim()) {
            userName = "Player";
        }

        userName = userName.trim();

        localStorage.setItem("userName", userName);
    }

    // Display welcome message beneath the title
    welcomeMessage.textContent =
        `Welcome back, ${userName}!`;

    // Show the game
    game.style.display = "block";

}, 3000);


// ========================================
// 3. GAME VARIABLES
// ========================================

let answer = Math.floor(Math.random() * 6) + 1;

let guesses = 0;

let score = Number(localStorage.getItem("score")) || 0;

let userguesses =
    JSON.parse(localStorage.getItem("userguesses")) || [];

let wins = Number(localStorage.getItem("wins")) || 0;

let losses = Number(localStorage.getItem("losses")) || 0;

let gamesPlayed =
    Number(localStorage.getItem("gamesPlayed")) || 0;

let winRate = gamesPlayed > 0
    ? Math.floor((wins / gamesPlayed) * 100)
    : 0;


// ========================================
// 4. DISPLAY SAVED STATISTICS
// ========================================

document.getElementById("Wins").textContent = wins;

document.getElementById("losses").textContent = losses;

document.getElementById("gamesPlayed").textContent = gamesPlayed;

document.getElementById("winRate").textContent = winRate + "%";

document.getElementById("score").textContent = score;

document.getElementById("playerHistory").textContent =
    userguesses.join(", ");


// ========================================
// 5. ROLL DICE BUTTON
// ========================================

document.getElementById("myButton").onclick = function () {

    const guess = Number(
        document.getElementById("guessField").value
    );

    // Validate the player's guess
    if (!Number.isInteger(guess) || guess < 1 || guess > 6) {
        alert("Please enter a number from 1 to 6!");
        return;
    }

    // Animate the dice
    const dice = document.getElementById("diceImage");

    dice.classList.remove("dice-roll");

    void dice.offsetWidth;

    dice.classList.add("dice-roll");


    // Save the last 10 guesses
    if (userguesses.length >= 10) {
        userguesses.shift();
    }

    userguesses.push(guess);

    localStorage.setItem(
        "userguesses",
        JSON.stringify(userguesses)
    );

    document.getElementById("playerHistory").textContent =
        userguesses.join(", ");


    // Count the guess
    guesses++;


    // ====================================
    // PLAYER WINS
    // ====================================

    if (guess === answer) {

        score += 10;

        wins++;

        gamesPlayed++;

        winRate = Math.floor((wins / gamesPlayed) * 100);

        // Save statistics
        localStorage.setItem("score", score);

        localStorage.setItem("wins", wins);

        localStorage.setItem("gamesPlayed", gamesPlayed);

        // Update the screen
        document.getElementById("score").textContent = score;

        document.getElementById("Wins").textContent = wins;

        document.getElementById("gamesPlayed").textContent =
            gamesPlayed;

        document.getElementById("winRate").textContent =
            winRate + "%";

        alert("You won! ");

        document.getElementById("playAgain").style.display =
            "block";

        document.getElementById("myButton").style.display =
            "none";

        return;
    }


    // ====================================
    // PLAYER LOSES AFTER THREE GUESSES
    // ====================================

    if (guesses >= 3) {

        losses++;

        gamesPlayed++;

        winRate = Math.floor((wins / gamesPlayed) * 100);

        // Save statistics
        localStorage.setItem("losses", losses);

        localStorage.setItem("gamesPlayed", gamesPlayed);

        // Update the screen
        document.getElementById("losses").textContent = losses;

        document.getElementById("gamesPlayed").textContent =
            gamesPlayed;

        document.getElementById("winRate").textContent =
            winRate + "%";

        alert(
            `You're out! The correct number was ${answer}. Try harder next time!`
        );

        document.getElementById("playAgain").style.display =
            "block";

        document.getElementById("myButton").style.display =
            "none";

        return;
    }


    // ====================================
    // INCORRECT GUESS
    // ====================================

    score -= 2;

    if (score < 0) {
        score = 0;
    }

    localStorage.setItem("score", score);

    document.getElementById("score").textContent = score;

    alert("Please Try Again!");

};


// ========================================
// 6. PLAY AGAIN BUTTON
// ========================================

document.getElementById("playAgain").onclick = function () {

    // Generate a new answer
    answer = Math.floor(Math.random() * 6) + 1;

    // Reset guesses
    guesses = 0;

    // Clear the input
    document.getElementById("guessField").value = "";

    // Hide Play Again
    document.getElementById("playAgain").style.display =
        "none";

    // Show Roll Dice
    document.getElementById("myButton").style.display =
        "block";

    alert("New game started!");

};


// ========================================
// 7. SERVICE WORKER REGISTRATION
// ========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("./service-worker.js")

            .then(function (registration) {

                console.log(
                    "Service worker registered:",
                    registration.scope
                );

            })

            .catch(function (error) {

                console.error(
                    "Service worker registration failed:",
                    error
                );

            });

    });

}

