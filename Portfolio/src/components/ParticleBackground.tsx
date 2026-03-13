import React, { useEffect, useRef } from 'react';

export const ParticleBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const handleMouseOut = () => {
            mouseX = -1000;
            mouseY = -1000;
        };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseOut);
        window.addEventListener('resize', handleResize);

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            density: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                const colors = ['rgba(56, 189, 248, 0.6)', 'rgba(129, 140, 248, 0.6)', 'rgba(16, 185, 129, 0.6)'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.density = (Math.random() * 30) + 1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 150;

                if (distance < maxDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    let force = (maxDistance - distance) / maxDistance;
                    if (force < 0) force = 0;

                    const directionX = (forceDirectionX * force * this.density);
                    const directionY = (forceDirectionY * force * this.density);

                    this.x -= directionX;
                    this.y -= directionY;
                }

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color;
            }
        }

        let particles: Particle[] = [];

        const init = () => {
            particles = [];
            const particleCount = Math.floor((width * height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        let animationId: number;
        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            for (let a = 0; a < particles.length; a++) {
                particles[a].update();
                particles[a].draw();

                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(129, 140, 248, ${0.2 - (distance / 100) * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
            animationId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseOut);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <>
            <div className="fixed inset-0 -z-30 bg-darker overflow-hidden">
                <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-60 animate-blob top-[-10vw] left-[-10vw] bg-[radial-gradient(circle,var(--tw-colors-primary)_0%,transparent_70%)] [animation-duration:25s] [animation-delay:-5s]"></div>
                <div className="absolute w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-60 animate-blob bottom-[-10vw] right-[-20vw] bg-[radial-gradient(circle,var(--tw-colors-secondary)_0%,transparent_70%)]"></div>
            </div>
            <div className="fixed inset-0 -z-20 backdrop-blur-[60px] bg-gradient-to-br from-white/5 to-white/0 pointer-events-none"></div>
            <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-none opacity-80" />
        </>
    );
};
