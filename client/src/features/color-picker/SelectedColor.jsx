import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";
import { getColorName } from "../../utils/colorNames";

const SelectedColor = () => {
    const { selectedColor } = useApp();

    if (!selectedColor?.hex) {
        return null;
    }

    const copy = async (value, label) => {
        await navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
    };

    const CopyRow = ({ label, value }) => {
        return (
            <div
                className="
                    flex
                    items-center
                    justify-between
                    py-3
                    border-b
                    border-gray-200
                    dark:border-gray-700
                    last:border-b-0
                "
            >
                <span
                    className="
                        font-medium
                        text-gray-500
                        dark:text-gray-400
                        w-14
                    "
                >
                    {label}
                </span>

                <span
                    className="
                        flex-1
                        text-right
                        mr-4
                        font-semibold
                        break-all
                        text-gray-900
                        dark:text-white
                    "
                >
                    {value}
                </span>

                <button
                    onClick={() => copy(value, label)}
                    className="
                        p-2
                        rounded-lg
                        hover:bg-gray-100
                        dark:hover:bg-gray-700
                        transition
                    "
                    title={`Copy ${label}`}
                >
                    <Copy size={18} />
                </button>
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
                    text-3xl
                    font-bold
                    mb-2
                    text-gray-900
                    dark:text-white
                "
            >
                Selected Color
            </h2>

            <p
                className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    mb-5
                "
            >
                The color you selected from the image.
            </p>

            {/* Color Preview */}
            <div
                className="
                    h-48
                    rounded-2xl
                    border
                    border-gray-200
                    dark:border-gray-700
                    mb-5
                "
                style={{
                    backgroundColor: selectedColor.hex,
                }}
            />

            {/* Color Name */}
            <div
                className="
                    bg-gray-100
                    dark:bg-gray-800
                    rounded-2xl
                    p-5
                    mb-5
                "
            >
                <p
                    className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                        mb-1
                    "
                >
                    Color Name
                </p>

                <p
                    className="
                        text-2xl
                        font-bold
                        text-gray-900
                        dark:text-white
                    "
                >
                    {getColorName(selectedColor.hex)}
                </p>
            </div>

            {/* HEX */}
            <CopyRow
                label="HEX"
                value={selectedColor.hex}
            />

            {/* RGB */}
            <CopyRow
                label="RGB"
                value={selectedColor.rgb}
            />

            {/* HSL */}
            <CopyRow
                label="HSL"
                value={selectedColor.hsl}
            />
        </div>
    );
};

export default SelectedColor;