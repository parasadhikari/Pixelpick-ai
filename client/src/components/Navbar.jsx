import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinkClass = ({ isActive }) =>
        `
      transition-colors
      duration-200
      ${isActive
            ? "text-blue-600 dark:text-blue-400 font-semibold"
            : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
        }
    `;

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors">

            <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-5">

                {/* Logo */}
                <NavLink
                    to="/"
                    onClick={closeMobileMenu}
                    className="font-bold text-2xl text-gray-900 dark:text-white"
                >
                    🎨 PixelPick AI
                </NavLink>


                {/* Desktop Navigation */}
                <div className="hidden sm:flex items-center gap-6">

                    <NavLink
                        to="/"
                        className={navLinkClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/tools"
                        className={navLinkClass}
                    >
                        Tools
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={navLinkClass}
                    >
                        About
                    </NavLink>

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


                {/* Mobile Controls */}
                <div className="flex sm:hidden items-center gap-2">

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


                    {/* Hamburger */}
                    <button
                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }
                        className="
              w-10
              h-10
              rounded-lg
              flex
              items-center
              justify-center
              bg-gray-100
              hover:bg-gray-200
              dark:bg-gray-800
              dark:hover:bg-gray-700
              text-gray-700
              dark:text-white
              transition
            "
                        aria-label="Toggle navigation menu"
                    >
                        {mobileMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}
                    </button>

                </div>

            </div>


            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    className="
            sm:hidden
            border-t
            border-gray-200
            dark:border-gray-800
            bg-white
            dark:bg-gray-900
            px-5
            py-4
          "
                >

                    <div className="flex flex-col gap-4">

                        <NavLink
                            to="/"
                            onClick={closeMobileMenu}
                            className={navLinkClass}
                        >
                            Home
                        </NavLink>

                        <NavLink
                            to="/tools"
                            onClick={closeMobileMenu}
                            className={navLinkClass}
                        >
                            Tools
                        </NavLink>

                        <NavLink
                            to="/about"
                            onClick={closeMobileMenu}
                            className={navLinkClass}
                        >
                            About
                        </NavLink>

                    </div>

                </div>
            )}

        </nav>
    );
};

export default Navbar;