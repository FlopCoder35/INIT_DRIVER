const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// History to maintain conversation context
let chatHistory = [];

// Maximum history items to keep (to avoid token limits)
const MAX_HISTORY_LENGTH = 10;

async function processUserMessage(message) {
  try {
    // Add user message to history
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    
    // Trim history if it exceeds the maximum length
    if (chatHistory.length > MAX_HISTORY_LENGTH) {
      chatHistory = chatHistory.slice(chatHistory.length - MAX_HISTORY_LENGTH);
    }

    // Get Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Start a chat session
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Generate response from the AI
    const result = await chat.sendMessage(message);
    const response = result.response;
    const responseText = response.text();

    // Add AI response to history
    chatHistory.push({ role: "model", parts: [{ text: responseText }] });

    return responseText;
  } catch (error) {
    console.error('Error in Gemini AI processing:', error);
    
    // Check if it's an API key issue
    if (error.message.includes('API key')) {
      return "Error: Invalid API key. Please check your GEMINI_API_KEY in the .env file.";
    }
    
    return "Sorry, I encountered an error while processing your request. Please try again later.";
  }
}

module.exports = { processUserMessage };
