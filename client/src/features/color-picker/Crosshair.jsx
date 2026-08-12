import {
    useEffect,
    useRef,
    useState,
} from "react";

const SAMPLE = 15;
const SIZE = 140;

const ZOOM_WIDTH = 180;
const ZOOM_HEIGHT = 190;

// Distance from cursor
const OFFSET = 70;

const Crosshair = ({
    mousePosition,
    canvasRef,
}) => {

    const zoomRef = useRef(null);

    const [
        zoomPosition,
        setZoomPosition,
    ] = useState({
        left: 0,
        top: 0,
    });

    useEffect(() => {

        const canvas =
            canvasRef.current;

        const zoom =
            zoomRef.current;

        // ==============================
        // STOP IF CURSOR LEFT IMAGE
        // ==============================

        if (
            !canvas ||
            !zoom ||
            mousePosition.displayX === null ||
            mousePosition.displayY === null ||
            mousePosition.displayX === undefined ||
            mousePosition.displayY === undefined
        ) {
            return;
        }

        const x =
            mousePosition.x;

        const y =
            mousePosition.y;

        // ==============================
        // DRAW ZOOM
        // ==============================

        zoom.width = SIZE;
        zoom.height = SIZE;

        const ctx =
            zoom.getContext("2d");

        ctx.clearRect(
            0,
            0,
            SIZE,
            SIZE
        );

        ctx.imageSmoothingEnabled =
            false;

        const sx = Math.max(
            0,
            Math.min(
                x - SAMPLE / 2,
                canvas.width - SAMPLE
            )
        );

        const sy = Math.max(
            0,
            Math.min(
                y - SAMPLE / 2,
                canvas.height - SAMPLE
            )
        );

        ctx.drawImage(
            canvas,
            sx,
            sy,
            SAMPLE,
            SAMPLE,
            0,
            0,
            SIZE,
            SIZE
        );

        // ==============================
        // RED CROSSHAIR
        // ==============================

        ctx.strokeStyle =
            "#ff0000";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            SIZE / 2,
            0
        );

        ctx.lineTo(
            SIZE / 2,
            SIZE
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(
            0,
            SIZE / 2
        );

        ctx.lineTo(
            SIZE,
            SIZE / 2
        );

        ctx.stroke();

        // ==============================
        // REAL CURSOR POSITION
        // ==============================

        const rect =
            canvas.getBoundingClientRect();

        const cursorX =
            rect.left +
            mousePosition.displayX;

        const cursorY =
            rect.top +
            mousePosition.displayY;

        // ==============================
        // DEFAULT
        // RIGHT + BELOW
        // ==============================

        let left =
            cursorX + OFFSET;

        let top =
            cursorY + OFFSET;

        // ==============================
        // RIGHT EDGE
        // ==============================

        if (
            left + ZOOM_WIDTH >
            window.innerWidth
        ) {

            left =
                cursorX -
                ZOOM_WIDTH -
                OFFSET;
        }

        // ==============================
        // BOTTOM EDGE
        // ==============================

        if (
            top + ZOOM_HEIGHT >
            window.innerHeight
        ) {

            top =
                cursorY -
                ZOOM_HEIGHT -
                OFFSET;
        }

        // ==============================
        // FINAL SAFETY
        // ==============================

        left = Math.max(
            5,
            Math.min(
                left,
                window.innerWidth -
                ZOOM_WIDTH -
                5
            )
        );

        top = Math.max(
            5,
            Math.min(
                top,
                window.innerHeight -
                ZOOM_HEIGHT -
                5
            )
        );

        setZoomPosition({
            left,
            top,
        });

    }, [
        mousePosition,
        canvasRef,
    ]);

    // ==============================
    // HIDE EVERYTHING WHEN
    // CURSOR IS OUTSIDE IMAGE
    // ==============================

    if (
        mousePosition.displayX === null ||
        mousePosition.displayY === null ||
        mousePosition.displayX === undefined ||
        mousePosition.displayY === undefined
    ) {
        return null;
    }

    const rect =
        canvasRef.current
            ?.getBoundingClientRect();

    if (!rect) {
        return null;
    }

    return (
        <>
            {/* ==============================
                RED CURSOR
            ============================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    z-[999]

                    w-5
                    h-5

                    rounded-full

                    bg-red-500

                    border-2
                    border-white

                    shadow-lg
                "
                style={{
                    left:
                        rect.left +
                        mousePosition.displayX,

                    top:
                        rect.top +
                        mousePosition.displayY,

                    transform:
                        "translate(-50%, -50%)",
                }}
            />

            {/* ==============================
                FLOATING ZOOM
            ============================== */}

            <div
                className="
                    pointer-events-none

                    fixed
                    z-[998]

                    bg-white
                    dark:bg-gray-900

                    text-gray-900
                    dark:text-white

                    rounded-2xl

                    shadow-2xl

                    border
                    border-gray-200
                    dark:border-gray-700

                    p-3

                    transition-colors
                    duration-200
                "
                style={{
                    left:
                        zoomPosition.left,

                    top:
                        zoomPosition.top,

                    width:
                        ZOOM_WIDTH,
                }}
            >

                <p
                    className="
                        font-semibold
                        mb-2

                        text-gray-900
                        dark:text-white
                    "
                >
                    🔍 Zoom
                </p>

                <canvas
                    ref={zoomRef}
                    className="
                        rounded-lg

                        border
                        border-gray-300
                        dark:border-gray-600

                        w-[140px]
                        h-[140px]
                    "
                />

            </div>

        </>
    );
};

export default Crosshair;