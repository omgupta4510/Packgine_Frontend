interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Dashboard</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
