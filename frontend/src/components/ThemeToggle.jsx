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
      className="glass-card fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-90"
    >
      {dark ? (
        <Sun className="h-5 w-5 text-gold" />
      ) : (
        <Moon className="h-5 w-5 text-rose-deep" />
      )}
    </button>
  );
}
