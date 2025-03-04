class CanvasManager {
    constructor() {
        // Get canvas element and context
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.isErasing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.setupCanvas();
        this.setDefaultStyles();
        this.setupEventListeners();
    }

    setupCanvas() {
        // Set canvas size to window size
        const resizeCanvas = () => {
            this.canvas.width = window.innerWidth - 40;
            this.canvas.height = window.innerHeight - 100;
            // Restore default styles after resize (canvas clear)
            this.setDefaultStyles();
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    setDefaultStyles() {
        // Set default styles
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    setupEventListeners() {
        // Mouse events for drawing
        this.canvas.addEventListener('mousedown', (e) => {
            e.preventDefault(); // Prevent default dragging behavior
            this.startDrawing(e);
        });
        this.canvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            this.draw(e);
        });
        this.canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
        this.canvas.addEventListener('mouseout', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
        // Right-click for eraser toggle
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.isErasing = !this.isErasing;
            this.canvas.style.cursor = this.isErasing ? 'cell' : 'crosshair';
            // Show visual feedback
            const message = this.isErasing ? 'Eraser Mode' : 'Draw Mode';
            const feedback = document.createElement('div');
            feedback.textContent = message;
            feedback.style.position = 'fixed';
            feedback.style.top = '10px';
            feedback.style.right = '10px';
            feedback.style.padding = '5px 10px';
            feedback.style.background = 'rgba(0,0,0,0.7)';
            feedback.style.color = 'white';
            feedback.style.borderRadius = '3px';
            feedback.style.transition = 'opacity 0.5s';
            document.body.appendChild(feedback);
            setTimeout(() => {
                feedback.style.opacity = '0';
                setTimeout(() => feedback.remove(), 500);
            }, 1500);
        });

        // Color picker
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.addEventListener('change', (e) => {
            this.ctx.strokeStyle = e.target.value;
            this.ctx.fillStyle = e.target.value;  // For dots when clicking
        });
        colorPicker.addEventListener('input', (e) => {
            this.ctx.strokeStyle = e.target.value;
            this.ctx.fillStyle = e.target.value;  // For dots when clicking
        });

        // Line width
        const lineWidth = document.getElementById('lineWidth');
        const lineWidthLabel = document.getElementById('lineWidthLabel');
        const updateLineWidth = (value) => {
            this.ctx.lineWidth = value;
            lineWidthLabel.textContent = value + 'px';
        };
        lineWidth.addEventListener('input', (e) => updateLineWidth(e.target.value));
        lineWidth.addEventListener('change', (e) => updateLineWidth(e.target.value));

        // Clear button
        const clearBtn = document.getElementById('clearBtn');
        clearBtn.addEventListener('click', () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set initial position
        this.lastX = x;
        this.lastY = y;
        
        // Draw a single point for single clicks
        this.ctx.beginPath();
        if (this.isErasing) {
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.arc(x, y, this.ctx.lineWidth * 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        } else {
            this.ctx.arc(x, y, this.ctx.lineWidth / 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate the distance moved
        const dx = x - this.lastX;
        const dy = y - this.lastY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (this.isErasing) {
            // Eraser functionality with smoother effect
            const steps = Math.max(Math.floor(distance), 1);
            for (let i = 0; i < steps; i++) {
                const px = this.lastX + (dx * i) / steps;
                const py = this.lastY + (dy * i) / steps;
                
                this.ctx.save();
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.beginPath();
                this.ctx.arc(px, py, this.ctx.lineWidth * 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        } else {
            // Drawing functionality with smoother lines
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }

        // Update last position
        this.lastX = x;
        this.lastY = y;
    }

    stopDrawing() {
        this.isDrawing = false;
        // Reset path
        this.ctx.beginPath();
    }

    // Method to clear the canvas
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
