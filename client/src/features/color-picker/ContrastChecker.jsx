import { useMemo } from "react";
import { useApp } from "../../context/AppContext";

const getLuminance = (r, g, b) => {
    const values = [r, g, b].map((value) => {
        const v = value / 255;

        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
    });

    return (
        0.2126 * values[0] +
        0.7152 * values[1] +
        0.0722 * values[2]
    );
};

const ContrastChecker = () => {
    const { selectedColor } = useApp();

    const ratio = useMemo(() => {
        if (!selectedColor?.hex) return null;

        const luminance = getLuminance(
            selectedColor.r,
            selectedColor.g,
            selectedColor.b
        );

        const white = 1;

        return (
            (Math.max(luminance, white) + 0.05) /
            (Math.min(luminance, white) + 0.05)
        );
    }, [selectedColor]);

    if (!selectedColor?.hex) return null;

    const roundedRatio = ratio.toFixed(2);

    const aaNormal = ratio >= 4.5;
    const aaLarge = ratio >= 3;
    const aaaNormal = ratio >= 7;

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
                ♿ Contrast Checker
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-4
                "
            >
                Checks how easily text can be read on this color
                and whether it meets WCAG accessibility guidelines.
            </p>

            {/* Preview */}

            <div
                className="
                    rounded-2xl
                    p-5
                    mb-4
                "
                style={{
                    backgroundColor: selectedColor.hex,
                    color: "#ffffff",
                }}
            >
                <p className="text-2xl font-bold">
                    PixelPick AI
                </p>

                <p className="text-sm mt-1">
                    White text preview
                </p>
            </div>

            {/* Ratio */}

            <div className="text-center mb-4">

                <p
                    className="
                        text-sm
                        text-gray-500
                        dark:text-gray-400
                    "
                >
                    Contrast against white
                </p>

                <p
                    className="
                        text-4xl
                        font-bold
                        mt-1
                        text-gray-900
                        dark:text-white
                    "
                >
                    {roundedRatio}:1
                </p>

            </div>

            {/* Results */}

            <div className="space-y-2 text-sm">

                <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200">
                        WCAG AA Normal
                    </span>

                    <span
                        className={`font-semibold ${aaNormal
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {aaNormal ? "✓ Pass" : "✕ Fail"}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200">
                        WCAG AA Large
                    </span>

                    <span
                        className={`font-semibold ${aaLarge
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {aaLarge ? "✓ Pass" : "✕ Fail"}
                    </span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-200">
                        WCAG AAA Normal
                    </span>

                    <span
                        className={`font-semibold ${aaaNormal
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                    >
                        {aaaNormal ? "✓ Pass" : "✕ Fail"}
                    </span>
                </div>

            </div>

        </div>
    );
};

export default ContrastChecker;