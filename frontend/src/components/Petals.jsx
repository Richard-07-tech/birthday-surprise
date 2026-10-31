import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/feedback";

// Gentle floating petals + star-specks on a fixed canvas.
export default function Petals() {
  const ref = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let w, h, dpr;
    const DPR = () => Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      dpr = DPR();
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = window.innerWidth < 640 ? 14 : 24;
    const petal = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 3 + Math.random() * 5,
      vy: 0.25 + Math.random() * 0.55,
      drift: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
      rot: Math.random() * Math.PI * 2,
      gold: Math.random() < 0.3,
      alpha: 0.25 + Math.random() * 0.4,
      star: Math.random() < 0.3,
    });
    const items = Array.from({ length: COUNT }, petal);

    const drawPetal = (p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.gold ? "#D9A441" : "#F5A3C0";
      if (p.star) {
        ctx.beginPath();
        ctx.arc(0, 0, p.r * 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    let visible = true;
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      items.forEach((p) => {
        p.y += p.vy;
        p.drift += 0.01;
        p.rot += p.spin;
        p.x += Math.sin(p.drift) * 0.4;
        if (p.y > h + 12) {
          p.y = -12;
          p.x = Math.random() * w;
        }
        drawPetal(p);
      });
      if (visible) raf = requestAnimationFrame(tick);
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
