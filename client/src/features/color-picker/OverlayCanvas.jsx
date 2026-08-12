import { useEffect, useRef } from "react";
import { useOverlay } from "../../context/OverlayContext";

const OverlayCanvas = ({ canvasRef, color }) => {
  const { tolerance } = useOverlay();

  const overlayRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !overlayRef.current) return;

    // Cancel previous rendering if tolerance/color changes quickly
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(() => {
      const source = canvasRef.current;
      const overlay = overlayRef.current;

      if (!source || !overlay) return;

      const width = source.width;
      const height = source.height;

      if (!width || !height) return;

      // Match canvas resolution
      overlay.width = width;
      overlay.height = height;

      // Match displayed size
      overlay.style.width = `${source.clientWidth}px`;
      overlay.style.height = `${source.clientHeight}px`;

      const srcCtx = source.getContext("2d", {
        willReadFrequently: true,
      });

      const overlayCtx = overlay.getContext("2d");

      overlayCtx.clearRect(
        0,
        0,
        width,
        height
      );

      // Nothing selected
      if (!color) return;

      // Get source pixels
      const sourceImage = srcCtx.getImageData(
        0,
        0,
        width,
        height
      );

      const sourcePixels = sourceImage.data;

      // Create overlay pixels
      const overlayImage = overlayCtx.createImageData(
        width,
        height
      );

      const overlayPixels = overlayImage.data;

      // Store matching pixels
      const mask = new Uint8Array(
        width * height
      );

      // Use squared distance instead of Math.sqrt()
      const toleranceSquared =
        tolerance * tolerance;

      // --------------------------------
      // STEP 1: Find matching pixels
      // --------------------------------

      for (
        let i = 0, pixelIndex = 0;
        i < sourcePixels.length;
        i += 4, pixelIndex++
      ) {
        const dr =
          sourcePixels[i] - color.r;

        const dg =
          sourcePixels[i + 1] - color.g;

        const db =
          sourcePixels[i + 2] - color.b;

        const distanceSquared =
          dr * dr +
          dg * dg +
          db * db;

        if (
          distanceSquared <=
          toleranceSquared
        ) {
          mask[pixelIndex] = 1;
        }
      }

      // --------------------------------
      // STEP 2: Create shading + boundary
      // --------------------------------

      const brightness =
        0.299 * color.r +
        0.587 * color.g +
        0.114 * color.b;

      const boundaryValue =
        brightness > 150 ? 0 : 255;

      for (
        let y = 0;
        y < height;
        y++
      ) {
        for (
          let x = 0;
          x < width;
          x++
        ) {
          const index =
            y * width + x;

          const outputIndex =
            index * 4;

          // --------------------------------
          // Non-matching pixel
          // Darken it
          // --------------------------------

          if (!mask[index]) {
            overlayPixels[outputIndex] = 0;
            overlayPixels[outputIndex + 1] = 0;
            overlayPixels[outputIndex + 2] = 0;
            overlayPixels[outputIndex + 3] = 115;

            continue;
          }

          // --------------------------------
          // Matching pixel
          // Keep transparent
          // so original image remains visible
          // --------------------------------

          overlayPixels[outputIndex] = 0;
          overlayPixels[outputIndex + 1] = 0;
          overlayPixels[outputIndex + 2] = 0;
          overlayPixels[outputIndex + 3] = 0;

          // --------------------------------
          // Detect boundary
          // --------------------------------

          const left =
            x > 0
              ? mask[index - 1]
              : 0;

          const right =
            x < width - 1
              ? mask[index + 1]
              : 0;

          const top =
            y > 0
              ? mask[index - width]
              : 0;

          const bottom =
            y < height - 1
              ? mask[index + width]
              : 0;

          const isBoundary =
            !left ||
            !right ||
            !top ||
            !bottom;

          if (isBoundary) {
            overlayPixels[outputIndex] =
              boundaryValue;

            overlayPixels[outputIndex + 1] =
              boundaryValue;

            overlayPixels[outputIndex + 2] =
              boundaryValue;

            overlayPixels[outputIndex + 3] =
              230;
          }
        }
      }

      // Draw everything in ONE operation
      overlayCtx.putImageData(
        overlayImage,
        0,
        0
      );
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }
    };
  }, [canvasRef, color, tolerance]);

  return (
    <canvas
      ref={overlayRef}
      className="
        absolute
        inset-0
        w-full
        h-full
        pointer-events-none
      "
    />
  );
};

export default OverlayCanvas;