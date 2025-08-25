import { useState, useCallback, useEffect } from 'react';
import { CompressionStatus } from '../types';
import { compressPdfToTargetSize } from '../services/pdfCompressor';

export const usePdfCompressor = () => {
  const [status, setStatus] = useState<CompressionStatus>(CompressionStatus.Idle);
  const [progress, setProgress] = useState({ stage: '', percentage: 0 });
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedPdfUrl, setCompressedPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cleanup URL object when component unmounts or URL changes
    return () => {
      if (compressedPdfUrl) {
        URL.revokeObjectURL(compressedPdfUrl);
      }
    };
  }, [compressedPdfUrl]);

  const reset = useCallback(() => {
    setStatus(CompressionStatus.Idle);
    setProgress({ stage: '', percentage: 0 });
    setOriginalSize(0);
    setCompressedSize(null);
    if (compressedPdfUrl) {
      URL.revokeObjectURL(compressedPdfUrl);
    }
    setCompressedPdfUrl(null);
    setError(null);
  }, [compressedPdfUrl]);

  const compressPdf = useCallback(async (file: File, targetSizeMB: number) => {
    reset();
    setOriginalSize(file.size);

    const targetSizeBytes = targetSizeMB * 1024 * 1024;

    if (targetSizeBytes >= file.size) {
        const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
        setError(`Target size (${targetSizeMB}MB) must be smaller than the original file size (${originalSizeMB}MB).`);
        setStatus(CompressionStatus.Error);
        return;
    }

    setStatus(CompressionStatus.Processing);

    const effectiveTargetSizeBytes = targetSizeBytes * 0.98; // Just under target MB

    try {
      const compressedPdfBytes = await compressPdfToTargetSize(
        file,
        effectiveTargetSizeBytes,
        (p) => setProgress(p)
      );
      
      if (!compressedPdfBytes) {
        throw new Error("Could not compress the PDF to the target size. It might be too complex or already optimized.");
      }

      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setCompressedSize(blob.size);
      setCompressedPdfUrl(url);
      setStatus(CompressionStatus.Done);
      
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during compression.');
      setStatus(CompressionStatus.Error);
    }
  }, [reset]);

  return {
    status,
    progress,
    originalSize,
    compressedSize,
    compressedPdfUrl,
    error,
    compressPdf,
    reset
  };
};