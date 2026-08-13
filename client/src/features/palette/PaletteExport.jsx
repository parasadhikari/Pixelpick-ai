import { Download, FileText } from "lucide-react";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

const PaletteExport = ({
    palette,
    otherColors = [],
}) => {
    if (
        !palette?.length &&
        !otherColors?.length
    ) {
        return null;
    }

    const mainColors = palette || [];
    const minorColors = otherColors || [];

    const allColors = [
        ...mainColors,
        ...minorColors,
    ];

    // ==========================================
    // DOWNLOAD TEXT FILE
    // ==========================================

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

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
    };

    // ==========================================
    // JSON
    // ==========================================

    const createJSONData = () => {
        return {
            application: "PixelPick AI",

            mainColors: mainColors.map(
                (color, index) => ({
                    name:
                        color.name ||
                        `Color ${index + 1}`,

                    hex: color.hex,

                    rgb:
                        `rgb(${color.r}, ${color.g}, ${color.b})`,

                    coverage:
                        `${color.percentage}%`,
                })
            ),

            otherColors: minorColors.map(
                (color, index) => ({
                    name:
                        color.name ||
                        `Other Color ${index + 1}`,

                    hex: color.hex,

                    rgb:
                        `rgb(${color.r}, ${color.g}, ${color.b})`,

                    coverage:
                        `${color.percentage}%`,
                })
            ),
        };
    };

    const exportJSON = () => {
        const data = createJSONData();

        downloadFile(
            JSON.stringify(
                data,
                null,
                2
            ),
            "pixelpick-palette.json",
            "application/json"
        );

        toast.success(
            "JSON palette downloaded"
        );
    };

    // ==========================================
    // CSS
    // ==========================================

    const createCSS = () => {
        const variables =
            allColors
                .map(
                    (color, index) =>
                        `    --color-${index + 1}: ${color.hex};`
                )
                .join("\n");

        return `:root {\n${variables}\n}`;
    };

    const exportCSS = () => {
        const css = createCSS();

        downloadFile(
            css,
            "pixelpick-palette.css",
            "text/css"
        );

        toast.success(
            "CSS palette downloaded"
        );
    };

    // ==========================================
    // PDF HELPERS
    // ==========================================

    const addHeader = (
        doc,
        title,
        subtitle
    ) => {
        doc.setFontSize(22);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "PixelPick AI",
            20,
            20
        );

        doc.setFontSize(16);

        doc.text(
            title,
            20,
            32
        );

        doc.setFontSize(9);

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setTextColor(
            100,
            100,
            100
        );

        doc.text(
            subtitle,
            20,
            40
        );

        doc.setTextColor(
            0,
            0,
            0
        );
    };

    const addFooter = (doc) => {
        const pageCount =
            doc.internal.getNumberOfPages();

        for (
            let i = 1;
            i <= pageCount;
            i++
        ) {
            doc.setPage(i);

            doc.setFontSize(8);

            doc.setTextColor(
                130,
                130,
                130
            );

            doc.text(
                `PixelPick AI • Page ${i} of ${pageCount}`,
                20,
                290
            );
        }
    };

    // ==========================================
    // PALETTE PDF
    // ==========================================

    const exportPalettePDF = () => {
        const doc = new jsPDF();

        addHeader(
            doc,
            "Image Color Palette",
            "Extracted colors from your image"
        );

        let y = 55;

        // Main colors
        doc.setFontSize(14);

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "Main Colors",
            20,
            y
        );

        y += 10;

        doc.setFont(
            "helvetica",
            "normal"
        );

        mainColors.forEach(
            (color, index) => {
                if (y > 270) {
                    doc.addPage();

                    y = 20;
                }

                const hex =
                    color.hex.replace(
                        "#",
                        ""
                    );

                const rgb =
                    hex
                        .match(/.{2}/g)
                        .map(
                            (value) =>
                                parseInt(
                                    value,
                                    16
                                )
                        );

                // Swatch
                doc.setFillColor(
                    rgb[0],
                    rgb[1],
                    rgb[2]
                );

                doc.roundedRect(
                    20,
                    y - 7,
                    18,
                    12,
                    2,
                    2,
                    "F"
                );

                // Name
                doc.setFontSize(11);

                doc.setTextColor(
                    0,
                    0,
                    0
                );

                doc.text(
                    color.name ||
                    `Color ${index + 1}`,
                    45,
                    y
                );

                // HEX + coverage
                doc.setFontSize(9);

                doc.setTextColor(
                    100,
                    100,
                    100
                );

                doc.text(
                    `${color.hex}  •  ${color.percentage}%`,
                    45,
                    y + 6
                );

                y += 20;
            }
        );

        // Other colors
        if (minorColors.length) {
            if (y > 250) {
                doc.addPage();

                y = 20;
            }

            y += 5;

            doc.setFontSize(14);

            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.setTextColor(
                0,
                0,
                0
            );

            doc.text(
                "Other Colors (< 2%)",
                20,
                y
            );

            y += 10;

            minorColors.forEach(
                (color, index) => {
                    if (y > 270) {
                        doc.addPage();

                        y = 20;
                    }

                    const hex =
                        color.hex.replace(
                            "#",
                            ""
                        );

                    const rgb =
                        hex
                            .match(/.{2}/g)
                            .map(
                                (value) =>
                                    parseInt(
                                        value,
                                        16
                                    )
                            );

                    doc.setFillColor(
                        rgb[0],
                        rgb[1],
                        rgb[2]
                    );

                    doc.rect(
                        20,
                        y - 6,
                        12,
                        9,
                        "F"
                    );

                    doc.setFontSize(9);

                    doc.setTextColor(
                        0,
                        0,
                        0
                    );

                    doc.text(
                        color.name ||
                        `Other Color ${index + 1}`,
                        38,
                        y
                    );

                    doc.setTextColor(
                        100,
                        100,
                        100
                    );

                    doc.text(
                        `${color.hex} • ${color.percentage}%`,
                        120,
                        y
                    );

                    y += 13;
                }
            );
        }

        addFooter(doc);

        doc.save(
            "pixelpick-color-palette.pdf"
        );

        toast.success(
            "Palette PDF downloaded"
        );
    };

    // ==========================================
    // CSS PDF
    // ==========================================

    const exportCSSPDF = () => {
        const doc = new jsPDF();

        addHeader(
            doc,
            "CSS Color Variables",
            "CSS variables generated from your image palette"
        );

        let y = 55;

        doc.setFont(
            "courier",
            "normal"
        );

        doc.setFontSize(10);

        const cssLines = createCSS()
            .split("\n");

        cssLines.forEach(
            (line) => {
                if (y > 280) {
                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    line,
                    20,
                    y
                );

                y += 7;
            }
        );

        addFooter(doc);

        doc.save(
            "pixelpick-palette.css.pdf"
        );

        toast.success(
            "CSS PDF downloaded"
        );
    };

    // ==========================================
    // JSON PDF
    // ==========================================

    const exportJSONPDF = () => {
        const doc = new jsPDF();

        addHeader(
            doc,
            "JSON Color Data",
            "Structured color information generated by PixelPick AI"
        );

        let y = 55;

        doc.setFont(
            "courier",
            "normal"
        );

        doc.setFontSize(8);

        const jsonText =
            JSON.stringify(
                createJSONData(),
                null,
                2
            );

        const lines =
            doc.splitTextToSize(
                jsonText,
                170
            );

        lines.forEach(
            (line) => {
                if (y > 280) {
                    doc.addPage();

                    y = 20;
                }

                doc.text(
                    line,
                    20,
                    y
                );

                y += 5;
            }
        );

        addFooter(doc);

        doc.save(
            "pixelpick-palette.json.pdf"
        );

        toast.success(
            "JSON PDF downloaded"
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
                Download your complete palette
                in multiple formats.
            </p>

            {/* Normal Downloads */}

            <div
                className="
                    grid
                    grid-cols-2
                    gap-2
                    mb-3
                "
            >
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
                    <Download size={16} />

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
                    <Download size={16} />

                    JSON
                </button>
            </div>

            {/* PDF Downloads */}

            <div
                className="
                    border-t
                    border-gray-200
                    dark:border-gray-700
                    pt-3
                "
            >
                <p
                    className="
                        text-xs
                        font-semibold
                        text-gray-500
                        dark:text-gray-400
                        mb-2
                    "
                >
                    PDF EXPORTS
                </p>

                <div
                    className="
                        grid
                        grid-cols-3
                        gap-2
                    "
                >
                    <button
                        onClick={exportPalettePDF}
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-1
                            py-3
                            rounded-xl
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            transition
                        "
                    >
                        <FileText size={17} />

                        <span className="text-xs">
                            Palette
                        </span>
                    </button>

                    <button
                        onClick={exportCSSPDF}
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-1
                            py-3
                            rounded-xl
                            bg-orange-600
                            hover:bg-orange-700
                            text-white
                            transition
                        "
                    >
                        <FileText size={17} />

                        <span className="text-xs">
                            CSS PDF
                        </span>
                    </button>

                    <button
                        onClick={exportJSONPDF}
                        className="
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-1
                            py-3
                            rounded-xl
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            transition
                        "
                    >
                        <FileText size={17} />

                        <span className="text-xs">
                            JSON PDF
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaletteExport;