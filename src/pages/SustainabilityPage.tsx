import { useState, useEffect, useRef } from 'react';
import { Bot, MessageCircle } from 'lucide-react';
import ChatBot from '../components/sustainability/ChatBot';
import ESGAnalyzer from '../components/sustainability/ESGAnalyzer';
import { isUserAuthenticated } from '../utils/userAuth';
import { isAuthenticated as isSupplierAuthenticated } from '../utils/auth';
import { LoginRequiredModal } from '../components/ui/LoginRequiredModal';

const SustainabilityPage = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'esg'>('chat');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const chatBotRef = useRef<{ setInputMessage: (message: string) => void } | null>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      // Check both user and supplier authentication
      const userAuthStatus = isUserAuthenticated();
      const supplierAuthStatus = isSupplierAuthenticated();
      const authStatus = userAuthStatus || supplierAuthStatus;
      
      setIsAuthenticated(authStatus);
      if (!authStatus) {
        setIsModalOpen(true);
      }
    };

    checkAuth();
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Set page title
  useEffect(() => {
    document.title = 'Sustainable Bot | Berlin Packaging';
    
    return () => {
      document.title = 'Berlin Packaging';
    };
  }, []);

  const handleQuestionClick = (question: string) => {
    if (chatBotRef.current) {
      chatBotRef.current.setInputMessage(question);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Authentication modal */}
      {/* <LoginRequiredModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feature="access our Sustainability Chatbot"
      /> */}

      {/* Content with blur effect for non-authenticated users */}
      <div className={`${!isAuthenticated ? 'filter blur-sm pointer-events-none' : ''}`}>
      {/* Header with Logo */}
      <div className="bg-white border-b border-berlin-gray-200 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            {/* Berlin Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 shadow-xl overflow-hidden bg-white border-berlin-red-200">
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
                  <div className="w-full h-full bg-berlin-red-500 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{display: 'none'}}>
                    B
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-berlin-gray-900 mb-2">
              🌱 Sustainability Packaging Chatbot
            </h1>
            <p className="text-berlin-gray-600 text-lg max-w-2xl mx-auto">
              Expert advice on LCA, ESG reporting, packaging sustainability, and materiality analysis
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center mt-8">
              <div className="bg-berlin-gray-100 p-1 rounded-lg flex">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'chat'
                      ? 'bg-berlin-red-600 text-white shadow-sm'
                      : 'text-berlin-gray-600 hover:text-berlin-gray-900'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Chat
                </button>
                <button
                  onClick={() => setActiveTab('esg')}
                  className={`px-6 py-2 rounded-md transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'esg'
                      ? 'bg-berlin-red-600 text-white shadow-sm'
                      : 'text-berlin-gray-600 hover:text-berlin-gray-900'
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
              <h3 className="text-sm font-medium text-berlin-gray-700 mb-4 text-center">Try asking about:</h3>
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
                    className="text-left p-4 text-sm text-berlin-gray-600 bg-white hover:bg-berlin-gray-50 rounded-xl border border-berlin-gray-200 hover:border-berlin-red-300 transition-all duration-200 hover:shadow-sm group"
                  >
                    <MessageCircle className="w-4 h-4 inline mr-2 text-berlin-red-600 group-hover:text-berlin-red-700" />
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
      
      {/* Login overlay for non-authenticated users */}
      {!isAuthenticated && (
        <div className="fixed inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-white bg-opacity-95 rounded-xl p-8 max-w-md text-center pointer-events-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-berlin-gray-900 mb-4">Login Required</h2>
            <p className="text-berlin-gray-600 mb-6">
              Please login to access our Sustainability Chatbot.
            </p>
            
            {/* Login Options */}
            <div className="space-y-3 mb-6">
              <a 
                href="/login"
                className="block w-full bg-berlin-red-600 text-white px-6 py-3 rounded-md hover:bg-berlin-red-700 transition-colors font-medium"
              >
                Login as User
              </a>
              <a 
                href="/supplier/auth"
                className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Login as Supplier
              </a>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default SustainabilityPage;
