import { useRef, useState, useCallback } from "react";

import {
    rgbToHex,
    rgbToRgb,
    rgbToHsl,
} from "../utils/colorUtils";

const MAX_CANVAS_WIDTH = 1400;
const MAX_CANVAS_HEIGHT = 1000;

export default function useCanvas(
    setHoverColor,
    setSelectedColor
) {
    const canvasRef = useRef(null);

    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0,
        displayX: null,
        displayY: null,
    });

    const drawImage = useCallback((imageUrl) => {
        if (!canvasRef.current || !imageUrl) return;

        const canvas = canvasRef.current;

        const ctx = canvas.getContext("2d", {
            willReadFrequently: true,
        });

        const img = new Image();

        img.crossOrigin = "anonymous";

        img.onload = () => {
            const widthRatio =
                MAX_CANVAS_WIDTH / img.width;

            const heightRatio =
                MAX_CANVAS_HEIGHT / img.height;

            // Never enlarge smaller images
            const scale = Math.min(
                widthRatio,
                heightRatio,
                1
            );

            const width = Math.round(
                img.width * scale
            );

            const height = Math.round(
                img.height * scale
            );

            canvas.width = width;
            canvas.height = height;

            ctx.clearRect(
                0,
                0,
                width,
                height
            );

            ctx.drawImage(
                img,
                0,
                0,
                width,
                height
            );
        };

        img.src = imageUrl;
    }, []);

    const getColor = useCallback((event) => {
        const canvas = canvasRef.current;

        if (!canvas) return null;

        const rect =
            canvas.getBoundingClientRect();

        if (!rect.width || !rect.height) {
            return null;
        }

        let x = Math.floor(
            ((event.clientX - rect.left) *
                canvas.width) /
            rect.width
        );

        let y = Math.floor(
            ((event.clientY - rect.top) *
                canvas.height) /
            rect.height
        );

        // Keep coordinates inside canvas
        x = Math.max(
            0,
            Math.min(
                x,
                canvas.width - 1
            )
        );

        y = Math.max(
            0,
            Math.min(
                y,
                canvas.height - 1
            )
        );

        // Update cursor position
        setMousePosition({
            x,
            y,
            displayX:
                event.clientX - rect.left,
            displayY:
                event.clientY - rect.top,
        });

        const ctx =
            canvas.getContext("2d", {
                willReadFrequently: true,
            });

        const pixel =
            ctx.getImageData(
                x,
                y,
                1,
                1
            ).data;

        return {
            x,
            y,

            r: pixel[0],
            g: pixel[1],
            b: pixel[2],

            hex: rgbToHex(
                pixel[0],
                pixel[1],
                pixel[2]
            ),

            rgb: rgbToRgb(
                pixel[0],
                pixel[1],
                pixel[2]
            ),

            hsl: rgbToHsl(
                pixel[0],
                pixel[1],
                pixel[2]
            ),
        };
    }, []);

    // ==============================
    // MOUSE MOVE
    // ==============================

    const handleMove = useCallback(
        (event) => {
            const color = getColor(event);

            if (color) {
                setHoverColor(color);
            }
        },
        [
            getColor,
            setHoverColor,
        ]
    );

    // ==============================
    // CLICK
    // ==============================

    const handleClick = useCallback(
        (event) => {
            const color = getColor(event);

            if (color) {
                setSelectedColor(color);
            }
        },
        [
            getColor,
            setSelectedColor,
        ]
    );

    // ==============================
    // MOUSE LEAVE
    // ==============================

    const handleLeave = useCallback(() => {
        setMousePosition({
            x: 0,
            y: 0,
            displayX: null,
            displayY: null,
        });

        setHoverColor(null);
    }, [setHoverColor]);

    return {
        canvasRef,
        mousePosition,
        drawImage,

        handleMove,
        handleClick,
        handleLeave,
    };
}