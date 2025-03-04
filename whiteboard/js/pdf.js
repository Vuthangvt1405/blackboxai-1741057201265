class PDFManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pdfDoc = null;
        this.setupPDFHandler();
    }

    setupPDFHandler() {
        const pdfInput = document.getElementById('pdfInput');
        pdfInput.addEventListener('change', (e) => this.handlePDFUpload(e));
    }

    async handlePDFUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const typedArray = new Uint8Array(event.target.result);
            
            try {
                // Load the PDF document
                const loadingTask = pdfjsLib.getDocument({ data: typedArray });
                this.pdfDoc = await loadingTask.promise;
                
                // Get the first page
                const page = await this.pdfDoc.getPage(1);
                
                // Calculate scale to fit the canvas while maintaining aspect ratio
                const viewport = page.getViewport({ scale: 1.0 });
                const scale = Math.min(
                    this.canvas.width / viewport.width,
                    this.canvas.height / viewport.height
                );
                
                // Set canvas size to match the scaled PDF page
                const scaledViewport = page.getViewport({ scale });
                
                // Center the PDF on the canvas
                const offsetX = (this.canvas.width - scaledViewport.width) / 2;
                const offsetY = (this.canvas.height - scaledViewport.height) / 2;
                
                // Save current canvas content
                const currentDrawing = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
                
                // Render PDF page
                await page.render({
                    canvasContext: this.ctx,
                    viewport: scaledViewport,
                    transform: [1, 0, 0, 1, offsetX, offsetY]
                }).promise;
                
                // Overlay saved canvas content
                this.ctx.putImageData(currentDrawing, 0, 0);
                
            } catch (error) {
                console.error('Error loading PDF:', error);
                alert('Error loading PDF. Please try again.');
            }
        };
        
        reader.readAsArrayBuffer(file);
    }
}
