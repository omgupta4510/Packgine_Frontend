// Frontend AI Configuration Utility
// This handles client-side AI provider configuration for ChatBot and ESG Analyzer

export interface AIProvider {
  apiUrl: string;
  model: string;
  apiKey: string;
  provider: string;
  maxTokens: number;
  contextLength: number;
  temperature: number;
}

// Model configurations for different providers
const MODEL_CONFIGS = {
  openai: {
    'gpt-4o-mini': {
      maxTokens: 3000,
      contextLength: 128000,
      temperature: 0.7
    },
    'gpt-4o': {
      maxTokens: 4000,
      contextLength: 128000,
      temperature: 0.7
    },
    'gpt-3.5-turbo': {
      maxTokens: 2000,
      contextLength: 16000,
      temperature: 0.7
    }
  },
  groq: {
    'llama-3.3-70b-versatile': {
      maxTokens: 2000,
      contextLength: 8000,
      temperature: 0.7
    },
    'llama-3.1-70b-versatile': {
      maxTokens: 2000,
      contextLength: 8000,
      temperature: 0.7
    },
    'llama-3.1-8b-instant': {
      maxTokens: 1500,
      contextLength: 8000,
      temperature: 0.7
    }
  }
};

export const getAIProvider = (): AIProvider | null => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  
  // Provider priority: OpenAI first (better quality), then Groq (fast, free tier)
  if (OPENAI_API_KEY) {
    const model = 'gpt-4o-mini'; // Cost-effective model with good performance
    const config = MODEL_CONFIGS.openai[model];
    
    return {
      apiUrl: "https://api.openai.com/v1/chat/completions",
      model,
      apiKey: OPENAI_API_KEY,
      provider: "OpenAI",
      maxTokens: config.maxTokens,
      contextLength: config.contextLength,
      temperature: config.temperature
    };
  } 
  
  if (GROQ_API_KEY) {
    const model = 'llama-3.3-70b-versatile';
    const config = MODEL_CONFIGS.groq[model];
    
    return {
      apiUrl: "https://api.groq.com/openai/v1/chat/completions",
      model,
      apiKey: GROQ_API_KEY,
      provider: "Groq",
      maxTokens: config.maxTokens,
      contextLength: config.contextLength,
      temperature: config.temperature
    };
  }
  
  return null;
};

export const getTextLimitForProvider = (provider: string): number => {
  // Conservative character limits to stay within token limits
  // Rule of thumb: 1 token ≈ 4 characters for English text
  switch (provider) {
    case 'OpenAI':
      return 12000; // ~3k tokens for safety
    case 'Groq':
      return 8000;  // ~2k tokens for safety
    default:
      return 6000;  // Safe default
  }
};

export const getProviderInfo = (): string => {
  const provider = getAIProvider();
  if (!provider) {
    return "No AI provider configured";
  }
  return `${provider.provider} (${provider.model})`;
};

export const isAIConfigured = (): boolean => {
  return getAIProvider() !== null;
};

// Get available providers (for debugging/status)
export const getAvailableProviders = (): string[] => {
  const providers: string[] = [];
  
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    providers.push('OpenAI');
  }
  
  if (import.meta.env.VITE_GROQ_API_KEY) {
    providers.push('Groq');
  }
  
  return providers;
};

// Error messages for common issues
export const AI_ERROR_MESSAGES = {
  NO_PROVIDER: "No AI provider configured. Please add VITE_OPENAI_API_KEY or VITE_GROQ_API_KEY to your .env file.",
  INVALID_KEY: "Invalid API key. Please check your configuration.",
  RATE_LIMIT: "Rate limit exceeded. Please try again later.",
  QUOTA_EXCEEDED: "API quota exceeded. Please check your usage limits.",
  NETWORK_ERROR: "Network error. Please check your internet connection."
};
