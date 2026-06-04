import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-[var(--c-element)] hover:bg-[var(--c-element-hover-2)] text-[var(--c-text)] rounded-xl backdrop-blur-sm border border-[var(--c-border)] px-3 py-2.5 flex items-center justify-center transition-all"
      title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
