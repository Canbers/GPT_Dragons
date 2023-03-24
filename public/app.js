import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD171rxtQ4U-qOJIn0rCvbotMxtlkFCPkg",
    authDomain: "gpt-dragons.firebaseapp.com",
    databaseURL: "https://gpt-dragons-default-rtdb.firebaseio.com",
    projectId: "gpt-dragons",
    storageBucket: "gpt-dragons.appspot.com",
    messagingSenderId: "439621424805",
    appId: "1:439621424805:web:07adba9fb895e86f22df4c",
    measurementId: "G-8GQ89VJS29"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createCharacter(gameId, characterType, currentGameState = null) {
    // Your character creation logic here
  }


async function generateNpc(currentGameState, races, classes) {
    // Your GPT-3 powered NPC generation logic here
  }
  

async function saveCharacter(gameId, playerName, characterName, characterRace, characterClass, attributes, characterType) {
    const characterRef = doc(db, "games", gameId, "characters");
    const characterData = {
      playerName,
      characterName,
      characterRace,
      characterClass,
      attributes,
      characterType,
    };
  
    const docRef = await addDoc(characterRef, characterData);
    return docRef.id;
  }
  

const inputField = document.getElementById('input');
const submitBtn = document.getElementById('submit-btn');

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAction();
  }
});

submitBtn.addEventListener('click', submitAction);

function submitAction() {
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
  