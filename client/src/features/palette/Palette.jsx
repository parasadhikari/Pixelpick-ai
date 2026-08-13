import { useState } from "react";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";
import { useOverlay } from "../../context/OverlayContext";

const Palette = ({
    palette,
    otherColors = [],
}) => {
    const {
        setOverlayColor,
        lockedColor,
        setLockedColor,
    } = useOverlay();

    const [showOther, setShowOther] =
        useState(false);

    if (!palette?.length && !otherColors?.length) {
        return null;
    }

    const copy = async (hex) => {
        await navigator.clipboard.writeText(hex);
        toast.success(`${hex} copied`);
    };

    const renderColor = (color) => {
        const isLocked =
            lockedColor?.hex === color.hex;

        return (
            <div
                key={color.hex}
                onMouseEnter={() => {
                    if (!lockedColor) {
                        setOverlayColor(color);
                    }
                }}
                onMouseLeave={() => {
                    if (!lockedColor) {
                        setOverlayColor(null);
                    }
                }}
                onClick={() => {
                    if (isLocked) {
                        setLockedColor(null);
                        setOverlayColor(null);
                        return;
                    }

                    setLockedColor(color);
                    setOverlayColor(color);
                }}
                className={`
                    border
                    rounded-2xl
                    overflow-hidden
                    cursor-pointer
                    transition-all
                    duration-200

                    bg-white
                    dark:bg-gray-800

                    border-gray-200
                    dark:border-gray-700

                    ${
                        isLocked
                            ? "ring-4 ring-blue-500 scale-105"
                            : "hover:scale-105 hover:shadow-lg"
                    }
                `}
            >
                <div
                    className="h-16"
                    style={{
                        backgroundColor:
                            color.hex,
                    }}
                />

                <div className="p-3">
                    {/* Name */}
                    <p
                        className="
                            text-sm
                            font-semibold
                            text-gray-900
                            dark:text-white
                            truncate
                        "
                    >
                        {color.name}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-1">
                        <span
                            className="
                                font-mono
                                text-xs
                                text-gray-600
                                dark:text-gray-300
                            "
                        >
                            {color.hex}
                        </span>

                        <span
                            className="
                                text-xs
                                font-semibold
                                text-gray-500
                                dark:text-gray-400
                            "
                        >
                            {color.percentage}%
                        </span>
                    </div>

                    {isLocked && (
                        <span
                            className="
                                inline-block
                                mt-2
                                text-xs
                                bg-blue-600
                                text-white
                                px-2
                                py-1
                                rounded-full
                            "
                        >
                            ✓ Selected
                        </span>
                    )}

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            mt-2
                        "
                    >
                        <div
                            className="
                                h-1.5
                                bg-gray-200
                                dark:bg-gray-700
                                rounded-full
                                overflow-hidden
                                flex-1
                                mr-2
                            "
                        >
                            <div
                                className="
                                    h-full
                                    rounded-full
                                "
                                style={{
                                    width: `${Math.min(
                                        color.percentage,
                                        100
                                    )}%`,
                                    backgroundColor:
                                        color.hex,
                                }}
                            />
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                copy(color.hex);
                            }}
                            className="
                                p-1.5
                                rounded-lg
                                text-gray-600
                                dark:text-gray-300
                                hover:bg-gray-100
                                dark:hover:bg-gray-700
                            "
                            title="Copy HEX"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
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
                p-6
                transition-colors
                duration-300
            "
        >
            <h2
                className="
                    text-2xl
                    font-bold
                    mb-3
                    text-gray-900
                    dark:text-white
                "
            >
                🎨 AI Color Palette
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-5
                "
            >
                Colors detected from your image.
                Main colors show their coverage,
                while smaller shades are grouped
                under Other Colors.
            </p>

            {/* Main colors */}
            <div className="grid grid-cols-2 gap-4">
                {palette.map(renderColor)}
            </div>

            {/* Other colors */}
            {otherColors.length > 0 && (
                <div className="mt-5">
                    <button
                        onClick={() =>
                            setShowOther(
                                (value) => !value
                            )
                        }
                        className="
                            w-full
                            flex
                            items-center
                            justify-between
                            px-4
                            py-3
                            rounded-xl
                            bg-gray-100
                            dark:bg-gray-800
                            text-gray-900
                            dark:text-white
                            font-semibold
                            hover:bg-gray-200
                            dark:hover:bg-gray-700
                            transition
                        "
                    >
                        <span>
                            Other Colors
                            <span
                                className="
                                    ml-2
                                    text-xs
                                    text-gray-500
                                    dark:text-gray-400
                                "
                            >
                                ({otherColors.length} shades
                                below 2%)
                            </span>
                        </span>

                        {showOther ? (
                            <ChevronUp size={18} />
                        ) : (
                            <ChevronDown size={18} />
                        )}
                    </button>

                    {showOther && (
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {otherColors.map(
                                renderColor
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Palette;