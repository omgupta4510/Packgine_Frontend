import { AlertCircle, CheckCircle, Zap, Info } from 'lucide-react';
import { getAIProvider, isAIConfigured, getAvailableProviders } from '../../utils/aiConfig';

interface AIStatusProps {
  className?: string;
  showDetails?: boolean;
}

const AIStatus = ({ className = '', showDetails = false }: AIStatusProps) => {
  const provider = getAIProvider();
  const isConfigured = isAIConfigured();
  const availableProviders = getAvailableProviders();

  if (!isConfigured) {
    return (
      <div className={`flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 ${className}`}>
        <AlertCircle className="w-4 h-4" />
        <div>
          <span className="text-sm font-medium">AI Not Configured</span>
          {showDetails && (
            <p className="text-xs text-amber-700 mt-1">
              Add VITE_OPENAI_API_KEY or VITE_GROQ_API_KEY to .env file
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200 ${className}`}>
      <CheckCircle className="w-4 h-4" />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Powered by {provider?.provider}</span>
          <Zap className="w-3 h-3 opacity-60" />
        </div>
        {showDetails && (
          <div className="flex items-center gap-1 mt-1">
            <Info className="w-3 h-3 opacity-60" />
            <span className="text-xs text-emerald-700">
              Model: {provider?.model} • Available: {availableProviders.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIStatus;
