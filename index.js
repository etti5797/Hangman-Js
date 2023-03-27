const hangmanDisplay = document.querySelector("#hangmanCanvs");
const hiddenWordDisplay = document.querySelector("#wordCanvs");
const incorrectsDisplay = document.querySelector("#wrongLettersCanvs");
const clickingErrorMsg = document.querySelector("#clickingErrorMsg");
const gameOverContainer = document.querySelector(".gameOverWrapper")
const gameOverMsg = document.querySelector("#gameOverMsg");
const restartBtn = document.querySelector("#restartBtn");

const wordList = [
    "spider",
    "cellphone",
    "biology",
    "downfall",
    "music",
    "project",
    "puzzling",
    "puppy",
    "beekeeper",
    "electricity",
    "panda",
    "computer",
    "anime",
    "netflix",
    "disneyland",
    "picture",
    "princess",
    "random",
    "necklace",
    "superhero",
    "movie",
    "wallet",
    "kindergarten",
    "dolphin",
    "pizza",
    "airplane",
    "earthquake"
];


let mistakesCounter = 0;
let selectedWord = null;  
let guessedLetters = [];
let wrongGuesses = "";
let userWord = []; 
let gameOver = false;



/***************************Helper functions:****************************/

function chooseWord()
{
    let idx = Math.floor(Math.random() * wordList.length);
    selectedWord = wordList[idx];
}

// WrongChoicesCanvas = the canvas that wrote the mistaken letters that the user used
function clearWrongChoicesCanvas()
{
    var brush = incorrectsDisplay.getContext("2d");
    brush.clearRect(0,0,incorrectsDisplay.width, incorrectsDisplay.height);
}

// write on the canvas the mistaken letters that the user used 
function updateWrongChoicesCanvas()
{
    var brush = incorrectsDisplay.getContext("2d");
    brush.clearRect(0, 0, incorrectsDisplay.width, incorrectsDisplay.height);
    if(wrongGuesses.length >= 1) // the user typed at least one wrong letter
    {
        brush.font = "25px Fasthand";
        brush.fillStyle = "white";
        brush.fillText("Wrong: " + wrongGuesses, 40,50);
    }
    
}

// update the user's guess word after guessing a correct letter
function updateUserWord(letter)
{
    for(let i = 0; i < selectedWord.length; i++)
    {
        if(selectedWord[i] == letter)
        {
            userWord[i] = letter;
        }
    }

}


function drawHangman(numMistake)
{
    var brush = hangmanDisplay.getContext("2d");
    brush.strokeStyle = "white";
    switch(numMistake)
    {
        case 1: // draw head
            brush.beginPath();
            brush.arc(120, 50, 25, 0, Math.PI*2);
            brush.stroke();
            brush.closePath();
            break;
        case 2: // draw body-line
            brush.beginPath();
            brush.moveTo(120, 75);
            brush.lineTo(120, 140);
            brush.stroke();
            brush.closePath();
            break;
        case 3: // draw left arm
            brush.beginPath();
            brush.moveTo(120, 85);
            brush.lineTo(80, 100);
            brush.stroke();
            brush.closePath();
            break;
        case 4: // draw right arm
            brush.beginPath();
            brush.moveTo(120, 85);
            brush.lineTo(160, 100);
            brush.stroke();
            brush.closePath();
            break;
        case 5: // draw left leg
            brush.beginPath();
            brush.moveTo(120, 140);
            brush.lineTo(100, 190);
            brush.stroke();
            brush.closePath();
            break;
        case 6: // draw right leg
            brush.beginPath();
            brush.moveTo(120, 140);
            brush.lineTo(145, 190);
            brush.stroke();
            brush.closePath();
            break;
    }
}

function initializeHangmanCanvas()
{
    var brush = hangmanDisplay.getContext("2d");
    brush.clearRect(0, 0, hangmanDisplay.width, hangmanDisplay.height);
}

function drawGallows()
{
    var brush = hangmanDisplay.getContext("2d");
    brush.strokeStyle = "white";
    brush.beginPath();
    brush.moveTo(10, 230);
    brush.lineTo(175, 230);
    brush.moveTo(45, 230);
    brush.lineTo(45, 5);
    brush.lineTo(120, 5);
    brush.lineTo(120, 25);
    brush.stroke();
    brush.closePath();
}

/* draw the hidden word on the canvas.
first the word will be represented with dashes, then every time the user guess a correct letter,
the function will reveal it and update the word which is shown on the canvas */
function drawHiddenWord()
{
    const numDashes = selectedWord.length;
    const spaceSizeBetweenDashes = 6;
    const numSpaces = numDashes + 1; // num-1 spaces between the lettes +2 spaces from right && left sides of the canvas
    const spaceForDashes = hiddenWordDisplay.width - (numSpaces * spaceSizeBetweenDashes);
    const dashSize = spaceForDashes / numDashes;

    var brush = hiddenWordDisplay.getContext("2d");
    brush.clearRect(0,0,hiddenWordDisplay.width, hiddenWordDisplay.height);
    let x = spaceSizeBetweenDashes;
    let y = 130;
    brush.font = `${dashSize}px Arial bold`; // doing so letter && dash take some amount of space in the canvas
    brush.beginPath();
    for(let i = 0; i < numDashes; i++)
    {
        brush.fillStyle = (userWord[i] == "_") ? "#BB1DCF" : "white";
        brush.fillText(userWord[i], x, y);
        x = x + dashSize + spaceSizeBetweenDashes;
    }
    brush.closePath();
}

function displayGameOverMsg(isWon) 
{
    gameOver = true;
    let msg = (isWon) ? `Hurray! You won! '${selectedWord}' is correct!` :`You lost. The right word is '${selectedWord}'`;
    gameOverContainer.style.display = "block";
    gameOverMsg.textContent = msg;
}

// initialize to ["_"] * (selectedWord.length)
function initalizeUserWord()
{
    for(let idx = 0; idx < selectedWord.length; idx++)
    {
        userWord.push("_");

    } 
}


function handleKeyPress(event)
{
    if(gameOver == false) // if gameOver = true we will not react to the user typing
    {
        const letter = event.key.toLowerCase();
        if(/^[a-z]$/.test(letter)) // the typed key fit the pattern of 1 letter
        {
            
            if(guessedLetters.includes(letter))
            {
                clickingErrorMsg.textContent = `You have already clicked on the letter ${letter}`;
                setTimeout(() => {clickingErrorMsg.textContent = "";}, 1200);
            }
            else
            {
                guessedLetters.push(letter);
                if(selectedWord.includes(letter) == false)
                {
                    mistakesCounter += 1;
                    gameOver = (mistakesCounter == 6);
                    wrongGuesses = (mistakesCounter == 1) ? wrongGuesses + " " + letter : wrongGuesses + ", " + letter;
                    clearWrongChoicesCanvas();
                    updateWrongChoicesCanvas();
                    drawHangman(mistakesCounter);
                    if(gameOver)
                    {
                        displayGameOverMsg(false);
                    }
                }
                else
                {
                    updateUserWord(letter);
                    drawHiddenWord();
                    if(userWord.includes("_") == false) // the user won (his guess == selectedWord)
                    {
                        displayGameOverMsg(true);
                    }
                }
            }
    
        } 
    }
}

function startGame()
{
    initializeHangmanCanvas();
    drawGallows();
    clearWrongChoicesCanvas();
    chooseWord();
    initalizeUserWord();
    drawHiddenWord();
}

function startNewGame(){
    gameOverMsg.textContent = "";
    gameOverContainer.style.display = "none";
    mistakesCounter = 0;
    wrongGuesses = "";
    selectedWord = null;
    guessedLetters = [];
    userWord = [];
    gameOver = false;
    startGame();
}

/***************************EventListeners:****************************/
/*
The first event will handle the flow of the game, based on the letters the user types
The second event will start a new game after clicking the restart button, which is shown
to the user only after the end of the game
*/

window.addEventListener('keydown', handleKeyPress);
restartBtn.addEventListener('click', startNewGame);

/***************************Start the game:****************************/
startGame();