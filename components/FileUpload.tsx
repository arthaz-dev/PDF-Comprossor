
import React, { useState, useCallback } from 'react';
import { UploadCloudIcon } from './icons';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        if(e.dataTransfer.files[0].type === 'application/pdf') {
            onFileSelect(e.dataTransfer.files[0]);
        } else {
            alert("Please upload a PDF file.");
        }
    }
  }, [onFileSelect]);

  return (
    <div className="w-full text-center">
      <label
        htmlFor="pdf-upload"
        className={`relative block w-full rounded-lg border-2 border-dashed ${
          isDragging ? 'border-indigo-400 bg-gray-700' : 'border-gray-600'
        } p-12 text-center hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-300 cursor-pointer`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
        <span className="mt-2 block text-lg font-semibold text-gray-200">
          Drag and drop a PDF file here
        </span>
        <span className="mt-1 block text-sm text-gray-500">or click to select a file</span>
      </label>
      <input
        id="pdf-upload"
        name="pdf-upload"
        type="file"
        className="sr-only"
        accept="application/pdf"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUpload;
