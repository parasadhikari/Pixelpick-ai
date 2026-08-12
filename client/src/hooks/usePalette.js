import { useState, useCallback } from "react";

const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((value) =>
      value.toString(16).padStart(2, "0")
    )
    .join("")
    .toUpperCase();

const usePalette = () => {
  const [palette, setPalette] = useState([]);

  const generatePalette = useCallback((imageUrl) => {
    if (!imageUrl) {
      setPalette([]);
      return;
    }

    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      // Keep processing fast for large images
      const MAX_SIZE = 400;

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
      for (let i = 0; i < pixels.length; i += 16) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const alpha = pixels[i + 3];

        // Ignore transparent pixels
        if (alpha < 128) continue;

        // Group similar colors
        const qr = Math.round(r / 32) * 32;
        const qg = Math.round(g / 32) * 32;
        const qb = Math.round(b / 32) * 32;

        const key = `${qr},${qg},${qb}`;

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

      const totalSamples = Object.values(colorMap)
        .reduce((sum, color) => sum + color.count, 0);

      const colors = Object.values(colorMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
        .map((color) => ({
          r: color.r,
          g: color.g,
          b: color.b,
          hex: rgbToHex(
            color.r,
            color.g,
            color.b
          ),
          percentage: Number(
            ((color.count / totalSamples) * 100).toFixed(1)
          ),
        }));

      setPalette(colors);
    };

    img.onerror = () => {
      setPalette([]);
    };

    img.src = imageUrl;
  }, []);

  return {
    palette,
    generatePalette,
  };
};

export default usePalette;