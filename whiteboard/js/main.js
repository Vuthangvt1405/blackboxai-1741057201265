// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize canvas manager
    const canvasManager = new CanvasManager();
    
    // Initialize PDF manager with the canvas
    const pdfManager = new PDFManager(canvasManager.canvas);
});
