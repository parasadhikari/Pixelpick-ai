import { useState } from "react";
import toast from "react-hot-toast";
import { useApp } from "../../context/AppContext";

const GradientGenerator = () => {
    const { selectedColor } = useApp();

    const [secondColor, setSecondColor] =
        useState("#000000");

    const [direction, setDirection] =
        useState("90deg");

    if (!selectedColor?.hex) return null;

    const gradient =
        `linear-gradient(${direction}, ${selectedColor.hex}, ${secondColor})`;

    const copyCSS = async () => {
        await navigator.clipboard.writeText(
            `background: ${gradient};`
        );

        toast.success("Gradient CSS copied");
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
                🌈 Gradient Generator
            </h2>

            <p
                className="
                    text-xs
                    text-gray-500
                    dark:text-gray-400
                    mb-4
                "
            >
                Create a smooth color transition between your
                selected color and another color.
            </p>

            {/* Preview */}

            <div
                className="
                    h-28
                    rounded-2xl
                    border
                    border-gray-300
                    dark:border-gray-600
                    mb-4
                "
                style={{
                    background: gradient,
                }}
            />

            {/* Colors */}

            <div className="grid grid-cols-2 gap-3 mb-4">

                <div>

                    <label
                        className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            block
                            mb-1
                        "
                    >
                        Selected
                    </label>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            border
                            border-gray-300
                            dark:border-gray-600
                            bg-white
                            dark:bg-gray-800
                            rounded-xl
                            p-2
                        "
                    >

                        <div
                            className="
                                w-8
                                h-8
                                rounded-lg
                                border
                                border-gray-300
                                dark:border-gray-600
                            "
                            style={{
                                backgroundColor:
                                    selectedColor.hex,
                            }}
                        />

                        <span
                            className="
                                font-mono
                                text-sm
                                text-gray-800
                                dark:text-gray-100
                            "
                        >
                            {selectedColor.hex}
                        </span>

                    </div>

                </div>

                <div>

                    <label
                        className="
                            text-xs
                            text-gray-500
                            dark:text-gray-400
                            block
                            mb-1
                        "
                    >
                        Second Color
                    </label>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            border
                            border-gray-300
                            dark:border-gray-600
                            bg-white
                            dark:bg-gray-800
                            rounded-xl
                            p-2
                        "
                    >

                        <input
                            type="color"
                            value={secondColor}
                            onChange={(e) =>
                                setSecondColor(e.target.value)
                            }
                            className="w-8 h-8 cursor-pointer"
                        />

                        <span
                            className="
                                font-mono
                                text-sm
                                text-gray-800
                                dark:text-gray-100
                            "
                        >
                            {secondColor}
                        </span>

                    </div>

                </div>

            </div>

            {/* Direction */}

            <select
                value={direction}
                onChange={(e) =>
                    setDirection(e.target.value)
                }
                className="
                    w-full
                    border
                    border-gray-300
                    dark:border-gray-600
                    rounded-xl
                    px-3
                    py-2
                    mb-3
                    bg-white
                    dark:bg-gray-800
                    text-gray-900
                    dark:text-white
                    outline-none
                    focus:ring-2
                    focus:ring-blue-500
                "
            >
                <option value="90deg">
                    Left → Right
                </option>

                <option value="180deg">
                    Top → Bottom
                </option>

                <option value="45deg">
                    Diagonal ↗
                </option>

                <option value="135deg">
                    Diagonal ↘
                </option>

                <option value="0deg">
                    Bottom → Top
                </option>
            </select>

            {/* CSS */}

            <div
                className="
                    bg-gray-100
                    dark:bg-gray-800
                    rounded-xl
                    p-3
                    mb-3
                    border
                    border-gray-200
                    dark:border-gray-700
                "
            >

                <p
                    className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                        mb-1
                    "
                >
                    CSS
                </p>

                <code
                    className="
                        text-xs
                        break-all
                        text-gray-800
                        dark:text-gray-200
                    "
                >
                    background: {gradient};
                </code>

            </div>

            <button
                onClick={copyCSS}
                className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    py-2.5
                    rounded-xl
                    font-semibold
                    transition
                "
            >
                📋 Copy CSS
            </button>

        </div>
    );
};

export default GradientGenerator;