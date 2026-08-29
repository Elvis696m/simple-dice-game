setTimeout(function () {
    document.getElementById('intro').style.display = 'none';
}, 2000)
let answer = Math.floor(Math.random() * 6 + 1);
guesses = 0
let score = 0
let userguesses = []
document.getElementById('score').innerHTML = score

document.getElementById('myButton').onclick = function () {
    let guess = document.getElementById('guessField').value
    userguesses.push(guess);
    document.getElementById('playerHistory').innerHTML = userguesses;
    guesses += 1
    if (guess == answer) {
        score += 10
        document.getElementById('score').innerHTML = score
        alert('You won!')
        return
    }
    else if (guess > 6) {
        alert('Out of Range!')
        return
    }
    else if (guesses >= 3) {
        alert('You are Out.Try harder next time!')
        return
    }

    else {
        score -= 2
    }
    if (score < 0)
        score = 0
    {
        alert('Try again!')
        document.getElementById('score').innerHTML = score
    }

}
