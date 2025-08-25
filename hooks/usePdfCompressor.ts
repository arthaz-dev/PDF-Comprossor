
import { useState, useCallback, useEffect } from 'react';
import { CompressionStatus } from '../types';
import { compressPdfToTargetSize } from '../services/pdfCompressor';

const TARGET_SIZE_BYTES = 2 * 1024 * 1024 * 0.98; // Just under 2MB

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

  const compressPdf = useCallback(async (file: File) => {
    reset();
    setStatus(CompressionStatus.Processing);
    setOriginalSize(file.size);

    if (file.size <= TARGET_SIZE_BYTES) {
        setError("File is already under 2MB. No compression needed.");
        setStatus(CompressionStatus.Error);
        return;
    }

    try {
      const compressedPdfBytes = await compressPdfToTargetSize(
        file,
        TARGET_SIZE_BYTES,
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
