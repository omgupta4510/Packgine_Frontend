interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = "Loading dashboard..." }: LoadingProps) => {
  return (
    <div className="pt-20 min-h-screen bg-berlin-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-berlin-red-500 mx-auto"></div>
        <p className="mt-4 text-berlin-gray-600">{message}</p>
      </div>
    </div>
  );
};
