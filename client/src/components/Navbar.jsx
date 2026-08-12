import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">

      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5">

        <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
          🎨 PixelPick AI
        </h1>

        <div className="flex items-center gap-6">

          <div className="hidden sm:flex items-center gap-6 text-gray-700 dark:text-gray-200">
            <button>Home</button>
            <button>Tools</button>
            <button>About</button>
          </div>

          {/* Theme Toggle */}

          <button
            onClick={toggleTheme}
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              bg-gray-100
              hover:bg-gray-200
              dark:bg-gray-800
              dark:hover:bg-gray-700
              text-gray-700
              dark:text-yellow-300
              transition
            "
            title={
              theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>

        </div>

      </div>

    </nav>
  );
};

export default Navbar;