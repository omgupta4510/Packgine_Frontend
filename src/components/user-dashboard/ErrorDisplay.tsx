interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="pt-20 min-h-screen bg-berlin-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-berlin-gray-900 mb-4">Error Loading Dashboard</h1>
        <p className="text-berlin-gray-600 mb-6">{error}</p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-berlin-red-600 text-white rounded-lg hover:bg-berlin-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};
