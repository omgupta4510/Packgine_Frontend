# OpenAI Integration for Sustainability Chatbot

Your chatbot and ESG analyzer have been successfully updated to use OpenAI instead of Groq!

## What's Changed

### 1. **ChatBot Component** (`src/components/sustainability/ChatBot.tsx`)
- Now uses OpenAI's GPT-3.5-turbo model for more accurate responses
- Improved error handling and user feedback
- Better conversation context management

### 2. **ESG Analyzer** (`src/components/sustainability/ESGAnalyzer.tsx`)
- Uses OpenAI's GPT-4o-mini model for more detailed ESG analysis
- Enhanced report analysis capabilities
- More comprehensive scoring and recommendations

### 3. **New OpenAI Service** (`src/services/openaiService.ts`)
- Centralized OpenAI API management
- Proper error handling for API quotas and rate limits
- Reusable service for both chatbot and ESG analysis

## Configuration

Your `.env` file is already configured with:
```env
VITE_OPENAI_API_KEY=sk-proj-YvyxGg... (your key is already set)
```

## Features

### Sustainability Chatbot
- Expert advice on LCA, ESG reporting, and packaging sustainability
- Real-time responses powered by OpenAI
- Typing animation for better user experience
- Sample questions to get started

### ESG Report Analyzer
- Upload PDF reports for automated analysis
- Comprehensive scoring (Environmental, Social, Governance)
- Letter grade ratings (A+ to F)
- Specific recommendations and action items
- Risk assessment and mitigation strategies

## How It Works

1. **User Authentication**: Users must be logged in to access the chatbot
2. **Chat Interface**: Ask questions about sustainability and packaging
3. **ESG Analysis**: Upload PDF reports for detailed AI analysis
4. **Real-time Responses**: Get instant expert advice powered by OpenAI

## API Usage

- **ChatBot**: Uses `gpt-3.5-turbo` (cost-effective for conversations)
- **ESG Analyzer**: Uses `gpt-4o-mini` (more capable for document analysis)
- **Token Limits**: 800 tokens for chat, 2000 tokens for ESG analysis
- **Error Handling**: Graceful fallbacks for API issues

## Getting Started

1. Make sure your OpenAI API key has sufficient credits
2. Start the development server: `npm run dev`
3. Navigate to the Sustainability page
4. Login as a user or supplier
5. Start chatting or upload an ESG report!

## Troubleshooting

If you encounter issues:
1. Check your OpenAI API key is valid and has credits
2. Ensure you're logged in to access the features
3. Check the browser console for detailed error messages
4. Verify your internet connection

The integration is simple, effective, and ready to use! 🌱
