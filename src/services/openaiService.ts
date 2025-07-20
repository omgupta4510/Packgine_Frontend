import OpenAI from 'openai';

// OpenAI configuration
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

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
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.5,
        max_tokens: 800,
      });

      return response.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Invalid OpenAI API key. Please check your configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('OpenAI API quota exceeded. Please check your billing.');
        } else if (error.message.includes('rate_limit')) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        throw new Error(`OpenAI Error: ${error.message}`);
      }
      
      throw new Error('Failed to communicate with OpenAI service.');
    }
  }

  async analyzeESGReport(reportText: string, fileName: string): Promise<string> {
    const systemPrompt = `You are an expert ESG (Environmental, Social, Governance) analyst with deep knowledge of sustainability frameworks including GRI, SASB, TCFD, and UN SDGs. 

Analyze the provided sustainability/ESG report text and generate a comprehensive, professional ESG assessment. Your analysis must be specific to the actual content provided, not generic.

Structure your response with these sections:
## Executive Summary
## Environmental Impact Analysis
- Score: X/10 with specific justification
- Key metrics and performance
- Areas of concern

## Social Responsibility Analysis  
- Score: X/10 with specific justification
- Workforce and community impact
- Areas for improvement

## Governance Analysis
- Score: X/10 with specific justification
- Leadership and transparency
- Risk management

## Overall ESG Rating
- Letter grade (A+ to F) with rationale
- Comparative industry benchmarking

## Recommendations
- Priority action items
- Implementation timeline
- Expected outcomes

Base your analysis strictly on the content provided. If information is missing for any category, note the gaps and suggest what additional data would be needed.`;

    const userPrompt = `File: ${fileName}

Please analyze this ESG/sustainability report content:

${reportText}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o', // Using a more capable model for ESG analysis
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent analysis
        max_tokens: 2000, // More tokens for detailed analysis
      });

      return response.choices[0]?.message?.content || 'Sorry, I couldn\'t analyze the report.';
    } catch (error) {
      console.error('ESG Analysis Error:', error);
      throw error; // Re-throw to be handled by the calling component
    }
  }
}

export const openaiService = OpenAIService.getInstance();
