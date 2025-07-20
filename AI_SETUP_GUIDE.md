# AI Integration Setup Guide

This guide explains how to set up OpenAI and Groq API keys for the ChatBot and ESG Analyzer features.

## API Provider Configuration

The application supports both OpenAI and Groq APIs with automatic fallback:
- **OpenAI** (preferred): Better quality responses, higher context limits
- **Groq** (fallback): Fast inference, free tier available

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `Frontend` directory and add your API keys:

```bash
# AI API Configuration
# You can use either OpenAI or Groq API (or both for fallback)

# OpenAI API (preferred - better quality, higher limits)
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Groq API (alternative - fast inference, free tier available)
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### 2. Getting API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env` file

#### Groq API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in to your account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

### 3. API Provider Priority

The application automatically selects the best available provider:
1. **OpenAI** (if `VITE_OPENAI_API_KEY` is configured)
2. **Groq** (if `VITE_GROQ_API_KEY` is configured)
3. **No provider** (features will show configuration error)

## Features Using AI

### 1. Sustainability ChatBot
- **Location**: Sustainability Dashboard → ChatBot tab
- **Model**: 
  - OpenAI: `gpt-4o-mini` (cost-effective, high quality)
  - Groq: `llama-3.3-70b-versatile` (fast, free tier)
- **Capabilities**: Answers questions about LCA, ESG, packaging sustainability

### 2. ESG Report Analyzer
- **Location**: Sustainability Dashboard → ESG Analyzer tab
- **Model**: Same as ChatBot
- **Capabilities**: Analyzes uploaded PDF reports for ESG metrics and recommendations

## Model Specifications

| Provider | Model | Context Length | Max Output | Cost |
|----------|-------|----------------|------------|------|
| OpenAI | gpt-4o-mini | 128k tokens | 3k tokens | $0.15/1M input, $0.60/1M output |
| Groq | llama-3.3-70b-versatile | 8k tokens | 2k tokens | Free tier available |

## Troubleshooting

### No API Provider Configured
If you see "No AI provider configured" errors:
1. Check your `.env` file exists in the `Frontend` directory
2. Verify the variable names are correct (`VITE_OPENAI_API_KEY` or `VITE_GROQ_API_KEY`)
3. Restart the development server after adding environment variables

### API Key Invalid
If you get authentication errors:
1. Verify the API key is copied correctly (no extra spaces)
2. Check if the API key has sufficient credits/quota
3. Ensure the API key has the necessary permissions

### Rate Limiting
If you encounter rate limits:
1. OpenAI: Check your usage limits in the OpenAI dashboard
2. Groq: Free tier has rate limits; consider upgrading for higher limits

## Configuration Details

The AI configuration is managed in `src/utils/aiConfig.ts`:
- Automatic provider selection
- Context length management
- Token limit optimization
- Error handling

## Security Notes

- Never commit `.env` files to version control
- Use environment-specific API keys
- Monitor API usage and costs
- Rotate API keys regularly for security
