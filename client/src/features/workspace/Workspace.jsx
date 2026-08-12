import { useEffect } from "react";
import { useApp } from "../../context/AppContext";

import useCanvas from "../../hooks/useCanvas";
import usePalette from "../../hooks/usePalette";

import ColorCanvas from "../color-picker/ColorCanvas";
import SelectedColor from "../color-picker/SelectedColor";
import Palette from "../palette/Palette";
import ColorHistory from "../history/ColorHistory";
import ToleranceSlider from "../palette/ToleranceSlider";
import PaletteExport from "../palette/PaletteExport";
import ContrastChecker from "../color-picker/ContrastChecker";
import GradientGenerator from "../palette/GradientGenerator";
import FindColor from "../palette/FindColor";

const Workspace = ({ imageUrl, removeImage }) => {

    const {
        setHoverColor,
        setSelectedColor,
    } = useApp();

    const canvas = useCanvas(
        setHoverColor,
        setSelectedColor
    );

    const {
        palette,
        generatePalette,
    } = usePalette();

    useEffect(() => {
        if (imageUrl) {
            generatePalette(imageUrl);
        }
    }, [imageUrl, generatePalette]);

    return (
        <div
            className="
                mt-5
                text-gray-900
                dark:text-gray-100
                transition-colors
                duration-300
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    xl:grid-cols-12
                    gap-5
                "
            >

                {/* ======================================
                    IMAGE
                ====================================== */}

                <div className="xl:col-span-8">

                    <div
                        className="
                            bg-white
                            dark:bg-gray-900

                            rounded-3xl

                            shadow-xl

                            border
                            border-gray-200
                            dark:border-gray-700

                            p-3
                            sm:p-4

                            xl:h-[calc(100vh-145px)]
                            xl:min-h-[600px]

                            overflow-hidden

                            flex
                            items-center
                            justify-center

                            transition-colors
                            duration-300
                        "
                    >

                        <ColorCanvas
                            imageUrl={imageUrl}
                            canvas={canvas}
                        />

                    </div>

                </div>


                {/* ======================================
                    SIDEBAR
                ====================================== */}

                <div className="xl:col-span-4">

                    <div
                        className="
                            h-[calc(100vh-145px)]
                            min-h-[600px]

                            overflow-y-auto

                            pr-1

                            space-y-4

                            scrollbar-thin
                            scrollbar-thumb-gray-300
                            dark:scrollbar-thumb-gray-700

                            scrollbar-track-transparent
                        "
                    >

                        {/* Selected Color */}
                        <SelectedColor />


                        {/* Contrast Checker */}
                        <ContrastChecker />


                        {/* Gradient Generator */}
                        <GradientGenerator />


                        {/* AI Palette */}
                        <Palette
                            palette={palette}
                        />


                        {/* Find Color */}
                        <FindColor />


                        {/* Export */}
                        <PaletteExport
                            palette={palette}
                        />


                        {/* =================================
                            HISTORY + TOLERANCE
                        ================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                sm:grid-cols-2
                                gap-4
                            "
                        >

                            <ColorHistory />

                            <ToleranceSlider />

                        </div>


                        {/* =================================
                            REMOVE IMAGE
                        ================================= */}

                        <button
                            onClick={removeImage}
                            className="
                                w-full

                                py-3

                                rounded-2xl

                                bg-red-600
                                hover:bg-red-700

                                text-white

                                font-semibold

                                transition-all
                                duration-300

                                shadow-md
                            "
                        >
                            Remove Image
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Workspace;