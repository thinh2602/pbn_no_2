// Fireworks Canvas Setup
const canvas = document.createElement('canvas');
canvas.id = 'fireworksCanvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.zIndex = '1';
canvas.style.pointerEvents = 'none'; // Prevent interaction with the canvas

// Firework Class
class Firework {
    constructor(x, targetY, color) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = targetY;
        this.color = color;
        this.particles = [];
        this.exploded = false;
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 / particleCount) * i;
            const speed = Math.random() * 4 + 2;
            const dx = Math.cos(angle) * speed;
            const dy = Math.sin(angle) * speed;
            this.particles.push({ x: this.x, y: this.y, dx, dy, alpha: 1 });
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, 1)`;
            ctx.fill();
        } else {
            this.particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${particle.alpha})`;
                ctx.fill();
            });
        }
    }

    update() {
        if (!this.exploded) {
            this.y -= 5;
            if (this.y <= this.targetY) {
                this.exploded = true;
                this.createParticles();
            }
        } else {
            this.particles.forEach(particle => {
                particle.x += particle.dx;
                particle.y += particle.dy;
                particle.alpha -= 0.02;
            });
            this.particles = this.particles.filter(particle => particle.alpha > 0);
        }
    }

    isDone() {
        return this.exploded && this.particles.length === 0;
    }
}

// Fireworks Logic
const fireworks = [];
const colors = [
    '255, 99, 71',   // Tomato
    '50, 205, 50',   // Lime Green
    '70, 130, 180',  // Steel Blue
    '255, 20, 147',  // Deep Pink
];

function animateFireworks() {
    // Clear canvas instead of drawing a semi-transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.draw();
        firework.update();
        if (firework.isDone() && index >= 0) { // Ensure index is valid
            fireworks.splice(index, 1);
        }
    });

    requestAnimationFrame(animateFireworks);
}

function launchFirework() {
    const x = Math.random() * canvas.width;
    const targetY = Math.random() * canvas.height / 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(x, targetY, color));
}

// Start Fireworks Animation
setInterval(launchFirework, 500);
animateFireworks();

// Flip-Book Logic
const book = document.getElementById('book');
const pages = document.querySelectorAll('.page');

// Reset all pages when mouse leaves the book
book.addEventListener('mouseleave', () => {
    pages.forEach(page => page.classList.remove('flipped'));
    book.classList.remove('open'); // Đưa sách về vị trí ban đầu
});

// Flip pages on click
pages.forEach((page, index) => {
    page.addEventListener('click', () => {
        if (!page.classList.contains('flipped')) {
            page.classList.add('flipped');

            // Ensure earlier pages remain flipped
            for (let i = 0; i < index; i++) {
                pages[i].classList.add('flipped');
            }

            // Dịch chuyển cuốn sách sang phải khi có trang lật
            book.classList.add('open');
        }
    });
});
