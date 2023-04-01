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


async function startNewGame(gameData) {
  try {
    const gameRef = await addDoc(collection(db, "Games"), gameData);
    console.log(`New game created with ID: ${gameRef.id}`);
    return gameRef.id;
  } catch (e) {
    console.error("Error adding game document: ", e);
  }
}

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
      engine: "gpt-3.5-turbo",
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

  // Call the OpenAI GPT API
  const response = await openai.createCompletion({
    model: 'gpt-3.5-turbo', // You can also use 'gpt-4' here
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 150,
    temperature: 0.7
  });
  
  // Extract AI's response
  const aiResponse = response.data.choices[0].message.content.trim();