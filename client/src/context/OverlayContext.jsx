import { createContext, useContext, useState } from "react";

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
    const [overlayColor, setOverlayColor] = useState(null);
    const [lockedColor, setLockedColor] = useState(null);

    const [tolerance, setTolerance] = useState(35);

    return (
        <OverlayContext.Provider
            value={{
                overlayColor,
                setOverlayColor,

                lockedColor,
                setLockedColor,

                tolerance,
                setTolerance,
            }}
        >
            {children}
        </OverlayContext.Provider>
    );
};

export const useOverlay = () => useContext(OverlayContext);