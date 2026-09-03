setTimeout(function () {
    document.getElementById('intro').style.display = 'none';
}, 2000)
let answer = Math.floor(Math.random() * 6 + 1);
guesses = 0
let score = Number(localStorage.getItem('score')) || 0
let userguesses = JSON.parse(localStorage.getItem('userguesses')) || []
let wins = Number(localStorage.getItem('wins')) || 0
let losses = Number(localStorage.getItem('losses')) || 0
let gamesPlayed = Number(localStorage.getItem('gamesPlayed')) || 0
let winRate = gamesPlayed > 0 ? wins / gamesPlayed * 100 : 0

document.getElementById('Wins').innerHTML = wins
document.getElementById('losses').innerHTML = losses
document.getElementById('gamesPlayed').innerHTML = gamesPlayed
document.getElementById('winRate').innerHTML = winRate + '%'
document.getElementById('score').innerHTML = score

document.getElementById('myButton').onclick = function () {
    let guess = document.getElementById('guessField').value
    userguesses.push(guess);
    if (userguesses.length > 10)
        userguesses.shift()
    localStorage.setItem('userguesses', JSON.stringify(userguesses))
    document.getElementById('playerHistory').innerHTML = userguesses;
    guesses += 1
    if (guess == answer) {
        score += 10
        document.getElementById('score').innerHTML = score
        alert('You won!')
        wins += 1
        document.getElementById('Wins').innerHTML = wins
        gamesPlayed += 1
        document.getElementById('gamesPlayed').innerHTML = gamesPlayed
        winRate = Math.floor(wins / gamesPlayed * 100)
        localStorage.setItem('score', score)
        localStorage.setItem('wins', wins)
        localStorage.setItem('gamesPlayed', gamesPlayed)
        document.getElementById('winRate').innerHTML = winRate + '%'
        document.getElementById('playAgain').style.display = 'inline-block';
        document.getElementById('myButton').style.display = 'none';
        return

    }
    else if (guess > 6) {
        alert('Out of Range!')
        return
    }
    else if (guesses >= 3) {
        alert('You are Out.Try harder next time!')
        losses += 1
        document.getElementById('losses').innerHTML = losses
        gamesPlayed += 1
        document.getElementById('gamesPlayed').innerHTML = gamesPlayed
        winRate = Math.floor(wins / gamesPlayed * 100)
        localStorage.setItem('losses', losses)
        localStorage.setItem('gamesPlayed', gamesPlayed)
        document.getElementById('winRate').innerHTML = winRate + '%'
        document.getElementById('playAgain').style.display = 'inline-block';
        document.getElementById('myButton').style.display = 'none';
        return
    }

    else {
        score -= 2
    }
    if (score < 0)
        score = 0
    {
        localStorage.setItem('score', score)
        alert('Try again!')
        document.getElementById('score').innerHTML = score
    }

}
document.getElementById('playAgain').onclick = function () {
    answer = Math.floor(Math.random() * 6 + 1);
    guesses = 0;

    document.getElementById('guessField').value = '';
    document.getElementById('playAgain').style.display = 'none';
    document.getElementById('myButton').style.display = 'inline-block';

    alert('New game started! ');
}
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => console.log("Service worker registered!"))
            .catch(error => console.log("Service worker failed:", error));
    });
}
