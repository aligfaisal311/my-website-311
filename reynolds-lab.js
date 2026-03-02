class ReynoldsLab {
    constructor() {
        this.canvas = document.getElementById('simCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.chartCanvas = document.getElementById('fluctuation-chart');
        this.chartCtx = this.chartCanvas.getContext('2d');

        // Physics constants
        this.rho = 998; // Water density
        this.mu = 0.001; // Water viscosity
        this.velocity = 0.1;
        this.diameter = 0.02;
        this.dyePos = 0;
        this.re = 0;

        // Simulation State
        this.particles = [];
        this.fluctuations = [];
        this.isRunning = false;
        this.isRevealed = false;
        this.lastSliderChange = 0;
        this.guessingCount = 0;

        // UI Elements
        this.velSlider = document.getElementById('velSlider');
        this.diamSelect = document.getElementById('diamSelect');
        this.fluidSelect = document.getElementById('fluidSelect');
        this.dyeSlider = document.getElementById('dyeSlider');
        this.statusBadge = document.getElementById('flow-status');
        this.reReadout = document.getElementById('re-readout');
        this.reValue = document.getElementById('re-value');
        this.velReadout = document.getElementById('velocity-readout');

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Event listeners
        this.velSlider.addEventListener('input', (e) => {
            this.velocity = parseFloat(e.target.value);
            this.detectGuessing();
            this.updatePhysics();
        });

        this.diamSelect.addEventListener('change', (e) => {
            this.diameter = parseFloat(e.target.value);
            this.updatePhysics();
        });

        this.fluidSelect.addEventListener('change', (e) => {
            const fluid = e.target.value;
            if (fluid === 'water') {
                this.rho = 1000;
                this.mu = 0.001;
            } else if (fluid === 'air') {
                this.rho = 1.225;
                this.mu = 0.000018;
            } else if (fluid === 'glycerin') {
                this.rho = 1260;
                this.mu = 1.49;
            }
            this.updatePhysics();
        });

        this.dyeSlider.addEventListener('input', (e) => {
            this.dyePos = parseFloat(e.target.value);
        });

        this.updatePhysics();
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.chartCanvas.width = this.chartCanvas.offsetWidth;
        this.chartCanvas.height = this.chartCanvas.offsetHeight;
    }

    updatePhysics() {
        this.re = (this.rho * this.velocity * this.diameter) / this.mu;
        this.velReadout.innerText = this.velocity.toFixed(2);
        this.reValue.innerText = Math.round(this.re);

        // Check for instability trigger
        if (!this.isRevealed && this.re > 2000) {
            this.triggerReflectivePrompt();
        }
    }

    makePrediction(choice) {
        const overlay = document.getElementById('intro-overlay');
        overlay.classList.add('hidden');
        this.isRunning = true;

        if (choice === 'straight') {
            this.showToast("Correct intuition. Let's see how it holds as we change parameters.");
        } else {
            this.showToast("Interesting theory. Observe the dye carefully as you move the slider.");
        }

        // Enable Re readout after prediction
        setTimeout(() => {
            this.reReadout.style.visibility = 'visible';
            this.isRevealed = true;
        }, 3000);
    }

    detectGuessing() {
        const now = Date.now();
        if (now - this.lastSliderChange < 50) {
            this.guessingCount++;
        } else {
            this.guessingCount = Math.max(0, this.guessingCount - 1);
        }
        this.lastSliderChange = now;

        if (this.guessingCount > 20) {
            this.showToast("Slow down! Try to observe the exact moment the flow pattern changes.", "warning");
            this.guessingCount = 0;
        }
    }

    triggerReflectivePrompt() {
        if (this.promptShown) return;
        this.promptShown = true;
        this.showToast("Do you notice the slight wobble? What forces might be overcoming the viscosity here?", "info");
    }

    showToast(msg, type = 'info') {
        const container = document.getElementById('prompt-container');
        const toast = document.createElement('div');
        toast.className = 'card-premium reveal active';
        toast.style.padding = '15px 25px';
        toast.style.marginBottom = '10px';
        toast.style.background = 'rgba(15, 23, 42, 0.95)';
        toast.style.borderLeft = `4px solid ${type === 'warning' ? '#f59e0b' : '#06b6d4'}`;
        toast.innerHTML = `<p style="font-size: 0.9rem; margin: 0;">${msg}</p>`;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    resetDye() {
        this.particles = [];
    }

    animate() {
        if (this.isRunning) {
            this.updateParticles();
            this.draw();
            this.updateFluctuations();
        }
        requestAnimationFrame(() => this.animate());
    }

    updateParticles() {
        // Emit new particles
        if (this.particles.length < 500) {
            this.particles.push({
                x: 50,
                y: (this.canvas.height / 2) + (this.dyePos * this.canvas.height * 0.8),
                life: 1.0
            });
        }

        const instability = Math.max(0, (this.re - 1500) / 3000);
        const noiseScale = instability * 15;

        this.particles.forEach((p, i) => {
            // Velocity profile (Parabolic roughly, but here we simplify)
            // Near walls (top/bottom) it's slower
            const distFromCenter = Math.abs(p.y - this.canvas.height / 2) / (this.canvas.height / 2);
            const localVel = this.velocity * (1 - distFromCenter * distFromCenter) * 10;

            p.x += localVel;

            // Random walk / Turbulence
            if (this.re > 2000) {
                p.y += (Math.random() - 0.5) * noiseScale;
                p.x += (Math.random() - 0.5) * noiseScale;
            }

            p.life -= 0.005;
            if (p.x > this.canvas.width || p.life <= 0) {
                p.x = 50;
                p.y = (this.canvas.height / 2) + (this.dyePos * this.canvas.height * 0.8);
                p.life = 1.0;
            }
        });

        // Update Status Badge
        if (this.re < 2300) {
            this.statusBadge.innerText = "LAMINAR FLOW";
            this.statusBadge.style.color = "#06b6d4";
        } else if (this.re < 4000) {
            this.statusBadge.innerText = "TRANSITION REGIME";
            this.statusBadge.style.color = "#f59e0b";
        } else {
            this.statusBadge.innerText = "TURBULENT FLOW";
            this.statusBadge.style.color = "#ec4899";
        }
        this.statusBadge.className = "status-badge visible";
    }

    updateFluctuations() {
        const base = this.velocity;
        let noise = 0;
        if (this.re > 2000) {
            noise = (Math.random() - 0.5) * (this.re / 5000) * 0.5;
        }
        this.fluctuations.push(noise);
        if (this.fluctuations.length > 100) this.fluctuations.shift();

        // Draw fluctuations
        const w = this.chartCanvas.width;
        const h = this.chartCanvas.height;
        this.chartCtx.clearRect(0, 0, w, h);
        this.chartCtx.strokeStyle = "#06b6d4";
        this.chartCtx.beginPath();
        this.fluctuations.forEach((v, i) => {
            const x = (i / 100) * w;
            const y = (h / 2) + v * h;
            if (i === 0) this.chartCtx.moveTo(x, y);
            else this.chartCtx.lineTo(x, y);
        });
        this.chartCtx.stroke();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Pipe
        this.ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(50, (this.canvas.height / 2) - 100, this.canvas.width - 100, 200);

        // Draw Dye Particles
        this.ctx.fillStyle = "#ec4899";
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1.0;
    }
}

const app = new ReynoldsLab();
