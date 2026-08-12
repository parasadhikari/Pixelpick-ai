import { useState } from "react";
import toast from "react-hot-toast";
import { useOverlay } from "../../context/OverlayContext";

const hexToRgb = (hex) => {
    const clean = hex.replace("#", "");

    if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
        return null;
    }

    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16),
        hex: `#${clean.toUpperCase()}`,
    };
};

const FindColor = () => {
    const [hex, setHex] = useState("#FF5733");

    const {
        setOverlayColor,
        setLockedColor,
    } = useOverlay();

    const findColor = () => {
        const color = hexToRgb(hex);

        if (!color) {
            toast.error("Enter a valid HEX color");
            return;
        }

        setHex(color.hex);

        setLockedColor(color);
        setOverlayColor(color);

        toast.success(`${color.hex} highlighted`);
    };

    const clearColor = () => {
        setLockedColor(null);
        setOverlayColor(null);
    };

    return (
        <div
            className="
                bg-white
                dark:bg-gray-900
                rounded-3xl
                shadow-xl
                border
                border-gray-200
                dark:border-gray-700
                p-5
                transition-colors
                duration-300
            "
        >

            <h2
                className="
                    text-xl
                    font-bold
                    mb-1
                    text-gray-900
                    dark:text-white
                "
            >
                🔎 Find a Color
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-4
                "
            >
                Enter a HEX color to highlight similar areas
                in the image.
            </p>

            <div className="flex gap-2">

                <input
                    type="text"
                    value={hex}
                    onChange={(e) =>
                        setHex(e.target.value)
                    }
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            findColor();
                        }
                    }}
                    placeholder="#FF5733"
                    maxLength={7}
                    className="
                        flex-1
                        border
                        border-gray-300
                        dark:border-gray-600
                        bg-white
                        dark:bg-gray-800
                        text-gray-900
                        dark:text-white
                        rounded-xl
                        px-3
                        py-2
                        font-mono
                        text-sm
                        outline-none
                        focus:ring-2
                        focus:ring-blue-500
                    "
                />

                <input
                    type="color"
                    value={
                        /^#[0-9A-Fa-f]{6}$/.test(hex)
                            ? hex
                            : "#FF5733"
                    }
                    onChange={(e) =>
                        setHex(
                            e.target.value.toUpperCase()
                        )
                    }
                    className="w-11 h-11 cursor-pointer"
                    title="Choose color"
                />

            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">

                <button
                    onClick={findColor}
                    className="
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        py-2.5
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    Find Color
                </button>

                <button
                    onClick={clearColor}
                    className="
                        bg-gray-100
                        dark:bg-gray-800
                        hover:bg-gray-200
                        dark:hover:bg-gray-700
                        text-gray-700
                        dark:text-gray-200
                        py-2.5
                        rounded-xl
                        font-semibold
                        transition
                    "
                >
                    Clear
                </button>

            </div>

        </div>
    );
};

export default FindColor;