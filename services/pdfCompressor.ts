
// These are loaded from CDNs in index.html
declare const pdfjsLib: any;
declare const PDFLib: any;

const { PDFDocument } = PDFLib;

interface ProgressReport {
  stage: string;
  percentage: number;
}

/**
 * Renders a single page of a PDF to a canvas.
 */
const renderPageToCanvas = async (page: any): Promise<HTMLCanvasElement> => {
  const viewport = page.getViewport({ scale: 1.5 }); // Use a decent resolution
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height;
  canvas.width = viewport.width;

  if (context) {
    await page.render({ canvasContext: context, viewport: viewport }).promise;
  }
  return canvas;
};

/**
 * Creates a new PDF from a series of canvas images with a specific JPEG quality.
 */
const createPdfFromCanvases = async (canvases: HTMLCanvasElement[], quality: number): Promise<Uint8Array> => {
  const newPdfDoc = await PDFDocument.create();
  for (const canvas of canvases) {
    const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
    const jpegImageBytes = await fetch(jpegDataUrl).then(res => res.arrayBuffer());
    const jpegImage = await newPdfDoc.embedJpg(jpegImageBytes);

    const page = newPdfDoc.addPage([canvas.width, canvas.height]);
    page.drawImage(jpegImage, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
  }
  return newPdfDoc.save({ useObjectStreams: true });
};

/**
 * Compresses a PDF file to a target size by rasterizing pages and adjusting JPEG quality.
 * Uses a binary search approach to find the optimal quality level.
 */
export const compressPdfToTargetSize = async (
  file: File,
  targetSizeBytes: number,
  onProgress: (progress: ProgressReport) => void
): Promise<Uint8Array | null> => {
  const fileBuffer = await file.arrayBuffer();
  
  onProgress({ stage: 'Loading PDF...', percentage: 10 });
  const pdfJSDoc = await pdfjsLib.getDocument({ data: fileBuffer }).promise;
  const numPages = pdfJSDoc.numPages;

  onProgress({ stage: 'Analyzing pages...', percentage: 25 });
  const canvases: HTMLCanvasElement[] = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdfJSDoc.getPage(i);
    const canvas = await renderPageToCanvas(page);
    canvases.push(canvas);
    onProgress({ stage: `Rendering page ${i}/${numPages}`, percentage: 25 + (45 * (i / numPages)) });
  }

  // Binary search for the best quality setting
  let bestPdfBytes: Uint8Array | null = null;
  let low = 0;
  let high = 1;
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    const mid = low + (high - low) / 2;
    onProgress({ stage: `Optimizing quality (Pass ${i + 1}/${iterations})`, percentage: 70 + (30 * (i / iterations))});

    const currentPdfBytes = await createPdfFromCanvases(canvases, mid);

    if (currentPdfBytes.length <= targetSizeBytes) {
      bestPdfBytes = currentPdfBytes;
      low = mid; // Try for better quality
    } else {
      high = mid; // Need to reduce quality
    }
  }

  onProgress({ stage: 'Finalizing...', percentage: 100 });
  return bestPdfBytes;
};
