
import React from 'react';

interface ProcessingViewProps {
  progress: {
    stage: string;
    percentage: number;
  };
}

const ProcessingView: React.FC<ProcessingViewProps> = ({ progress }) => {
  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-semibold text-gray-200 mb-4">Compressing PDF...</h2>
      <p className="text-gray-400 mb-6">{progress.stage}</p>
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress.percentage}%` }}
        ></div>
      </div>
      <p className="text-lg font-medium text-gray-300 mt-4">{Math.round(progress.percentage)}%</p>
    </div>
  );
};

export default ProcessingView;
