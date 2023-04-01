// Import required modules
import OpenAI from 'openai';
import {initializeApp} from 'firebase/app';
import {getFirestore, collection, addDoc, updateDoc, doc} from 'firebase/firestore';
import {startNewGame, generateStorylineOptions, startGameWithStoryline} from './server';

// OpenAI API Client
const openai = new OpenAI('<YOUR_API_KEY>');

// Function to handle player input
async function handlePlayerInput(inputText) {
  // Determine the type of command based on the prefix (e.g., "action:", "say:", "askgm:")
  const inputParts = inputText.split(':');
  const commandType = inputParts[0].trim();
  const commandContent = inputParts.slice(1).join(':').trim();

  // System message to set the behavior of the AI
  const systemMessage = "You are the game master for a Dungeons and Dragons style game.";

  // User message based on the commandType
  let userMessage = "";
  if (commandType.toLowerCase() === 'action') {
    userMessage = `A player character is attempting to do this action: ${commandContent}. Narrate the outcome of the action.`;
  } else if (commandType.toLowerCase() === 'say') {
    userMessage = `A player character said: "${commandContent}". Respond as the game master.`;
  } else if (commandType.toLowerCase() === 'askgm') {
    userMessage = `A player asked: "${commandContent}". Respond as the game master.`;
  } else {
    userMessage = inputText;
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

  // Display player input and AI response in chat section
  const chatSection = document.getElementById('chat-section');
  chatSection.innerHTML += `<p>Player: ${inputText}</p>`;
  chatSection.innerHTML += `<p>GM: ${aiResponse}</p>`;

  // Scroll to the bottom of the chat section
  chatSection.scrollTop = chatSection.scrollHeight;
}

const inputField = document.getElementById('chat-box');
const submitBtn = document.getElementById('submit-btn');

inputField.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitAction();
  }
});

submitBtn.addEventListener('click', submitAction);

async function submitAction() {
  const inputText = inputField.value.trim();

  if (inputText) {
    await handlePlayerInput(inputText);
    inputField.value = '';
  }
}



// Start the game by generating storylines and initializing a new game
startGameWithStoryline();
