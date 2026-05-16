let animationId;
let particles = [];
let weatherType = "clear"; // clear, cloudy, rain, snow, storm

function startAnimation(weatherCode) {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Map weather codes to animation types
    if (weatherCode <= 1 || weatherCode < 0) weatherType = "clear";
    else if (weatherCode <= 3 || weatherCode === 45 || weatherCode === 48) weatherType = "cloudy";
    else if ((weatherCode >= 51 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) weatherType = "rain";
    else if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) weatherType = "snow";
    else if (weatherCode >= 95 && weatherCode <= 99) weatherType = "storm";
    else weatherType = "clear";

    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Remove existing listener to prevent duplicates if called multiple times
    window.removeEventListener('resize', resize);
    window.addEventListener('resize', resize);
    resize();

    // Reset animation
    if (animationId) cancelAnimationFrame(animationId);
    particles = [];

    // Initialize particles based on type
    const numParticles = weatherType === "rain" || weatherType === "storm" ? 150 : (weatherType === "snow" ? 200 : (weatherType === "cloudy" ? 12 : 0));
    
    for (let i = 0; i < numParticles; i++) {
        particles.push(createParticle(canvas.width, canvas.height, weatherType));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (weatherType === "clear") {
            // Slow radial teal glow pulse
            const time = Date.now() * 0.001;
            const radius = Math.min(canvas.width, canvas.height) * (0.6 + Math.sin(time) * 0.1);
            const gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, radius);
            gradient.addColorStop(0, 'rgba(0, 194, 199, 0.15)');
            gradient.addColorStop(1, 'rgba(10, 22, 40, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (weatherType === "storm") {
            // Occasional white flash
            if (Math.random() < 0.01) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }

        // Draw and update particles
        particles.forEach(p => {
            if (weatherType === "rain" || weatherType === "storm") {
                ctx.strokeStyle = 'rgba(0, 194, 199, 0.5)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + p.vx * 2, p.y + p.vy * 2);
                ctx.stroke();

                p.x += p.vx;
                p.y += p.vy;

            } else if (weatherType === "snow") {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;

            } else if (weatherType === "cloudy") {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                ctx.fillRect(p.x, p.y, p.width, p.height);

                p.x += p.vx;
            }

            // Boundary checks
            if (p.y > canvas.height) {
                p.y = -20;
                p.x = Math.random() * canvas.width;
            }
            if (p.x > canvas.width) {
                if (weatherType === "cloudy") p.x = -p.width || -200;
                else p.x = Math.random() * canvas.width;
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    animate();
}

function createParticle(w, h, type) {
    if (type === "rain" || type === "storm") {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: Math.random() * 0.5 - 0.25,
            vy: Math.random() * 15 + 10
        };
    } else if (type === "snow") {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: Math.random() * 1 - 0.5,
            vy: Math.random() * 2 + 1,
            size: Math.random() * 2 + 1
        };
    } else if (type === "cloudy") {
        return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: Math.random() * 0.5 + 0.1,
            vy: 0,
            width: Math.random() * 300 + 100,
            height: Math.random() * 80 + 30
        };
    }
    return {};
}

// Expose to window
window.startAnimation = startAnimation;
