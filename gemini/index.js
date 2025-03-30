const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { processUserMessage } = require('./chatbot');
require('dotenv').config();

// Check if API key is set
// if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_api_key_here') {
//   console.error('\x1b[31m%s\x1b[0m', 'ERROR: Gemini API key not configured!');
//   console.log('Please update the GEMINI_API_KEY value in the .env file with your actual API key.');
//   console.log('You can get an API key from https://aistudio.google.com/app/apikey');
//   process.exit(1);
// }

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await processUserMessage(userMessage);
    res.json({ response });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\x1b[32m%s\x1b[0m`, `✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Open your browser and navigate to http://localhost:${PORT} to interact with the chatbot`);
});
