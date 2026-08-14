let answer = Math.floor(Math.random()*6+1);
guesses=0

document.getElementById('myButton').onclick=function(){
let guess=document.getElementById('guessField').value
guesses+=1
if(guess==answer){
    alert('You won!')
}
else{
    alert('Try again!')
}
}
