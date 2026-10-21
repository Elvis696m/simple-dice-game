
// ========================================
// USERNAME
// ========================================

let userName = localStorage.getItem('userName');


// ========================================
// SPLASH SCREEN
// ========================================

const intro = document.getElementById('intro');
const game = document.getElementById('game');

intro.style.display = 'flex';
game.style.display = 'none';

setTimeout(function () {

    // Hide splash screen
    intro.style.display = 'none';

    // Ask for username only on the first visit
    if (!userName || !userName.trim()) {

        userName = prompt('Enter your username:');

        if (!userName || !userName.trim()) {
            userName = 'Player';
        }

        userName = userName.trim();

        localStorage.setItem('userName', userName);
    }

    // Display welcome message under the game title
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (welcomeMessage) {
        welcomeMessage.textContent =
            `Welcome back , ${userName}!`;
    } else {
        console.error(
            'Welcome message element not found! Check index.html for id="welcomeMessage".'
        );
    }

    // Show the game
    game.style.display = 'block';

}, 3000);


// ========================================
// GAME VARIABLES
// ========================================

let answer = Math.floor(Math.random() * 6) + 1;

let guesses = 0;

let score = Number(localStorage.getItem('score')) || 0;

let userguesses =
    JSON.parse(localStorage.getItem('userguesses')) || [];

let wins = Number(localStorage.getItem('wins')) || 0;

let losses = Number(localStorage.getItem('losses')) || 0;

let gamesPlayed =
    Number(localStorage.getItem('gamesPlayed')) || 0;

let winRate = gamesPlayed > 0
    ? Math.floor((wins / gamesPlayed) * 100)
    : 0;


// ========================================
// DISPLAY SAVED STATISTICS
// ========================================

document.getElementById('Wins').textContent = wins;

document.getElementById('losses').textContent = losses;

document.getElementById('gamesPlayed').textContent = gamesPlayed;

document.getElementById('winRate').textContent = winRate + '%';

document.getElementById('score').textContent = score;

document.getElementById('playerHistory').textContent =
    userguesses.join(', ');


// ========================================
// ROLL DICE BUTTON
// ========================================

document.getElementById('myButton').onclick = function () {

    let guess = Number(
        document.getElementById('guessField').value
    );

    // Validate the guess
    if (!guess || guess < 1 || guess > 6) {
        alert('Please enter a number from 1 to 6!');
        return;
    }

    // Dice animation
    let dice = document.getElementById('diceImage');

    dice.classList.remove('dice-roll');

    void dice.offsetWidth;

    dice.classList.add('dice-roll');


    // Save the latest 10 guesses
    if (userguesses.length >= 10) {
        userguesses.shift();
    }

    userguesses.push(guess);

    localStorage.setItem(
        'userguesses',
        JSON.stringify(userguesses)
    );

    document.getElementById('playerHistory').textContent =
        userguesses.join(', ');


    guesses++;


    // ========================================
    // WIN
    // ========================================

    if (guess === answer) {

        score += 10;
        wins++;
        gamesPlayed++;

        winRate = Math.floor((wins / gamesPlayed) * 100);

        localStorage.setItem('score', score);
        localStorage.setItem('wins', wins);
        localStorage.setItem('gamesPlayed', gamesPlayed);

        document.getElementById('score').textContent = score;
        document.getElementById('Wins').textContent = wins;
        document.getElementById('gamesPlayed').textContent = gamesPlayed;
        document.getElementById('winRate').textContent = winRate + '%';

        alert('You won! ');

        document.getElementById('playAgain').style.display =
            'inline-block';

        document.getElementById('myButton').style.display =
            'none';

        return;
    }


    // ========================================
    // LOSE AFTER THREE GUESSES
    // ========================================

    if (guesses >= 3) {

        losses++;
        gamesPlayed++;

        winRate = Math.floor((wins / gamesPlayed) * 100);

        localStorage.setItem('losses', losses);
        localStorage.setItem('gamesPlayed', gamesPlayed);

        document.getElementById('losses').textContent = losses;
        document.getElementById('gamesPlayed').textContent = gamesPlayed;
        document.getElementById('winRate').textContent = winRate + '%';

        alert(`You're out! The correct number was ${answer}.`);

        document.getElementById('playAgain').style.display =
            'inline-block';

        document.getElementById('myButton').style.display =
            'none';

        return;
    }


    // ========================================
    // INCORRECT GUESS
    // ========================================

    score -= 2;

    if (score < 0) {
        score = 0;
    }

    localStorage.setItem('score', score);

    document.getElementById('score').textContent = score;

    alert(' Try again!');

};


// ========================================
// PLAY AGAIN BUTTON
// ========================================

document.getElementById('playAgain').onclick = function () {

    answer = Math.floor(Math.random() * 6) + 1;

    guesses = 0;

    document.getElementById('guessField').value = '';

    document.getElementById('playAgain').style.display = 'none';

    document.getElementById('myButton').style.display =
        'inline-block';

    alert('New game started! Good luck! ');

};


// ========================================
// SERVICE WORKER
// ========================================

if ('serviceWorker' in navigator) {

    window.addEventListener('load', function () {

        navigator.serviceWorker.register('./service-worker.js')

            .then(function () {
                console.log('Service worker registered!');
            })

            .catch(function (error) {
                console.log('Service worker failed:', error);
            });

    });

}

