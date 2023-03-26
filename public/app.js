// app.js

const inputField = document.getElementById('input');
const submitBtn = document.getElementById('submit-btn');

inputField.addEventListener('keydown', (event) => {
  console.log('keydown event triggered'); // Add console log here
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAction();
  }
});

submitBtn.addEventListener('click', submitAction);

function submitAction() {
  console.log('submitAction function called'); // Add console log here
  const inputText = inputField.value.trim();

  if (inputText) {
    // Add the input text to the game log
    const gameLog = document.getElementById('game-log');
    const newEntry = document.createElement('div');
    newEntry.classList.add('message');
    newEntry.classList.add('player1'); // Change this to the actual player's class

    const messageHeader = document.createElement('div');
    messageHeader.classList.add('message-header');
    newEntry.appendChild(messageHeader);

    const timestamp = document.createElement('span');
    timestamp.classList.add('message-timestamp');
    timestamp.textContent = new Date().toLocaleTimeString();
    messageHeader.appendChild(timestamp);

    const playerName = document.createElement('span');
    playerName.textContent = 'Player1'; // Change this to the actual player name
    messageHeader.appendChild(playerName);

    const messageContent = document.createElement('span');
    messageContent.classList.add('message-content');
    messageContent.textContent = inputText;
    newEntry.appendChild(messageContent);

    gameLog.appendChild(newEntry);

    // Scroll the game log to the bottom to show the most recent text
    gameLog.scrollTop = gameLog.scrollHeight;

    // Clear the input field
    inputField.value = '';

    // TODO: Process the input text, update the game state, and synchronize with other players
  }
}
