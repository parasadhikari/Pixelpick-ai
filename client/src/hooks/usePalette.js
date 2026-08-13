import { useState, useCallback } from "react";
import { getColorName } from "../utils/colorNames";

const usePalette = () => {
    const [palette, setPalette] = useState([]);
    const [otherColors, setOtherColors] = useState([]);

    const generatePalette = useCallback((imageUrl) => {
        if (!imageUrl) {
            setPalette([]);
            setOtherColors([]);
            return;
        }

        const img = new Image();

        img.crossOrigin = "anonymous";

        img.onload = () => {
            const canvas = document.createElement("canvas");

            const ctx = canvas.getContext("2d", {
                willReadFrequently: true,
            });

            if (!ctx) {
                setPalette([]);
                setOtherColors([]);
                return;
            }

            // Keep processing fast
            const MAX_SIZE = 500;

            const scale = Math.min(
                MAX_SIZE / img.width,
                MAX_SIZE / img.height,
                1
            );

            canvas.width = Math.max(
                1,
                Math.floor(img.width * scale)
            );

            canvas.height = Math.max(
                1,
                Math.floor(img.height * scale)
            );

            ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const imageData = ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );

            const pixels = imageData.data;

            const colorMap = {};

            // Sample every 4th pixel
            for (
                let i = 0;
                i < pixels.length;
                i += 16
            ) {
                const r = pixels[i];
                const g = pixels[i + 1];
                const b = pixels[i + 2];
                const alpha = pixels[i + 3];

                // Ignore transparent pixels
                if (alpha < 128) continue;

                // Quantize colors into smaller buckets
                // to preserve more shades.
                const qr =
                    Math.min(
                        255,
                        Math.round(r / 16) * 16
                    );

                const qg =
                    Math.min(
                        255,
                        Math.round(g / 16) * 16
                    );

                const qb =
                    Math.min(
                        255,
                        Math.round(b / 16) * 16
                    );

                const key =
                    `${qr},${qg},${qb}`;

                if (!colorMap[key]) {
                    colorMap[key] = {
                        r: qr,
                        g: qg,
                        b: qb,
                        count: 0,
                    };
                }

                colorMap[key].count++;
            }

            const totalSamples =
                Object.values(colorMap).reduce(
                    (sum, color) =>
                        sum + color.count,
                    0
                );

            if (!totalSamples) {
                setPalette([]);
                setOtherColors([]);
                return;
            }

            const allColors =
                Object.values(colorMap)
                    .map((color) => {

                        // Create HEX first
                        const hex =
                            "#" +
                            [color.r, color.g, color.b]
                                .map((value) =>
                                    value
                                        .toString(16)
                                        .padStart(2, "0")
                                )
                                .join("")
                                .toUpperCase();

                        return {
                            r: color.r,
                            g: color.g,
                            b: color.b,

                            hex,

                            // IMPORTANT:
                            // getColorName expects HEX
                            name: getColorName(hex),

                            percentage: Number(
                                (
                                    (color.count /
                                        totalSamples) *
                                    100
                                ).toFixed(1)
                            ),
                        };
                    })
                    .sort(
                        (a, b) =>
                            b.percentage -
                            a.percentage
                    );

            // Main colors:
            // 2% or more
            const mainColors =
                allColors.filter(
                    (color) =>
                        color.percentage >= 2
                );

            // Smaller shades:
            // less than 2%
            const smallColors =
                allColors.filter(
                    (color) =>
                        color.percentage < 2
                );

            setPalette(mainColors);
            setOtherColors(smallColors);
        };

        img.onerror = () => {
            console.error(
                "Failed to load image for palette generation"
            );

            setPalette([]);
            setOtherColors([]);
        };

        img.src = imageUrl;
    }, []);

    return {
        palette,
        otherColors,
        generatePalette,
    };
};

export default usePalette;