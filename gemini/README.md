# Gemini AI Chatbot

A simple and elegant chatbot using Google's Gemini AI with Node.js and Express. This project provides a web interface to interact with Google's advanced Gemini AI model.

## Features

- Clean, responsive web interface
- Real-time chat experience with Gemini AI
- Support for code formatting in responses
- Conversation history maintained during a session
- Environment-based configuration

## Prerequisites

Before you begin, make sure you have the following:

- Node.js (v14 or later) installed
- A Google Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Installation

1. Clone this repository or download the source code:

```bash
git clone <repository-url>
cd gemini-chatbot
```

2. Install the required dependencies:

```bash
npm install
```

3. Set up your environment variables:
   - Open the `.env` file
   - Add your Gemini API key to the `.env` file:

```
GEMINI_API_KEY=your_api_key_here
```

## Usage

1. Start the application:

```bash
npm start
```

2. Open your web browser and navigate to:

```
http://localhost:3000
```

3. Start chatting with the Gemini AI through the web interface!

## Configuration Options

You can customize the following options:

- **PORT**: Change the server port by setting the `PORT` environment variable in the `.env` file
- **Model Settings**: Adjust the AI response parameters in `chatbot.js`:
  - `temperature`: Controls randomness (0.0 to 1.0)
  - `topK` and `topP`: Controls diversity of responses
  - `maxOutputTokens`: Limits response length

## Troubleshooting

- **API Key Issues**: If you see an API key error, make sure you've correctly set up your API key in the `.env` file
- **Connection Problems**: Check your internet connection if the chatbot doesn't respond
- **Long Responses**: If responses are cut off, try increasing the `maxOutputTokens` value in the chatbot.js file

## License

This project is licensed under the MIT License.
