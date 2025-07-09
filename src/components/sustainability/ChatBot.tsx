import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Send, Bot, User, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

// Types
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface ChatBotRef {
  setInputMessage: (message: string) => void;
}

const ChatBot = forwardRef<ChatBotRef>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // System prompt for the sustainability chatbot
  const SYSTEM_PROMPT = `You are a sustainability and packaging expert specializing in Life Cycle Assessment (LCA), ESG (Environmental, Social, Governance) reporting, and materiality analysis for packaging. Answer user questions as an industry authority, using up-to-date standards, real-world examples, and clear explanations tailored to packaging solutions.`;

  // Configuration - Get API key from environment
  const API_URL = "https://api.groq.com/openai/v1/chat/completions";
  const MODEL = "llama-3.3-70b-versatile";
  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  // Only scroll to bottom for user messages, not bot responses
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        scrollToBottom();
      }
    }
  }, [messages]);

  // Cleanup typing interval on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Expose setInputMessage method to parent component
  useImperativeHandle(ref, () => ({
    setInputMessage: (message: string) => {
      setInputMessage(message);
    }
  }));

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const scrollToMessage = (messageIndex: number) => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        const messageElements = chatContainerRef.current.querySelectorAll('.message-item');
        const targetMessage = messageElements[messageIndex];
        if (targetMessage) {
          // Scroll within the chat container only, not the whole page
          const containerRect = chatContainerRef.current.getBoundingClientRect();
          const messageRect = targetMessage.getBoundingClientRect();
          const relativeTop = messageRect.top - containerRect.top;
          
          chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollTop + relativeTop - 20, // 20px offset for better visibility
            behavior: 'smooth'
          });
        }
      }
    }, 100);
  };

  const typeMessage = (fullMessage: string, messageIndex: number) => {
    setIsTyping(true);
    setTypingMessage('');
    
    let currentIndex = 0;
    const typingSpeed = 10; // milliseconds per character - much faster!
    
    // Scroll to the beginning of the new message within the chat container
    scrollToMessage(messageIndex);
    
    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < fullMessage.length) {
        setTypingMessage(fullMessage.slice(0, currentIndex + 1));
        currentIndex++;
        
        // Keep the typing message in view without affecting page scroll
        // Only scroll within chat container if needed
        setTimeout(() => {
          if (chatContainerRef.current) {
            const typingElement = chatContainerRef.current.querySelector('.typing-message');
            if (typingElement) {
              const containerRect = chatContainerRef.current.getBoundingClientRect();
              const typingRect = typingElement.getBoundingClientRect();
              
              // Check if typing element is out of view at the bottom
              if (typingRect.bottom > containerRect.bottom) {
                chatContainerRef.current.scrollTop += 30; // Small incremental scroll
              }
            }
          }
        }, 10);
      } else {
        // Typing complete
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        setIsTyping(false);
        setTypingMessage('');
        
        // Add the complete message to the messages array
        const assistantMessage: Message = {
          role: 'assistant',
          content: fullMessage,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Scroll back to the beginning of the complete message
        setTimeout(() => scrollToMessage(messageIndex), 200);
      }
    }, typingSpeed);
  };

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `🌱 Hello! I'm EcoBot, your Sustainability Packaging Expert. I specialize in:

• **Life Cycle Assessment (LCA)** - Environmental impact analysis
• **ESG Reporting** - Sustainability metrics and compliance
• **Packaging Materials** - Eco-friendly alternatives and innovations
• **Materiality Analysis** - Risk assessment and impact prioritization
• **Environmental Standards** - Certifications and regulations

Ask me anything about sustainable packaging, carbon footprint, recyclability, or environmental compliance!`,
        timestamp: new Date()
      }
    ]);
  }, []);

  const askGroq = async (conversationMessages: Message[]): Promise<string | null> => {
    if (!GROQ_API_KEY) {
      return "I apologize, but I'm currently unavailable. Please try again later or contact support.";
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    };

    const data = {
      model: MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const result: GroqResponse = await response.json();
      return result.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('Chat error:', error);
      return `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await askGroq([...messages, userMessage]);
      
      if (response) {
        setIsLoading(false);
        // Start typing animation
        const messageIndex = messages.length + 1; // +1 because we added user message
        typeMessage(response, messageIndex);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const clearChat = () => {
    // Clear any ongoing typing animation
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    setIsTyping(false);
    setTypingMessage('');
    
    setMessages([
      {
        role: 'assistant',
        content: `🌱 Chat cleared! I'm ready to help you with sustainability and packaging questions again.`,
        timestamp: new Date()
      }
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/•/g, '•')
      .split('\n')
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line || '<br/>' }} />
      ));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg h-[70vh] flex flex-col relative">
      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth relative"
        style={{ 
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain' // Prevent parent scrolling
        }}
      >
        {messages.map((message, index) => (
          <div key={index} className="group message-item">
            <div className={`flex items-start gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-600 to-blue-700' 
                  : 'bg-gradient-to-br from-green-600 to-emerald-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>
              
              {/* Message Content */}
              <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-md px-5 py-3 shadow-md' 
                    : 'bg-gray-50 text-gray-800 rounded-2xl rounded-tl-md px-5 py-3 border border-gray-100'
                }`}>
                  <div className="text-sm leading-relaxed">
                    {message.role === 'user' ? (
                      message.content
                    ) : (
                      formatContent(message.content)
                    )}
                  </div>
                </div>
                <div className={`text-xs text-gray-400 mt-2 ${message.role === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing Animation */}
        {isTyping && (
          <div className="group message-item typing-message">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 max-w-[80%]">
                <div className="bg-gray-50 text-gray-800 rounded-2xl rounded-tl-md px-5 py-3 border border-gray-100 inline-block">
                  <div className="text-sm leading-relaxed">
                    {formatContent(typingMessage)}
                    <span className="inline-block w-2 h-4 bg-green-600 ml-1 animate-pulse"></span>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Typing...
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isLoading && !isTyping && (
          <div className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl rounded-tl-md px-5 py-3 border border-gray-100 inline-block">
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 p-6 bg-gray-50 rounded-b-2xl">
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about sustainability, packaging, LCA, ESG reporting..."
              className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all bg-white shadow-sm"
              rows={1}
              style={{ minHeight: '52px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearChat}
              disabled={isLoading}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-xl transition-all disabled:opacity-50"
              title="Clear conversation"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={`p-3 transition-all rounded-xl ${
                inputMessage.trim() 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg' 
                  : 'bg-gray-300 cursor-not-allowed'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">
            Press Enter to send, Shift+Enter for new line
          </span>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Sparkles className="w-3 h-3" />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ChatBot.displayName = 'ChatBot';

export default ChatBot;
