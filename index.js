setTimeout(function () {
    document.getElementById('intro').style.display = 'none';
}, 2000)
let answer = Math.floor(Math.random() * 6 + 1);
guesses = 0
let score = 0

document.getElementById('score').innerHTML = score

document.getElementById('myButton').onclick = function () {
    let guess = document.getElementById('guessField').value
    guesses += 1
    if (guess == answer) {
        score += 10
        document.getElementById('score').innerHTML = score
        alert('You won!')
    }
    if (score < 0) {
        score = 0
    }
    else if (guess > 6) {
        alert('Out of Range!')
    }
    else if (guesses >= 3) {
        alert('You are Out.Try harder next time!')
    }

    else {
        score -= 2
    }
    if(score<0) 
        score=0
    {
        alert('Try again!')
         document.getElementById('score').innerHTML = score
    }
    
}