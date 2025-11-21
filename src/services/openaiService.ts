import axios from 'axios';

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenAIService {
  private static instance: OpenAIService;

  private constructor() {}

  static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  async sendChatMessage(messages: ChatMessage[]): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/openai/chat`, {
        messages
      });

      if (response.data.success) {
        return response.data.response;
      } else {
        throw new Error(response.data.error || 'Failed to get response from server');
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check server configuration.');
        } else if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        } else if (error.message.includes('Network Error')) {
          throw new Error('Cannot connect to server. Please ensure the backend is running.');
        }
      }
      
      if (error instanceof Error) {
        throw new Error(`Chat Error: ${error.message}`);
      }
      
      throw new Error('Failed to communicate with chat service.');
    }
  }

  async analyzeESGReport(reportText: string, fileName: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/openai/analyze-esg`, {
        reportText,
        fileName
      });

      if (response.data.success) {
        return response.data.analysis;
      } else {
        throw new Error(response.data.error || 'Failed to analyze report');
      }
    } catch (error) {
      console.error('ESG Analysis API Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid OpenAI API key. Please check server configuration.');
        } else if (error.response?.data?.error) {
          throw new Error(error.response.data.error);
        } else if (error.message.includes('Network Error')) {
          throw new Error('Cannot connect to server. Please ensure the backend is running.');
        }
      }
      
      if (error instanceof Error) {
        throw new Error(`ESG Analysis Error: ${error.message}`);
      }
      
      throw new Error('Failed to analyze ESG report.');
    }
  }
}

export const openaiService = OpenAIService.getInstance();
