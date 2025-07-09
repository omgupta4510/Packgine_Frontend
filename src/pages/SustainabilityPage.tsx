import { useState, useEffect, useRef } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import ChatBot from '../components/sustainability/ChatBot';
import ESGAnalyzer from '../components/sustainability/ESGAnalyzer';

const SustainabilityPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'esg'>('chat');
  const chatBotRef = useRef<{ setInputMessage: (message: string) => void } | null>(null);

  // Set page title
  useEffect(() => {
    document.title = 'Sustainable Bot | Packgine';
    
    return () => {
      document.title = 'Packgine';
    };
  }, []);

  const handleQuestionClick = (question: string) => {
    if (chatBotRef.current) {
      chatBotRef.current.setInputMessage(question);
    }
  };

  // Set page title
  useEffect(() => {
    document.title = 'Sustainable Bot | Packgine';
    
    return () => {
      document.title = 'Packgine';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Logo */}
      <div className="bg-white border-b border-gray-200 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            {/* Berlin Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 shadow-xl overflow-hidden bg-white">
                  <img 
                    src="/Berlin_Logo.png" 
                    alt="Berlin Logo" 
                    className="w-full h-full object-cover rounded-full"
                    style={{ clipPath: 'circle(50%)' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{display: 'none'}}>
                    B
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🌱 Sustainability Packaging Chatbot
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Expert advice on LCA, ESG reporting, packaging sustainability, and materiality analysis
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center mt-8">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'chat'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('esg')}
                  className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'esg'
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 ESG Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'chat' ? (
          <div>
            <ChatBot ref={chatBotRef} />
            {/* Sample Questions for Chat */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">Try asking about:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  "Carbon footprint of biodegradable packaging",
                  "How to conduct an LCA for my product",
                  "Latest ESG reporting requirements",
                  "Best sustainability certifications",
                  "Reduce packaging environmental impact",
                  "Eco-friendly packaging materials"
                ].map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="text-left p-4 text-sm text-gray-600 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-green-300 transition-all duration-200 hover:shadow-sm group"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2 text-green-600 group-hover:text-green-700" />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <ESGAnalyzer />
        )}
      </div>
    </div>
  );
};

export default SustainabilityPage;
