import tinycolor from "tinycolor2";

export const rgbToHex = (r, g, b) =>
  tinycolor({ r, g, b }).toHexString();

export const rgbToHsl = (r, g, b) =>
  tinycolor({ r, g, b }).toHslString();

export const rgbToRgb = (r, g, b) =>
  `rgb(${r}, ${g}, ${b})`;