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

  // Display player input and AI response in chat section
  const gameLog = document.getElementById('game-log');
  const timestamp = new Date().toLocaleTimeString();

  gameLog.innerHTML += `
    <div class="message">
      <div class="author">Player:</div>
      <div class="text">
        ${inputText}
        <span class="timestamp">${timestamp}</span>
      </div>
    </div>
  `;

  // const aiResponseTimestamp = new Date().toLocaleTimeString();

  // gameLog.innerHTML += `
  //   <div class="message">
  //     <div class="author">GM:</div>
  //     <div class="text">
  //       ${aiResponse}
  //       <span class="timestamp">${aiResponseTimestamp}</span>
  //     </div>
  //   </div>
  // `;


  // Scroll to the bottom of the chat section
  gameLog.scrollTop = gameLog.scrollHeight;

}

document.addEventListener('DOMContentLoaded', () => {
  const inputField = document.getElementById('chat-box');
  const submitBtn = document.getElementById('submit-btn');

  inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitAction();
    }
  });
  

  submitBtn.addEventListener('click', submitAction);

  async function submitAction() {
    try {
      if (inputField.value.trim()) {
        await handlePlayerInput(inputField.value.trim());
        inputField.value = '';
      }
    } catch (error) {
      console.error('Error while submitting action:', error);
    }
  }  
});





// Start the game by generating storylines and initializing a new game
startGameWithStoryline();