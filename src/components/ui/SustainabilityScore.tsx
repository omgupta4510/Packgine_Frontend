import React from 'react';
import { cn } from '../../utils/cn';

type SustainabilityScoreProps = {
  score: number; // 1-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

export const SustainabilityScore = ({
  score,
  size = 'md',
  showLabel = true,
  className,
}: SustainabilityScoreProps) => {
  // Determine color based on score
  const getColor = () => {
    if (score >= 80) return 'text-berlin-red-500 border-berlin-red-500';
    if (score >= 60) return 'text-berlin-red-400 border-berlin-red-400';
    if (score >= 40) return 'text-yellow-500 border-yellow-500';
    if (score >= 20) return 'text-orange-500 border-orange-500';
    return 'text-red-500 border-red-500';
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div 
        className={cn(
          'rounded-full flex items-center justify-center border-2 font-bold',
          getColor(),
          sizeClasses[size]
        )}
      >
        {score}
      </div>
      {showLabel && (
        <span className="mt-1 text-xs text-berlin-gray-600 font-medium">
          Eco Score
        </span>
      )}
    </div>
  );
};