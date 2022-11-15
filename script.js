const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");

const figureParts = document.querySelectorAll(".figure-part");

const herokuWordAPI = "https://random-word-api.herokuapp.com/word";
// const words = ["Python", "Javascript", "Heroku", "React"];
const messages = [
  "You have already entered this letter",
  "Only letters are accepted!",
  "Congratulations! You won!",
  "Unfortunately you lost :(",
];

// let selectedWord = words[Math.floor(Math.random() * words.length)];

let selectedWord = getWordFromAPI(herokuWordAPI);

const correctLetters = [];
const wrongLetters = [];

async function getWordFromAPI(herokuWordAPI) {
  const response = await fetch(herokuWordAPI);
  var data = await response.json();
  return data[0];
}

// Show hidden word.
function displayWord() {
  console.log(selectedWord);
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
  // wrongLettersEl.innerHTML = `<p>Wrong letters</p><span>${wrongLetters.toString()}</span>`;
  // Display wrong letters
  wrongLettersEl.innerHTML = `
  ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
  ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
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
    finalMessage.innerText = messages[3];
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

// Key down letter press
window.addEventListener("keydown", (e) => {
  const keyType = e.code.substring(0, 3);
  if (keyType === "Key") {
    const letter = e.key;

    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification(messages[0]);
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification(messages[0]);
      }
    }
  } else {
    showNotification(messages[1]);
  }
});

// Restart game and play again
playAgainBtn.addEventListener("click", async () => {
  correctLetters.splice(0);
  wrongLetters.splice(0);

  // selectedWord = words[Math.floor(Math.random() * words.length)];
  selectedWord = await getWordFromAPI(herokuWordAPI);

  displayWord();

  updateWrongLettersEl();

  popup.style.display = "none";
});

initializeGame = async () => {
  selectedWord = await getWordFromAPI(herokuWordAPI);
  console.log(selectedWord);
  displayWord();
};
initializeGame();
