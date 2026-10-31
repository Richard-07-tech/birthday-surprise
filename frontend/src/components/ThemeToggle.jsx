import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {
      /* private mode */
    }
  }, [dark]);

  return (
    <button
      type="button"
      data-testid="theme-toggle"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setDark((d) => !d)}
      className="glass-card fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-40 flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-full transition-transform active:scale-90 shadow-md cursor-pointer"
    >
      {dark ? (
        <Sun className="h-5 w-5 text-gold" />
      ) : (
        <Moon className="h-5 w-5 text-rose-deep" />
      )}
    </button>
  );
}
