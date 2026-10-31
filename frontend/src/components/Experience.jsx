import { useEffect } from "react";
import Lenis from "lenis";
import Petals from "@/components/Petals";
import Hero from "@/components/Hero";
import MiruReveal from "@/components/MiruReveal";
import Timeline from "@/components/Timeline";
import MemoryCards from "@/components/MemoryCards";
import Letter from "@/components/Letter";
import EasterEggHeart from "@/components/EasterEggHeart";
import { prefersReducedMotion } from "@/utils/feedback";

export default function Experience() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative">
      <Petals />
      <div className="relative z-10">
        <Hero />
        <MiruReveal />
        <Timeline />
        <MemoryCards />
        <Letter />
      </div>
      <EasterEggHeart />
    </div>
  );
}
