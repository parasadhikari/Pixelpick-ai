import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(() => {
        const savedTheme =
            localStorage.getItem("pixelpick-theme");

        // First-time visitor → DARK mode
        if (!savedTheme) {
            return "dark";
        }

        return savedTheme;
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem(
            "pixelpick-theme",
            theme
        );

    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) =>
            current === "light"
                ? "dark"
                : "light"
        );
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () =>
    useContext(ThemeContext);