import React, { useEffect, useState } from 'react';

export const CursorFollower: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [target, setTarget] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        let animationFrameId: number;

        const onMouseMove = (e: MouseEvent) => {
            setTarget({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const onMouseOut = () => {
            setIsVisible(false);
        };

        // Use requestAnimationFrame for smooth trailing effect
        const animate = () => {
            setPosition(prev => ({
                x: prev.x + (target.x - prev.x) * 0.15,
                y: prev.y + (target.y - prev.y) * 0.15,
            }));
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseout', onMouseOut);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseout', onMouseOut);
            cancelAnimationFrame(animationFrameId);
        };
    }, [target]);

    return (
        <div
            className={`fixed top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none z-[9999] opacity-0 mix-blend-screen transition-opacity duration-300 ${isVisible ? 'opacity-100' : ''}`}
            style={{
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(129, 140, 248, 0.05) 40%, transparent 70%)',
                transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`,
            }}
        />
    );
};
