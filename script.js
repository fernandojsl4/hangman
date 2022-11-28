const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const lettersContainer = document.getElementById("letters-container");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const figureParts = document.querySelectorAll(".figure-part");
const correctLetters = [];
const wrongLetters = [];
const herokuWordAPI = "https://random-word-api.herokuapp.com/word";

let selectedWord;

const messages = [
  "You have already entered this letter",
  "Only letters are accepted!",
  "Congratulations! You won!",
  "Unfortunately you lost :(",
];

function updateAlphabetContainer() {
  lettersContainer.innerHTML = `
    ${alphabet
      .split("")
      .map((letter) =>
        wrongLetters.includes(letter) || correctLetters.includes(letter)
          ? `<li class="alphabet-letter--pressed">${letter}</li>`
          : `<li class="alphabet-letter">${letter}</li>`
      )
      .join("")}`;

  lettersContainer
    .querySelectorAll(".alphabet-letter")
    .forEach((elem) =>
      elem.addEventListener("click", () => processPressedLetter(elem.innerHTML))
    );
}

async function getWordFromAPI(herokuWordAPI) {
  const response = await fetch(herokuWordAPI);
  var data = await response.json();
  return data[0].toUpperCase();
}

// Show hidden word.
function displayWord() {
  wordEl.innerHTML = `
    ${selectedWord
      .split("")
      .map(
        (letter) => `
        <span class="letter">
          ${correctLetters.includes(letter) ? letter : ""}
        </span>
      `
      )
      .join("")}
  `;

  const innerWord = wordEl.innerText.replace(/\n/g, "");

  if (innerWord === selectedWord) {
    finalMessage.innerText = messages[2];
    popup.style.display = "flex";
  }
}

// Update the wrong letters
function updateWrongLettersEl() {
  // Display wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? "<p>Wrong Letters</p>" : ""}
  ${wrongLetters.map((letter) => `<span> ${letter}</span>`)}
  `;

  // Display parts
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if lost
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = messages[3] + ". The word was " + selectedWord;
    popup.style.display = "flex";
  }
}

// Show notifications
function showNotification(notificationMsg) {
  notification.innerHTML = `<p>${notificationMsg}</p>`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// Process user pressed key
function processPressedLetter(letter) {
  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
      displayWord();
      updateAlphabetContainer();
    } else {
      showNotification(messages[0]);
    }
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter.toUpperCase());

      updateWrongLettersEl();
      updateAlphabetContainer();
    } else {
      showNotification(messages[0]);
    }
  }
}

// Key down letter press
window.addEventListener("keydown", (e) => {
  const keyType = e.code.substring(0, 3);
  if (keyType === "Key") {
    const letter = e.key.toUpperCase();
    processPressedLetter(letter);
  } else {
    showNotification(messages[1]);
  }
});

// Restart game and play again
playAgainBtn.addEventListener("click", async () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  initializeGame();
  updateWrongLettersEl();
  updateAlphabetContainer();

  popup.style.display = "none";
});

initializeGame = async () => {
  selectedWord = await getWordFromAPI(herokuWordAPI);
  console.log("Shhhh!! Don't tell anyone... this is the word " + selectedWord);
  displayWord();
};

updateAlphabetContainer();
initializeGame();
