import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useOverlay } from "../../context/OverlayContext";

const Palette = ({ palette }) => {
    const {
        setOverlayColor,
        lockedColor,
        setLockedColor,
    } = useOverlay();

    if (!palette.length) return null;

    const copy = async (hex) => {
        await navigator.clipboard.writeText(hex);
        toast.success(`${hex} copied`);
    };

    return (
        <div
            className="
                bg-white dark:bg-gray-900
                rounded-3xl
                shadow-xl
                border border-gray-200 dark:border-gray-700
                p-6
                transition-colors duration-300
            "
        >

            {/* Heading */}
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

            {/* Description */}
            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-5
                "
            >
                Automatically extracted colors from your image.
                Click a color to highlight where it appears.
            </p>

            {/* Palette */}
            <div className="grid grid-cols-2 gap-4">

                {palette.map((color) => {

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

                                // Same color → unlock
                                if (isLocked) {
                                    setLockedColor(null);
                                    setOverlayColor(null);
                                    return;
                                }

                                // New color → lock
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

                                ${isLocked
                                    ? "ring-4 ring-blue-500 scale-105"
                                    : "hover:scale-105 hover:shadow-lg"
                                }
                            `}
                        >

                            {/* Color Preview */}
                            <div
                                className="h-16"
                                style={{
                                    backgroundColor:
                                        color.hex,
                                }}
                            />

                            {/* Color Information */}
                            <div className="p-3">

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-2
                                    "
                                >

                                    {/* HEX */}
                                    <span
                                        className="
                                            font-mono
                                            text-sm
                                            text-gray-800
                                            dark:text-gray-100
                                        "
                                    >
                                        {color.hex}
                                    </span>

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >

                                        {/* Percentage */}
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

                                        {/* Selected */}
                                        {isLocked && (
                                            <span
                                                className="
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

                                        {/* Copy */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copy(color.hex);
                                            }}
                                            className="
                                                p-2
                                                rounded-lg
                                                text-gray-600
                                                dark:text-gray-300
                                                hover:bg-gray-100
                                                dark:hover:bg-gray-700
                                                transition
                                            "
                                            title="Copy HEX"
                                        >
                                            <Copy size={18} />
                                        </button>

                                    </div>

                                </div>

                                {/* Coverage */}
                                <div
                                    className="
                                        mt-2
                                        h-1.5
                                        bg-gray-200
                                        dark:bg-gray-700
                                        rounded-full
                                        overflow-hidden
                                    "
                                >
                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            transition-all
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

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default Palette;