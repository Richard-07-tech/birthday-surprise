import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/feedback";

/**
 * High-performance canvas confetti burst for celebratory moments
 */
export default function HeroConfetti({ trigger = true, duration = 4500 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger || prefersReducedMotion()) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const colors = [
      "#f472b6", // petal pink
      "#db2777", // deep rose
      "#e9b44c", // warm gold
      "#fbbf24", // bright gold
      "#fda4af", // soft blush
      "#ffffff", // pure white
      "#f43f5e", // crimson
    ];

    const particles = [];
    const particleCount = 85;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 120,
        y: height * 0.45 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 5,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        shape: Math.random() > 0.4 ? "rect" : "circle",
      });
    }

    const startTime = performance.now();

    function render(currentTime) {
      const elapsed = currentTime - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.28; // gravity
        p.vx *= 0.985; // air drag
        p.rotation += p.rotSpeed;

        if (elapsed > duration * 0.65) {
          p.opacity = Math.max(0, 1 - (elapsed - duration * 0.65) / (duration * 0.35));
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    }

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
    };
  }, [trigger, duration]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
}
