const guessedLettersElement = document.querySelector(".guessed-letters");
const guessLetterButton = document.querySelector(".guess");
const inputLetter = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesElement = document.querySelector(".remaining");
const remainingGuessesSpan = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "magnolia";
let guessedLetters = [];
let numRemainingGuesses = 8;

const getWord = async function () {
    const userRequest = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");

    const words = await userRequest.text();
    const wordArray = words.split("\n");
    const randomWordFromLibraryIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomWordFromLibraryIndex].trim();
    placeholder(word);
}
getWord();

const placeholder = function (word) {
    const placeholderLetters = [];
    for (const letter of word) {
        // console.log(letter)
        placeholderLetters.push("●");
    }
    wordInProgress.innerText = placeholderLetters.join("");
} 

placeholder(word);

guessLetterButton.addEventListener("click", function (event) {
    event.preventDefault();
    const guess = inputLetter.value;
    // console.log(guess);
    inputLetter.value = "";
    message.innerText = "";
    const goodGuess = checkInput(guess);
    console.log(goodGuess);
    if (goodGuess) {
        makeGuess(goodGuess);
    }
})


const checkInput = function (input) {
    const acceptedLetter = /[a-zA-Z]/;  
    if (input.length === 0) {
        message.innerText = "Please enter a letter";
    } else if (input.length > 1) {
        message.innerText = "Please only enter one letter";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please enter a normal letter!";
    } else {
        return input;
    }      
}

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "You've already guessed that one bub!";
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        showGuessedLetters();
        updateGuessesRemaining(guess);
        updateWordInProgress(guessedLetters);
    }
}

const showGuessedLetters = function () {
 guessedLettersElement.innerHTML = "";
    for(const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersElement.append(li);
    }
}

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealedWord = [];
    for(const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealedWord.push(letter.toUpperCase());
        } else {
            revealedWord.push("●");
        }
    }
    wordInProgress.innerText = revealedWord.join("");
    checkIfWin();
}

const updateGuessesRemaining = function(guess) {
    const wordUpper = word.toUpperCase();
    if (!wordUpper.includes(guess)) {
        message.innerText = `There's no ${guess} you're blowing it!`;
        numRemainingGuesses -= 1;
    } else {
        message.innerText = `Nice, it does have a ${guess}, look at you`;
    }
    if (numRemainingGuesses === 0) {
        message.innerHTML = `Game over, the word was <span class="highlight">${word}</span>`;
        remainingGuessesSpan.innerText = `NOTHING`;
        startOver();
    } else if (numRemainingGuesses === 1) {
        remainingGuessesSpan.innerText = `${numRemainingGuesses} guess left`;
    } else {
        remainingGuessesSpan.innerText = ` ${numRemainingGuesses} guesses`;
    }
}

const checkIfWin = function() {
    if (word.toUpperCase() === wordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
       
    startOver();
    }
}

const startOver = function() {
    guessLetterButton.classList.add("hide");
    remainingGuessesElement.classList.add("hide");
    guessedLettersElement.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function() {
    message.classList.remove("win");
    numRemainingGuesses = 8;
    guessedLetters = [];
    remainingGuessesSpan.innerText = `${numRemainingGuesses} guesses`;
    guessLetterButton.classList.remove("hide");
    remainingGuessesElement.classList.remove("hide");
    guessedLettersElement.classList.remove("hide");
    getWord();
})