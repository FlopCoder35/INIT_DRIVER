const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Mock response generation for demo mode
function generateMockResponse(message) {
    // Some predefined responses to make the demo seem realistic
    const responses = {
        "hello": "Hello! I'm a simulated Gemini AI assistant. This is a demo mode without requiring an API key.",
        "what can you do": "In this demo, I can respond to a few predefined queries. In the real application with a valid API key, I can answer questions, write code, discuss ideas, and much more!",
        "who are you": "I'm a simulated version of the Gemini AI assistant. In the full version, I would be powered by Google's Gemini large language model.",
        "how does this work": "This demo is providing mock responses to show how the interface works. To use the actual AI, you'll need to add a Gemini API key to the .env file.",
        "code": "Here's a simple JavaScript function example:\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('World'));\n```",
        "write a function": "Here's a utility function to calculate Fibonacci numbers:\n```javascript\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n-1) + fibonacci(n-2);\n}\n\n// Generate first 10 Fibonacci numbers\nfor (let i = 0; i < 10; i++) {\n  console.log(fibonacci(i));\n}\n```",
        "api key": "To use the actual Gemini AI, you need to:\n1. Get an API key from https://aistudio.google.com/app/apikey\n2. Add it to the .env file as GEMINI_API_KEY=your_key_here\n3. Restart the application"
    };

    // Default response for messages that don't match predefined queries
    let response = "This is a demo mode. With a valid Gemini API key, I would provide a real response to your query. Try asking 'what can you do' or 'how does this work'.";
    
    // Check for matches in our predefined responses (case insensitive)
    const messageLower = message.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
        if (messageLower.includes(key)) {
            response = value;
            break;
        }
    }

    return response;
}

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

        // Generate a mock response with a small delay to simulate API call
        setTimeout(() => {
            const response = generateMockResponse(userMessage);
            res.json({ response });
        }, 1000);
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ error: 'Failed to process message', details: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\x1b[32m%s\x1b[0m`, `✓ DEMO SERVER running on http://localhost:${PORT}`);
    console.log(`✓ Open your browser and navigate to http://localhost:${PORT} to interact with the demo chatbot`);
    console.log(`\x1b[33m%s\x1b[0m`, `NOTE: This is running in DEMO MODE with simulated responses`);
    console.log(`To use the actual Gemini AI, add your API key to the .env file and run 'npm start' instead`);
});
