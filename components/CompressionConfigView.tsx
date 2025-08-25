
import React, { useState, useEffect } from 'react';
import { RefreshCwIcon, ZapIcon } from './icons';

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

interface CompressionConfigViewProps {
  file: File;
  onCompress: (targetSizeMB: number) => void;
  onCancel: () => void;
}

const CompressionConfigView: React.FC<CompressionConfigViewProps> = ({ file, onCompress, onCancel }) => {
  const originalSizeMB = file.size / 1024 / 1024;
  
  const getDefaultTargetSize = () => {
    if (originalSizeMB > 2) {
      return 2;
    }
    return Math.max(originalSizeMB * 0.5, 0.1);
  };

  const [targetSizeMB, setTargetSizeMB] = useState<number>(getDefaultTargetSize());

  const maxSliderValue = Math.max(0.1, originalSizeMB - 0.01);

  useEffect(() => {
    setTargetSizeMB(getDefaultTargetSize());
  }, [file]);

  const handleCompressClick = () => {
    onCompress(targetSizeMB);
  };
  
  return (
    <div className="w-full text-center">
      <h2 className="text-2xl font-semibold text-gray-200 mb-2">File Ready for Compression</h2>
      <p className="text-gray-400 mb-6 truncate px-4" title={file.name}>
        {file.name} ({formatBytes(file.size)})
      </p>

      <div className="my-8">
        <label htmlFor="size-slider" className="block text-lg font-semibold text-gray-200 mb-3">
          Select Target File Size
        </label>
        <div className="flex items-center gap-4">
          <input
            id="size-slider"
            type="range"
            min="0.1"
            max={maxSliderValue.toFixed(2)}
            step="0.1"
            value={targetSizeMB}
            onChange={(e) => setTargetSizeMB(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="font-semibold text-indigo-400 text-lg w-28 text-center bg-gray-900/50 rounded-md py-1 tabular-nums">
            {targetSizeMB.toFixed(1)} MB
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-2">Max possible target size is {formatBytes(file.size)}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleCompressClick}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto"
        >
          <ZapIcon className="w-5 h-5" />
          Compress Now
        </button>
        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto"
        >
          <RefreshCwIcon className="w-5 h-5" />
          Choose Another
        </button>
      </div>
    </div>
  );
};

export default CompressionConfigView;
