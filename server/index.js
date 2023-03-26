import dotenv from 'dotenv';
dotenv.config();
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { updateDoc, doc } from "firebase/firestore";
import openai from "openai";

// Set the OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');

// Use the API routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const inputField = document.getElementById('input');
const submitBtn = document.getElementById('submit-btn');

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAction();
  }
});

submitBtn.addEventListener('click', submitAction);

export function submitAction() {
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
  
  




  async function startNewGame(gameData) {
    try {
      const gameRef = await addDoc(collection(db, "Games"), gameData);
      console.log(`New game created with ID: ${gameRef.id}`);
      return gameRef.id;
    } catch (e) {
      console.error("Error adding game document: ", e);
    }
  }

  import { updateDoc, doc } from "firebase/firestore";

async function startGameWithStoryline() {
  // Generate storyline options
  const storylines = await generateStorylineOptions();

  // Display storyline options and get user's selection
  // Replace this with the actual user interface for selecting a storyline
  const selectedStoryline = storylines[0]; // Assume the user selected the first storyline

  // Start a new game and save it to the database
  const gameData = {
    storyline: selectedStoryline,
    createdAt: new Date(),
  };

  const gameId = await startNewGame(gameData);

  // Save the game seed (storyline) to the game record in the database
  try {
    const gameRef = doc(db, "Games", gameId);
    await updateDoc(gameRef, {
      seed: selectedStoryline,
    });
  } catch (e) {
    console.error("Error updating game seed: ", e);
  }
}


async function generateStorylineOptions() {
  try {
    const systemMessage = "You are in the position of game master for a Dungeons and Dragons style game. The game is about to start and you want to give your players a choice of what kind of story they want to play. Generate creative, original, and unique Dungeons & Dragons scenarios that provide an intriguing hook and are enticing to players. Do not add 'scenario' or a number as a prefix.";
    const prompt = "Generate 3 scenarios for a Dungeons & Dragons game.";

    const response = await openai.Completion.create({
      engine: "text-davinci-002",
      prompt: `${systemMessage}\n\nUser: ${prompt}`,
      max_tokens: 350,
      n: 1,
      stop: null,
      temperature: 0.9,
    });

    const generatedText = response.choices[0].text;
    const scenarios = generatedText
      .split("\n")
      .filter((s) => s.trim())
      .map((s) => s.trim());

    return scenarios;
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    throw error;
  }
}