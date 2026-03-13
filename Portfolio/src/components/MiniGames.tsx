import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const MiniGames: React.FC = () => {

    useEffect(() => {
        let animationFrames: number[] = [];

        // Safety check - if component unmounts, we should ideally cancel animation frames
        // But since it's an IIFE port, let's just make sure it runs once perfectly
        const runGames = () => {
            const flappyCanvas = document.getElementById('flappyCanvas') as HTMLCanvasElement;
            const dinoCanvas = document.getElementById('dinoCanvas') as HTMLCanvasElement;
            const dodgeCanvas = document.getElementById('dodgeCanvas') as HTMLCanvasElement;
            if (!flappyCanvas || !dinoCanvas || !dodgeCanvas) return;

            let activeGame = 'flappy';
            const safeFocus = (id: string) => { activeGame = id; };

            function setupFlappy() {
                const ctx = flappyCanvas.getContext('2d');
                if (!ctx) return null;
                const scoreEl = document.getElementById('flappyScore');
                const startBtn = document.getElementById('flappyStart');
                const pauseBtn = document.getElementById('flappyPause');
                const tapBtn = document.getElementById('flappyTap');

                const W = flappyCanvas.width;
                const H = flappyCanvas.height;
                let running = false, started = false, paused = false, over = false, score = 0, last = 0, spawn = 0;
                let bird = { x: 70, y: H / 2, vy: 0, r: 10 };
                let pipes: any[] = [];
                let afId: number;

                function reset() {
                    score = 0; over = false; paused = false; started = false; spawn = 0;
                    bird = { x: 70, y: H / 2, vy: 0, r: 10 }; pipes = [];
                    if (scoreEl) scoreEl.textContent = 'Score: 0';
                    if (pauseBtn) pauseBtn.textContent = 'Pause';
                }

                function flap() {
                    safeFocus('flappy');
                    if (!started || over) start();
                    else if (paused) resume();
                    bird.vy = -250;
                }

                function end() {
                    running = false; over = true; paused = false;
                    if (pauseBtn) pauseBtn.textContent = 'Pause';
                }

                function start() {
                    safeFocus('flappy'); reset(); running = true; started = true;
                    last = performance.now();
                    afId = requestAnimationFrame(loop);
                    animationFrames.push(afId);
                }

                function pause() {
                    if (!running || over) return;
                    running = false; paused = true;
                    if (pauseBtn) pauseBtn.textContent = 'Resume';
                }

                function resume() {
                    if (!paused || over) return;
                    paused = false; running = true;
                    if (pauseBtn) pauseBtn.textContent = 'Pause';
                    last = performance.now();
                    afId = requestAnimationFrame(loop);
                }

                function togglePause() { if (paused) resume(); else pause(); }

                function update(dt: number) {
                    spawn -= dt;
                    if (spawn <= 0) {
                        const gap = 78;
                        const top = 20 + Math.random() * (H - gap - 40);
                        pipes.push({ x: W + 20, top, gap, passed: false });
                        spawn = 1.2;
                    }

                    bird.vy += 500 * dt; bird.y += bird.vy * dt;

                    for (const p of pipes) {
                        p.x -= 140 * dt;
                        if (!p.passed && p.x + 36 < bird.x) {
                            p.passed = true; score += 1;
                            if (scoreEl) scoreEl.textContent = `Score: ${score}`;
                        }

                        const hitX = bird.x + bird.r > p.x && bird.x - bird.r < p.x + 36;
                        const hitTop = bird.y - bird.r < p.top;
                        const hitBottom = bird.y + bird.r > p.top + p.gap;
                        if (hitX && (hitTop || hitBottom)) end();
                    }

                    pipes = pipes.filter(p => p.x + 36 > -10);
                    if (bird.y + bird.r > H || bird.y - bird.r < 0) end();
                }

                function draw() {
                    if (!ctx) return;
                    ctx.clearRect(0, 0, W, H);
                    ctx.fillStyle = '#0b1020'; ctx.fillRect(0, 0, W, H);
                    ctx.fillStyle = '#38bdf8';
                    pipes.forEach(p => {
                        ctx.fillRect(p.x, 0, 36, p.top);
                        ctx.fillRect(p.x, p.top + p.gap, 36, H);
                    });
                    ctx.beginPath();
                    ctx.arc(bird.x, bird.y, bird.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#818cf8'; ctx.fill(); ctx.closePath();

                    if (!running && over) {
                        ctx.fillStyle = '#f0f0f0'; ctx.font = '16px "Orbitron", sans-serif';
                        ctx.fillText('Game Over - Restart', 95, H / 2);
                    } else if (!running && paused) {
                        ctx.fillStyle = '#f0f0f0'; ctx.font = '16px "Orbitron", sans-serif';
                        ctx.fillText('Paused', 150, H / 2);
                    }
                }

                function loop(ts: number) {
                    if (!running) { draw(); return; }
                    const dt = Math.min(0.033, (ts - last) / 1000);
                    last = ts;
                    update(dt); draw();
                    if (running) { afId = requestAnimationFrame(loop); animationFrames.push(afId); }
                }

                startBtn?.addEventListener('click', start);
                pauseBtn?.addEventListener('click', togglePause);
                tapBtn?.addEventListener('click', flap);
                flappyCanvas.addEventListener('pointerdown', flap);
                flappyCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
                reset(); draw();
                return { action: flap, pause, resume, isPaused: () => paused, isRunning: () => running };
            }

            function setupDino() {
                const ctx = dinoCanvas.getContext('2d');
                if (!ctx) return null;
                const scoreEl = document.getElementById('dinoScore');
                const startBtn = document.getElementById('dinoStart');
                const pauseBtn = document.getElementById('dinoPause');
                const jumpBtn = document.getElementById('dinoJump');
                const W = dinoCanvas.width; const H = dinoCanvas.height;
                let afId: number;

                let running = false, started = false, paused = false, over = false, score = 0, last = 0, spawn = 0;
                let dino = { x: 45, y: 165, w: 22, h: 35, vy: 0 };
                let obstacles: any[] = [];
                const ground = 200;

                function reset() {
                    running = false; started = false; paused = false; over = false; score = 0; spawn = 0;
                    dino = { x: 45, y: 165, w: 22, h: 35, vy: 0 }; obstacles = [];
                    if (scoreEl) scoreEl.textContent = 'Score: 0';
                    if (pauseBtn) pauseBtn.textContent = 'Pause';
                }

                function jump() {
                    safeFocus('dino');
                    if (!started || over) start();
                    else if (paused) resume();
                    if (dino.y + dino.h >= ground) dino.vy = -320;
                }

                function start() {
                    safeFocus('dino'); reset(); running = true; started = true;
                    last = performance.now(); afId = requestAnimationFrame(loop);
                    animationFrames.push(afId);
                }

                function end() { running = false; over = true; paused = false; if (pauseBtn) pauseBtn.textContent = 'Pause'; }
                function pause() { if (!running || over) return; running = false; paused = true; if (pauseBtn) pauseBtn.textContent = 'Resume'; }
                function resume() { if (!paused || over) return; paused = false; running = true; if (pauseBtn) pauseBtn.textContent = 'Pause'; last = performance.now(); afId = requestAnimationFrame(loop); }
                function togglePause() { if (paused) resume(); else pause(); }

                function update(dt: number) {
                    spawn -= dt;
                    if (spawn <= 0) {
                        obstacles.push({ x: W + 10, y: 170, w: 16 + Math.random() * 10, h: 30 });
                        spawn = 0.9 + Math.random() * 0.7;
                    }
                    dino.vy += 760 * dt; dino.y += dino.vy * dt;
                    if (dino.y + dino.h > ground) { dino.y = ground - dino.h; dino.vy = 0; }

                    for (const ob of obstacles) {
                        ob.x -= 200 * dt;
                        const hit = dino.x < ob.x + ob.w && dino.x + dino.w > ob.x && dino.y < ob.y + ob.h && dino.y + dino.h > ob.y;
                        if (hit) end();
                    }
                    obstacles = obstacles.filter(ob => ob.x + ob.w > -5);
                    score += dt * 10;
                    if (scoreEl) scoreEl.textContent = `Score: ${Math.floor(score)}`;
                }

                function draw() {
                    if (!ctx) return;
                    ctx.clearRect(0, 0, W, H);
                    ctx.fillStyle = '#070f17'; ctx.fillRect(0, 0, W, H);
                    ctx.fillStyle = '#2a3c5e'; ctx.fillRect(0, ground, W, 3);
                    ctx.fillStyle = '#34d399'; ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
                    ctx.fillStyle = '#38bdf8'; obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, ob.w, ob.h));

                    if (!running && over) {
                        ctx.fillStyle = '#f0f0f0'; ctx.font = '16px "Orbitron", sans-serif';
                        ctx.fillText('Crashed - Restart', 115, H / 2);
                    } else if (!running && paused) {
                        ctx.fillStyle = '#f0f0f0'; ctx.font = '16px "Orbitron", sans-serif';
                        ctx.fillText('Paused', 150, H / 2);
                    }
                }

                function loop(ts: number) {
                    if (!running) { draw(); return; }
                    const dt = Math.min(0.033, (ts - last) / 1000);
                    last = ts; update(dt); draw();
                    if (running) { afId = requestAnimationFrame(loop); animationFrames.push(afId); }
                }

                startBtn?.addEventListener('click', start); pauseBtn?.addEventListener('click', togglePause);
                jumpBtn?.addEventListener('click', jump); dinoCanvas.addEventListener('pointerdown', jump);
                dinoCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });
                reset(); draw();
                return { action: jump, pause, resume, isPaused: () => paused, isRunning: () => running };
            }

            function setupDodge() {
                const ctx = dodgeCanvas.getContext('2d');
                if (!ctx) return null;
                const scoreEl = document.getElementById('dodgeScore');
                const startBtn = document.getElementById('dodgeStart');
                const pauseBtn = document.getElementById('dodgePause');
                const leftBtn = document.getElementById('dodgeLeft');
                const rightBtn = document.getElementById('dodgeRight');
                const W = dodgeCanvas.width; const H = dodgeCanvas.height;
                let afId: number;

                let running = false, started = false, paused = false, over = false, score = 0, last = 0, spawn = 0;
                let player = { x: W / 2 - 16, y: H - 24, w: 32, h: 12 };
                let blocks: any[] = [];
                let moveLeft = false, moveRight = false;

                function reset() {
                    running = false; started = false; paused = false; over = false; score = 0; spawn = 0;
                    player = { x: W / 2 - 16, y: H - 24, w: 32, h: 12 }; blocks = []; moveLeft = false; moveRight = false;
                    if (scoreEl) scoreEl.textContent = 'Score: 0';
                    if (pauseBtn) pauseBtn.textContent = 'Pause';
                }

                function start() {
                    safeFocus('dodge'); reset(); running = true; started = true;
                    last = performance.now(); afId = requestAnimationFrame(loop);
                    animationFrames.push(afId);
                }

                function end() { running = false; over = true; paused = false; if (pauseBtn) pauseBtn.textContent = 'Pause'; }
                function pause() { if (!running || over) return; running = false; paused = true; if (pauseBtn) pauseBtn.textContent = 'Resume'; }
                function resume() { if (!paused || over) return; paused = false; running = true; if (pauseBtn) pauseBtn.textContent = 'Pause'; last = performance.now(); afId = requestAnimationFrame(loop); }
                function togglePause() { if (paused) resume(); else pause(); }

                function update(dt: number) {
                    if (moveLeft) player.x -= 220 * dt;
                    if (moveRight) player.x += 220 * dt;
                    player.x = Math.max(0, Math.min(W - player.w, player.x));

                    spawn -= dt;
                    if (spawn <= 0) {
                        const bw = 16 + Math.random() * 20;
                        blocks.push({ x: Math.random() * (W - bw), y: -15, w: bw, h: 12 + Math.random() * 16, v: 90 + Math.random() * 130 });
                        spawn = 0.3 + Math.random() * 0.35;
                    }

                    for (const b of blocks) {
                        b.y += b.v * dt;
                        const hit = player.x < b.x + b.w && player.x + player.w > b.x && player.y < b.y + b.h && player.y + player.h > b.y;
                        if (hit) end();
                    }
                    blocks = blocks.filter(b => b.y < H + 20);
                    score += dt * 12;
                    if (scoreEl) scoreEl.textContent = `Score: ${Math.floor(score)}`;
                }

                function draw() {
                    if (!ctx) return;
                    ctx.clearRect(0, 0, W, H);
                    ctx.fillStyle = '#111027'; ctx.fillRect(0, 0, W, H);
                    ctx.fillStyle = '#818cf8'; blocks.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));
                    ctx.fillStyle = '#34d399'; ctx.fillRect(player.x, player.y, player.w, player.h);
                    if (!running && over) {
                        ctx.fillStyle = '#f0f0f0'; ctx.font = '16px "Orbitron", sans-serif';
                        ctx.fillText('Hit - Restart', 130, H / 2);
                    } else if (!running && paused) {
                        ctx.fillStyle = '#f0f0f0'; ctx.font = '16px "Orbitron", sans-serif';
                        ctx.fillText('Paused', 150, H / 2);
                    }
                }

                function loop(ts: number) {
                    if (!running) { draw(); return; }
                    const dt = Math.min(0.033, (ts - last) / 1000);
                    last = ts; update(dt); draw();
                    if (running) { afId = requestAnimationFrame(loop); animationFrames.push(afId); }
                }

                function pressLeft(on: boolean) { safeFocus('dodge'); moveLeft = on; }
                function pressRight(on: boolean) { safeFocus('dodge'); moveRight = on; }

                startBtn?.addEventListener('click', start); pauseBtn?.addEventListener('click', togglePause);
                leftBtn?.addEventListener('pointerdown', () => pressLeft(true)); leftBtn?.addEventListener('pointerup', () => pressLeft(false));
                leftBtn?.addEventListener('pointerleave', () => pressLeft(false));
                rightBtn?.addEventListener('pointerdown', () => pressRight(true)); rightBtn?.addEventListener('pointerup', () => pressRight(false));
                rightBtn?.addEventListener('pointerleave', () => pressRight(false));

                dodgeCanvas.addEventListener('pointerdown', (e) => {
                    safeFocus('dodge'); const rect = dodgeCanvas.getBoundingClientRect(); const x = e.clientX - rect.left;
                    player.x = Math.max(0, Math.min(W - player.w, (x / rect.width) * W - player.w / 2));
                    if (!started || over) start(); else if (paused) resume();
                });
                dodgeCanvas.addEventListener('pointermove', (e) => {
                    if (!running) return; const rect = dodgeCanvas.getBoundingClientRect(); const x = e.clientX - rect.left;
                    player.x = Math.max(0, Math.min(W - player.w, (x / rect.width) * W - player.w / 2));
                });

                reset(); draw();
                return { leftDown: () => pressLeft(true), leftUp: () => pressLeft(false), rightDown: () => pressRight(true), rightUp: () => pressRight(false), pause, resume, isPaused: () => paused, isRunning: () => running };
            }

            const flappy = setupFlappy();
            const dino = setupDino();
            const dodge = setupDodge();
            const games: any = { flappy, dino, dodge };

            const gameCards = document.querySelectorAll('.game-card[data-game]');
            const selectBtns = document.querySelectorAll('.game-select-btn[data-game]');
            const gameOrder = ['flappy', 'dino', 'dodge'];
            const prevGameBtn = document.getElementById('prevGame');
            const nextGameBtn = document.getElementById('nextGame');

            function setActiveGame(gameId: string) {
                activeGame = gameId;
                gameCards.forEach(card => card.classList.toggle('hidden', card.getAttribute('data-game') !== gameId));
                selectBtns.forEach(btn => {
                    const isActive = btn.getAttribute('data-game') === gameId;
                    if (isActive) {
                        btn.classList.add('bg-primary/20', 'border-primary', 'text-white');
                        btn.classList.remove('bg-white/5', 'border-white/10', 'text-slate-400');
                    } else {
                        btn.classList.remove('bg-primary/20', 'border-primary', 'text-white');
                        btn.classList.add('bg-white/5', 'border-white/10', 'text-slate-400');
                    }
                });
                Object.keys(games).forEach(key => { if (key !== gameId && games[key]) games[key].pause(); });
            }

            selectBtns.forEach(btn => btn.addEventListener('click', () => setActiveGame(btn.getAttribute('data-game')!)));
            if (prevGameBtn) prevGameBtn.addEventListener('click', () => {
                const idx = gameOrder.indexOf(activeGame); const nextIdx = (idx - 1 + gameOrder.length) % gameOrder.length;
                setActiveGame(gameOrder[nextIdx]);
            });
            if (nextGameBtn) nextGameBtn.addEventListener('click', () => {
                const idx = gameOrder.indexOf(activeGame); const nextIdx = (idx + 1) % gameOrder.length;
                setActiveGame(gameOrder[nextIdx]);
            });
            setActiveGame('flappy');

            const handleKeyDown = (e: KeyboardEvent) => {
                const tag = (e.target as HTMLElement).tagName || '';
                if (tag === 'INPUT' || tag === 'TEXTAREA') return;

                if (e.code === 'Space') {
                    e.preventDefault();
                    if (activeGame === 'dino' && games.dino) games.dino.action();
                    else if (games.flappy) games.flappy.action();
                }
                if (activeGame === 'dodge' && e.code === 'ArrowLeft' && games.dodge) games.dodge.leftDown();
                if (activeGame === 'dodge' && e.code === 'ArrowRight' && games.dodge) games.dodge.rightDown();
                if (activeGame === 'dino' && e.code === 'ArrowUp' && games.dino) games.dino.action();
                if (e.code === 'KeyP') {
                    e.preventDefault();
                    if (games[activeGame]) games[activeGame].isPaused() ? games[activeGame].resume() : games[activeGame].pause();
                }
            };

            const handleKeyUp = (e: KeyboardEvent) => {
                if (activeGame === 'dodge' && e.code === 'ArrowLeft' && games.dodge) games.dodge.leftUp();
                if (activeGame === 'dodge' && e.code === 'ArrowRight' && games.dodge) games.dodge.rightUp();
            };

            document.addEventListener('keydown', handleKeyDown);
            document.addEventListener('keyup', handleKeyUp);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
            };
        };

        const cleanup = runGames();

        return () => {
            if (cleanup) cleanup();
            animationFrames.forEach(id => cancelAnimationFrame(id));
        };
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">

            {/* Game Selector */}
            <div className="flex flex-wrap gap-3 justify-center">
                <button className="game-select-btn px-6 py-2 rounded-lg font-mono text-sm tracking-wider uppercase border transition-all" data-game="flappy">Flappy Neon</button>
                <button className="game-select-btn px-6 py-2 rounded-lg font-mono text-sm tracking-wider uppercase border transition-all" data-game="dino">Dino Dash</button>
                <button className="game-select-btn px-6 py-2 rounded-lg font-mono text-sm tracking-wider uppercase border transition-all" data-game="dodge">Sky Dodge</button>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/10 relative overflow-hidden">

                {/* Flappy */}
                <div className="game-card flex flex-col items-center" data-game="flappy">
                    <div className="flex justify-between w-full max-w-[360px] mb-3 text-sm font-mono text-slate-400">
                        <span>Tap or Space to Flap</span>
                        <span id="flappyScore" className="text-secondary font-bold">Score: 0</span>
                    </div>
                    <canvas id="flappyCanvas" className="border border-white/10 rounded-xl cursor-crosshair bg-darker/50 w-full max-w-[360px]" width="360" height="220" style={{ touchAction: 'none' }}></canvas>

                    <div className="flex gap-4 mt-6 w-full max-w-[360px] justify-center">
                        <button id="flappyStart" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-primary text-dark rounded-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all">Start</button>
                        <button id="flappyPause" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono glass border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all">Pause</button>
                        <button id="flappyTap" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-accent/20 text-accent border border-accent rounded-lg md:hidden">Tap</button>
                    </div>
                </div>

                {/* Dino */}
                <div className="game-card hidden flex flex-col items-center" data-game="dino">
                    <div className="flex justify-between w-full max-w-[360px] mb-3 text-sm font-mono text-slate-400">
                        <span>Tap or Space to Jump</span>
                        <span id="dinoScore" className="text-accent font-bold">Score: 0</span>
                    </div>
                    <canvas id="dinoCanvas" className="border border-white/10 rounded-xl cursor-crosshair bg-darker/50 w-full max-w-[360px]" width="360" height="220" style={{ touchAction: 'none' }}></canvas>

                    <div className="flex gap-4 mt-6 w-full max-w-[360px] justify-center">
                        <button id="dinoStart" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-primary text-dark rounded-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all">Start</button>
                        <button id="dinoPause" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono glass border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all">Pause</button>
                        <button id="dinoJump" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-accent/20 text-accent border border-accent rounded-lg md:hidden">Jump</button>
                    </div>
                </div>

                {/* Dodge */}
                <div className="game-card hidden flex flex-col items-center" data-game="dodge">
                    <div className="flex justify-between w-full max-w-[360px] mb-3 text-sm font-mono text-slate-400">
                        <span>Touch/Move to Dodge</span>
                        <span id="dodgeScore" className="text-primary font-bold">Score: 0</span>
                    </div>
                    <canvas id="dodgeCanvas" className="border border-white/10 rounded-xl cursor-crosshair bg-darker/50 w-full max-w-[360px]" width="360" height="220" style={{ touchAction: 'none' }}></canvas>

                    <div className="flex gap-4 mt-6 w-full max-w-[360px] justify-center">
                        <button id="dodgeStart" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-primary text-dark rounded-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all">Start</button>
                        <button id="dodgePause" className="px-6 py-2 text-sm uppercase tracking-widest font-bold font-mono glass border border-white/10 text-white rounded-lg hover:bg-white/10 transition-all">Pause</button>

                        <div className="md:hidden flex gap-2">
                            <button id="dodgeLeft" className="px-4 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-accent/20 text-accent border border-accent rounded-lg">←</button>
                            <button id="dodgeRight" className="px-4 py-2 text-sm uppercase tracking-widest font-bold font-mono bg-accent/20 text-accent border border-accent rounded-lg">→</button>
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex justify-between">
                <button id="prevGame" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm"><ChevronLeft size={16} /> Prev</button>
                <button id="nextGame" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-mono uppercase tracking-widest text-sm">Next <ChevronRight size={16} /></button>
            </div>
        </div>
    );
};
