
import React, { useState, useCallback } from 'react';
import { CompressionStatus } from './types';
import FileUpload from './components/FileUpload';
import ProcessingView from './components/ProcessingView';
import ResultView from './components/ResultView';
import { usePdfCompressor } from './hooks/usePdfCompressor';
import { GithubIcon } from './components/icons';
import CompressionConfigView from './components/CompressionConfigView';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { 
    status, 
    progress, 
    originalSize, 
    compressedSize, 
    compressedPdfUrl, 
    error,
    compressPdf,
    reset: resetCompressor
  } = usePdfCompressor();

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleStartCompression = useCallback(async (targetSizeMB: number) => {
    if (selectedFile) {
      compressPdf(selectedFile, targetSizeMB);
    }
  }, [compressPdf, selectedFile]);

  const handleReset = useCallback(() => {
    resetCompressor();
    setSelectedFile(null);
  }, [resetCompressor]);

  const renderContent = () => {
    switch (status) {
      case CompressionStatus.Processing:
        return <ProcessingView progress={progress} />;
      case CompressionStatus.Done:
        return (
          <ResultView
            originalSize={originalSize}
            compressedSize={compressedSize!}
            downloadUrl={compressedPdfUrl!}
            onReset={handleReset}
          />
        );
      case CompressionStatus.Error:
         return (
          <div className="text-center">
            <h2 className="text-xl text-red-400 mb-4">Compression Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Try Another File
            </button>
          </div>
        );
      case CompressionStatus.Idle:
      default:
        if (selectedFile) {
          return (
            <CompressionConfigView 
              file={selectedFile}
              onCompress={handleStartCompression}
              onCancel={handleReset}
            />
          );
        }
        return (
          <FileUpload onFileSelect={handleFileSelect} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100">PDF Compressor</h1>
          <p className="text-lg text-gray-400 mt-2">
            Reduce PDF file size to your desired target with the best possible quality.
          </p>
        </header>

        <main className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 transition-all duration-500 min-h-[300px] flex items-center justify-center">
          {renderContent()}
        </main>
      </div>
      <footer className="text-center mt-8 text-gray-500">
        <p>Built with React, TypeScript, and Tailwind CSS.</p>
        <a 
          href="https://github.com/your-repo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 hover:text-indigo-400 transition-colors mt-2"
        >
          <GithubIcon className="w-5 h-5" />
          View on GitHub
        </a>
      </footer>
    </div>
  );
};

export default App;
