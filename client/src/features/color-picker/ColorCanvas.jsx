import { useEffect } from "react";
import Crosshair from "./Crosshair";
import { useOverlay } from "../../context/OverlayContext";
import OverlayCanvas from "./OverlayCanvas";

const ColorCanvas = ({ imageUrl, canvas }) => {
    const {
        canvasRef,
        drawImage,
        handleMove,
        handleClick,
        handleLeave,
        mousePosition,
    } = canvas;
    const { overlayColor } = useOverlay();

    useEffect(() => {
        drawImage(imageUrl);
    }, [imageUrl, drawImage]);

    return (
        <div
            className="
                relative
                w-full
                overflow-hidden
                rounded-2xl
            "
            onMouseLeave={handleLeave}
        >

            {/* ==============================
                MAIN IMAGE
            ============================== */}

            <canvas
                ref={canvasRef}
                onMouseMove={handleMove}
                onMouseLeave={handleLeave}
                onClick={handleClick}
                className="
        max-w-full
        max-h-full
        w-auto
        h-auto
        rounded-2xl
        border
        border-gray-200
        dark:border-gray-700
        shadow-sm
    "
            />

            {/* ==============================
                COLOR OVERLAY
            ============================== */}

            <OverlayCanvas
                canvasRef={canvasRef}
                color={overlayColor}
            />

            {/* ==============================
                CURSOR + ZOOM
            ============================== */}

            {mousePosition.displayX !== null &&
                mousePosition.displayY !== null &&
                mousePosition.displayX !== undefined &&
                mousePosition.displayY !== undefined && (

                    <Crosshair
                        mousePosition={mousePosition}
                        canvasRef={canvasRef}
                    />

                )}

        </div>
    );
};

export default ColorCanvas;