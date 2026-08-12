import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Copy } from "lucide-react";

const SelectedColor = () => {
    const { selectedColor } = useApp();

    if (!selectedColor.hex) return null;

    const copy = async (value, label) => {
        await navigator.clipboard.writeText(value);
        toast.success(`${label} copied`);
    };

    const CopyRow = ({ label, value }) => (
        <div
            className="
                flex items-center justify-between
                py-3
                border-b
                last:border-b-0
                border-gray-200
                dark:border-gray-700
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
                    dark:text-gray-100
                "
            >
                {value}
            </span>

            <button
                onClick={() => copy(value, label)}
                className="
                    p-2
                    rounded-lg
                    text-gray-600
                    dark:text-gray-300
                    hover:bg-gray-100
                    dark:hover:bg-gray-700
                    transition
                "
            >
                <Copy size={18} />
            </button>
        </div>
    );

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
                    mb-5
                    text-gray-900
                    dark:text-white
                "
            >
                Selected Color
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    -mt-2
                    mb-4
                "
            >
                The color you selected from the image. You can copy
                its HEX, RGB, or HSL value.
            </p>

            <div
                className="
                    h-32
                    rounded-2xl
                    border
                    border-gray-300
                    dark:border-gray-600
                    mb-6
                "
                style={{
                    backgroundColor: selectedColor.hex,
                }}
            />

            <CopyRow
                label="HEX"
                value={selectedColor.hex}
            />

            <CopyRow
                label="RGB"
                value={selectedColor.rgb}
            />

            <CopyRow
                label="HSL"
                value={selectedColor.hsl}
            />

        </div>
    );
};

export default SelectedColor;