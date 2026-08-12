import { Download } from "lucide-react";
import toast from "react-hot-toast";

const PaletteExport = ({ palette }) => {

    if (!palette?.length) return null;

    const downloadFile = (
        content,
        filename,
        type
    ) => {

        const blob = new Blob(
            [content],
            { type }
        );

        const url =
            URL.createObjectURL(blob);

        const a =
            document.createElement("a");

        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    };

    const exportJSON = () => {

        const data = palette.map(
            (color, index) => ({
                name: `color-${index + 1}`,
                hex: color.hex,
                rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
                coverage: `${color.percentage}%`,
            })
        );

        downloadFile(
            JSON.stringify(data, null, 2),
            "pixelpick-palette.json",
            "application/json"
        );

        toast.success(
            "JSON palette downloaded"
        );
    };

    const exportCSS = () => {

        const variables = palette
            .map(
                (color, index) =>
                    `  --color-${index + 1}: ${color.hex};`
            )
            .join("\n");

        const css =
            `:root {\n${variables}\n}`;

        downloadFile(
            css,
            "pixelpick-palette.css",
            "text/css"
        );

        toast.success(
            "CSS palette downloaded"
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
                📤 Export Palette
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-4
                "
            >
                Download your extracted colors as CSS variables
                or JSON data for use in your projects.
            </p>

            <div className="grid grid-cols-2 gap-3">

                <button
                    onClick={exportCSS}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2

                        py-3
                        rounded-xl

                        bg-gray-900
                        dark:bg-gray-700

                        text-white

                        hover:bg-gray-800
                        dark:hover:bg-gray-600

                        transition
                    "
                >
                    <Download size={18} />
                    CSS
                </button>

                <button
                    onClick={exportJSON}
                    className="
                        flex
                        items-center
                        justify-center
                        gap-2

                        py-3
                        rounded-xl

                        bg-blue-600
                        text-white

                        hover:bg-blue-700

                        transition
                    "
                >
                    <Download size={18} />
                    JSON
                </button>

            </div>

        </div>
    );
};

export default PaletteExport;