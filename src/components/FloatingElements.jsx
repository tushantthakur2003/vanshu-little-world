import React, { useMemo } from 'react';

export const FloatingElements = () => {
  // Generate stable random particles with subtle cute items
  const particles = useMemo(() => {
    const items = ['🌸', '✨', '💖', '🎀', '☁️', '🤍', '🌷', '⭐'];
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      char: items[i % items.length],
      left: `${(i * 5.5 + 4) % 94}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${14 + ((i * 3) % 10)}s`,
      size: `${12 + ((i * 4) % 14)}px`,
      opacity: 0.25 + ((i % 4) * 0.15),
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute -bottom-10 inline-block animate-float-slow text-center transition-opacity"
          style={{
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            transform: 'translateY(0)',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  );
};
