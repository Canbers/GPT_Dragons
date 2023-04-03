// Import required modules and packages
const firebase = require('firebase/app');
const firebaseConfig = require('./config');
const { getFirestore, collection, addDoc, doc, updateDoc } = require('firebase/firestore');
const openai = require('openai');
const express = require('express');
const bodyParser = require('body-parser');
const functions = require('firebase-functions');

// Initialize express app
const app = express();

// Use firebase functions for deployment
exports.api = functions.https.onRequest(app);


firebase.initializeApp(firebaseConfig);
const db = getFirestore();

// Set up express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


app.get('/start-game', async (req, res) => {
  try {
    const scenarios = await generateStorylineOptions();
    res.json({ scenarios });
  } catch (error) {
    console.error(`Error generating scenarios: ${error}`);
    res.status(500).json({ error: 'Failed to generate scenarios' });
  }
});

// Start listening for incoming requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Start a new game and save the game data to the database
 * @param {Object} gameData - Game data to be saved
 * @returns {string} - ID of the newly created game
 */
async function startNewGame(gameData) {
  try {
    const gameRef = await addDoc(collection(db, 'Games'), gameData);
    console.log(`New game created with ID: ${gameRef.id}`);
    return gameRef.id;
  } catch (e) {
    console.error('Error adding game document: ', e);
  }
}

/**
 * Generate 3 scenarios for a Dungeons & Dragons game and save the user-selected scenario to the database
 */
async function startGameWithStoryline() {
  // Generate storyline options
  const storylines = await generateStorylineOptions();

  // Display storyline options and get user's selection
  const selectedStoryline = storylines[0]; // Assume the user selected the first storyline

  // Start a new game and save it to the database
  const gameData = {
    storyline: selectedStoryline,
    createdAt: new Date(),
  };

  const gameId = await startNewGame(gameData);

  // Save the game seed (storyline) to the game record in the database
  try {
    const gameRef = doc(db, 'Games', gameId);
    await updateDoc(gameRef, {
      seed: selectedStoryline,
    });
  } catch (e) {
    console.error('Error updating game seed: ', e);
  }
}

/**
 * Generate 3 scenarios for a Dungeons & Dragons game
 * @returns {Array} - Array of generated scenarios
 */
async function generateStorylineOptions() {
    try {
      const systemMessage =
        'You are in the position of game master for a Dungeons and Dragons style game. The game is about to start and you want to give your players a choice of what kind of story they want to play. Generate creative, original, and unique Dungeons & Dragons scenarios that provide an intriguing hook and are enticing to players. Do not add "scenario" or a number as a prefix.';
      const prompt = 'Generate 3 scenarios for a Dungeons & Dragons game.';
  
      const response = await openai.Completion.create({
        engine: 'gpt-3.5-turbo',
        prompt: `${systemMessage}\n\nUser: ${prompt}`,
        max_tokens: 350,
        n: 1,
        stop: null,
        temperature: 0.9,
      });
  
      const generatedText = response.choices[0].text;
      const scenarios = generatedText
        .split('\n')
        .filter((s) => s.trim())
        .map((s) => s.trim());
  
      return scenarios;
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      throw error;
    }
  }
  
  /**
   * Get AI response for a given system and user message
   * @param {string} systemMessage - System message to set the context
   * @param {string} userMessage - User message as input
   * @returns {string} - AI's response
   */
  async function getAIResponse(systemMessage, userMessage) {
    try {
      // Call the OpenAI GPT API
      const response = await openai.Completion.create({
        engine: 'gpt-3.5-turbo',
        prompt: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });
  
      // Extract AI's response
      const aiResponse = response.choices[0].text.trim();
      return aiResponse;
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      throw error;
    }
  }