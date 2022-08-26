// static
const timeToAnswer = 10;
const timeToLowerScore = 5;
const pointsForCorrect = 5;

// sounds 
let sfxWon = new Audio('/sfx/won.wav');

// helper
const categories = [];
let questions;
let currentQuestion;
let imageElement;
let scoreElement;
let timeElement;
let endscoreElement;

// in game
let timer;
let currentQuestionNr;
let score;
let scoreToAdd;
let answersCorrect;
let answersWrong;
let showPointsTimer;

function startGame() {
  document.getElementsByClassName('menu')[0].style = 'display: none';
  document.getElementsByClassName('question')[0].style = 'display: visible';

  // init
  currentQuestionNr = 0;
  score = 0;
  answersCorrect = 0;
  answersWrong = 0;
  addScore(0);

  setTimeout(startQuestion, 100);
}

function gameOver() {
  document.getElementsByClassName('menu')[0].style = 'display: visible';
  document.getElementsByClassName('question')[0].style = 'display: none';
  
  while (endscoreElement.firstChild) {
    endscoreElement.removeChild(endscoreElement.firstChild)
  }

  let endscore = document.createElement('h2');
  let total = answersCorrect + answersWrong;
  let procent = Math.round((answersCorrect * 10000) / total) / 100;
  endscore.innerText = 'Van de ' + total + ' vragen had u ' + answersCorrect + ' goed (' + procent + '%). Uw score was: ' + score;
  endscoreElement.appendChild(endscore);

  if (procent === 100) {
    flash('Foutloos!', 200);
    sfxWon.play();
  }
  if (procent === 0) {
    flash('😱', 200);
  } 
}

function startQuestion() {
  loadQuestion(questions[currentQuestionNr]);
}

function showPointsToWin() {
  if (timer > 0) {
    timer--;
    if (timer < timeToLowerScore) {
      if (scoreToAdd > 0) {
        scoreToAdd--;
      }
    }
    showTime();
    showPointsTimer = setTimeout(showPointsToWin, 1000); // second
  }
  else {
    selectAnswer('wrong');
  }
}

function loadQuestion(question) {
  currentQuestion = question;
  scoreToAdd = pointsForCorrect;
  timer = timeToAnswer;
  showPointsToWin();
  imageElement.setAttribute('src', 'img/' + question.img);
}

function onClick(event) {
  selectAnswer(event.target.getAttribute('data'));
}

function selectAnswer(answer) {
  if (showPointsTimer) {
    clearTimeout(showPointsTimer);
  }

  if (currentQuestion) {    
    if (currentQuestion.category.toLowerCase() === answer.toLowerCase()) {
      answersCorrect++;
      addScore(scoreToAdd);
    } else {
      answersWrong++;
    }
  }
  currentQuestionNr++;
  if (currentQuestionNr >= questions.length) {
    gameOver();
  } else {
    setTimeout(startQuestion, 100);
  }
}

function addScore(points) {
  score = score + points;
  scoreElement.innerText = "Score: " + score;
}

function showTime() {
  timeElement.innerText = "Tijd: " + timer;
}

document.addEventListener('DOMContentLoaded', () => {
  imageElement = document.getElementById('image');
  scoreElement = document.getElementById('score');
  timeElement = document.getElementById('time');
  endscoreElement = document.getElementById('endscore');

  fetch("/questions.json")
    .then(response => response.json())
    .then(data => {
      questions = data;

      questions.forEach(q => {
        if (!categories.includes(q.category)) {
          categories.push(q.category);
        }
      });
      categories.sort();
      questions.sort(() => Math.random() - 0.5);

      let actions = document.getElementsByClassName('actions')[0];

      for (let i = 0; i < categories.length; i++) {
        let button = document.createElement('button');
        button.setAttribute('data', categories[i]);
        button.innerText = (i + 1) + '. '+ categories[i];
        button.onclick = onClick;

        actions.appendChild(button);
      }
    
      document.onkeyup = function (event) {
        for (let i = 0; i < categories.length; i++) {
          if (event.key === '' + (i + 1)) {
            selectAnswer(categories[i]);
          }
        }
      };    
    });
});

function flash(word, times) {
  setTimeout(placeFlash, 10, [word, times])  
}

function placeFlash(args) {  
  let flash = document.getElementById('flash');
  let x = window.innerWidth;
  let y = window.innerHeight;
  let rotate = (180 * Math.random()) - 90;
  let size = (15 + (50 * Math.random())) * 2;
  let e = document.createElement('p');

  e.innerText = args[0];
  e.style.color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
  e.style.fontSize = size + 'px';
  e.style.textShadow = '#fff 1px 0 15px';
  e.style.transform = 'rotate(' + rotate + 'deg)';
  e.style.position = 'absolute';
  e.style.top = Math.floor(Math.random() * y) + 'px';
  e.style.left = Math.floor(Math.random() * x) + 'px';
  flash.appendChild(e);

  let times = args[1];
  if (times > 0) {
    times--;
    setTimeout(placeFlash, 50, [args[0], times])
  } else {
    setTimeout(unflash, 2000);
  }
}

function unflash() {
  let flash = document.getElementById('flash');

  while(flash.lastChild) {
    flash.removeChild(flash.lastChild);
  }
}