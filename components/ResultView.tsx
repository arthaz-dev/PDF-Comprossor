
import React from 'react';
import { DownloadIcon, RefreshCwIcon, CheckCircleIcon } from './icons';

interface ResultViewProps {
  originalSize: number;
  compressedSize: number;
  downloadUrl: string;
  onReset: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const ResultView: React.FC<ResultViewProps> = ({ originalSize, compressedSize, downloadUrl, onReset }) => {
  const reductionPercentage = ((originalSize - compressedSize) / originalSize) * 100;

  return (
    <div className="w-full text-center">
      <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
      <h2 className="text-3xl font-bold text-gray-100 mb-4">Compression Complete!</h2>
      
      <div className="flex justify-around items-center my-8 bg-gray-900/50 p-6 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-gray-400">Original Size</p>
          <p className="text-2xl font-semibold text-gray-200">{formatBytes(originalSize)}</p>
        </div>
        <div className="text-center text-green-400">
           <p className="text-sm">Reduction</p>
           <p className="text-2xl font-bold">{reductionPercentage.toFixed(1)}%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-400">New Size</p>
          <p className="text-2xl font-semibold text-gray-200">{formatBytes(compressedSize)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={downloadUrl}
          download="compressed.pdf"
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto"
        >
          <DownloadIcon className="w-5 h-5" />
          Download PDF
        </a>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto"
        >
          <RefreshCwIcon className="w-5 h-5" />
          Compress Another
        </button>
      </div>
    </div>
  );
};

export default ResultView;
