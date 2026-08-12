import {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect,
} from "react";

const AppContext = createContext();

const emptyColor = {
    hex: "",
    rgb: "",
    hsl: "",
    r: 0,
    g: 0,
    b: 0,
};

export const AppProvider = ({ children }) => {
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrlState] = useState("");

    // Keeps track of the currently active object URL
    const imageUrlRef = useRef("");

    const [hoverColor, setHoverColor] =
        useState(emptyColor);

    const [selectedColor, setSelectedColorState] =
        useState(emptyColor);

    const [history, setHistory] = useState([]);

    // --------------------------------
    // IMAGE URL MANAGEMENT
    // --------------------------------

    const setImageUrl = useCallback((newUrl) => {
        // Revoke previous object URL
        if (
            imageUrlRef.current &&
            imageUrlRef.current !== newUrl
        ) {
            URL.revokeObjectURL(
                imageUrlRef.current
            );
        }

        imageUrlRef.current = newUrl || "";

        setImageUrlState(newUrl || "");
    }, []);

    // --------------------------------
    // SELECTED COLOR
    // --------------------------------

    const setSelectedColor = useCallback((color) => {
        if (!color?.hex) return;

        setSelectedColorState(color);

        setHistory((prev) => {
            const filtered = prev.filter(
                (c) => c.hex !== color.hex
            );

            return [
                color,
                ...filtered,
            ].slice(0, 10);
        });
    }, []);

    // --------------------------------
    // CLEAR EVERYTHING
    // --------------------------------

    const clearAll = useCallback(() => {
        if (imageUrlRef.current) {
            URL.revokeObjectURL(
                imageUrlRef.current
            );

            imageUrlRef.current = "";
        }

        setImageFile(null);
        setImageUrlState("");

        setHoverColor(emptyColor);
        setSelectedColorState(emptyColor);

        setHistory([]);
    }, []);

    // --------------------------------
    // CLEANUP WHEN APP CLOSES
    // --------------------------------

    useEffect(() => {
        return () => {
            if (imageUrlRef.current) {
                URL.revokeObjectURL(
                    imageUrlRef.current
                );

                imageUrlRef.current = "";
            }
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                imageFile,
                imageUrl,

                hoverColor,
                selectedColor,

                history,

                setImageFile,
                setImageUrl,

                setHoverColor,
                setSelectedColor,

                clearAll,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () =>
    useContext(AppContext);