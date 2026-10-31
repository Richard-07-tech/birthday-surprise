import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/feedback";

// Canvas fireworks barrage + slow floating lanterns. Runs once, when in view.
export default function Fireworks() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const canvas = ref.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h, dpr;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const sparks = [];
    const rockets = [];
    const lanterns = [];
    const start = performance.now();
    const barrageEnd = start + 7000;
    let nextRocket = start + 300;
    let nextLantern = start + 600;

    const spawnRocket = () => {
      rockets.push({
        x: (0.15 + 0.7 * Math.random()) * w,
        y: h * 0.98,
        vy: -(h * 0.011 + Math.random() * h * 0.004),
        targetY: (0.18 + 0.4 * Math.random()) * h,
        hue: Math.random() < 0.5 ? 340 : 42,
      });
    };

    const explode = (r) => {
      const n = 34;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.3;
        const sp = 1.6 + Math.random() * 2.2;
        sparks.push({
          x: r.x,
          y: r.y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1,
          hue: r.hue,
          size: 1.2 + Math.random() * 1.6,
        });
      }
    };

    const tick = (t) => {
      ctx.clearRect(0, 0, w, h);

      if (t < barrageEnd && t > nextRocket) {
        spawnRocket();
        nextRocket = t + 480 + Math.random() * 420;
      }
      if (t > nextLantern) {
        lanterns.push({
          x: (0.1 + 0.8 * Math.random()) * w,
          y: h + 30,
          vy: -(0.35 + Math.random() * 0.3),
          sway: Math.random() * Math.PI * 2,
          size: 5 + Math.random() * 4,
        });
        nextLantern = t + 1700 + Math.random() * 1200;
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy;
        r.vy *= 0.995;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = `hsl(${r.hue}, 90%, 75%)`;
        ctx.beginPath();
        ctx.arc(r.x, r.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        if (r.y <= r.targetY) {
          explode(r);
          rockets.splice(i, 1);
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.985;
        s.vy = s.vy * 0.985 + 0.02;
        s.life -= 0.011;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = Math.max(0, s.life);
        ctx.fillStyle = `hsl(${s.hue}, 85%, ${60 + s.life * 25}%)`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = lanterns.length - 1; i >= 0; i--) {
        const l = lanterns[i];
        l.y += l.vy;
        l.sway += 0.012;
        const lx = l.x + Math.sin(l.sway) * 8;
        if (l.y < -40) {
          lanterns.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(lx, l.y, 0, lx, l.y, l.size * 3);
        grad.addColorStop(0, "rgba(255,220,140,0.85)");
        grad.addColorStop(1, "rgba(255,200,110,0)");
        ctx.globalAlpha = 1;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(lx, l.y, l.size * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFE9B8";
        ctx.beginPath();
        ctx.ellipse(lx, l.y, l.size * 0.55, l.size, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
