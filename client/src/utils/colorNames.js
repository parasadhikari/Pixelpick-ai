// client/src/utils/colorName.js

const COLOR_NAMES = [
    // Reds
    { name: "Crimson Red", hex: "#DC143C" },
    { name: "Scarlet Red", hex: "#FF2400" },
    { name: "Ruby Red", hex: "#9B111E" },
    { name: "Brick Red", hex: "#CB4154" },
    { name: "Wine Red", hex: "#722F37" },
    { name: "Dusty Maroon", hex: "#8A414C" },
    { name: "Maroon", hex: "#800000" },
    { name: "Rose Red", hex: "#C21E56" },

    // Pinks
    { name: "Dusty Rose", hex: "#C08081" },
    { name: "Blush Pink", hex: "#DE5D83" },
    { name: "Rose Pink", hex: "#FF66CC" },
    { name: "Coral Pink", hex: "#F88379" },
    { name: "Salmon Pink", hex: "#FA8072" },

    // Oranges
    { name: "Burnt Orange", hex: "#CC5500" },
    { name: "Terracotta", hex: "#E2725B" },
    { name: "Peach", hex: "#FFCBA4" },
    { name: "Apricot", hex: "#FBCEB1" },
    { name: "Pumpkin Orange", hex: "#FF7518" },

    // Yellows
    { name: "Golden Yellow", hex: "#FFD700" },
    { name: "Mustard Yellow", hex: "#FFDB58" },
    { name: "Lemon Yellow", hex: "#FFF44F" },
    { name: "Honey Yellow", hex: "#EB9605" },
    { name: "Cream", hex: "#FFFDD0" },

    // Greens
    { name: "Apple Green", hex: "#8DB600" },
    { name: "Lime Green", hex: "#32CD32" },
    { name: "Forest Green", hex: "#228B22" },
    { name: "Emerald Green", hex: "#50C878" },
    { name: "Sage Green", hex: "#9CAF88" },
    { name: "Olive Green", hex: "#808000" },
    { name: "Moss Green", hex: "#8A9A5B" },
    { name: "Sea Green", hex: "#2E8B57" },
    { name: "Mint Green", hex: "#98FF98" },

    // Cyans / Teals
    { name: "Turquoise", hex: "#40E0D0" },
    { name: "Aqua Blue", hex: "#00FFFF" },
    { name: "Teal", hex: "#008080" },
    { name: "Deep Teal", hex: "#006D6F" },

    // Blues
    { name: "Sky Blue", hex: "#87CEEB" },
    { name: "Ocean Blue", hex: "#0077BE" },
    { name: "Royal Blue", hex: "#4169E1" },
    { name: "Navy Blue", hex: "#000080" },
    { name: "Steel Blue", hex: "#4682B4" },
    { name: "Powder Blue", hex: "#B0E0E6" },
    { name: "Denim Blue", hex: "#1560BD" },
    { name: "Cobalt Blue", hex: "#0047AB" },

    // Purples
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Violet", hex: "#8F00FF" },
    { name: "Royal Purple", hex: "#7851A9" },
    { name: "Plum Purple", hex: "#8E4585" },
    { name: "Amethyst", hex: "#9966CC" },
    { name: "Deep Purple", hex: "#673AB7" },

    // Browns
    { name: "Chocolate Brown", hex: "#7B3F00" },
    { name: "Coffee Brown", hex: "#6F4E37" },
    { name: "Walnut Brown", hex: "#5C4033" },
    { name: "Chestnut Brown", hex: "#954535" },
    { name: "Tan", hex: "#D2B48C" },
    { name: "Caramel", hex: "#C68E17" },
    { name: "Beige", hex: "#F5F5DC" },

    // Neutrals
    { name: "Charcoal", hex: "#36454F" },
    { name: "Slate Gray", hex: "#708090" },
    { name: "Cool Gray", hex: "#8C92AC" },
    { name: "Silver Gray", hex: "#C0C0C0" },
    { name: "Light Gray", hex: "#D3D3D3" },
    { name: "Off White", hex: "#FAF9F6" },
    { name: "Ivory", hex: "#FFFFF0" },
    { name: "Pure White", hex: "#FFFFFF" },
    { name: "Black", hex: "#000000" },
];

const hexToRgb = (hex) => {
    const clean = hex.replace("#", "");

    if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
        return null;
    }

    return {
        r: parseInt(clean.slice(0, 2), 16),
        g: parseInt(clean.slice(2, 4), 16),
        b: parseInt(clean.slice(4, 6), 16),
    };
};

const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = 0;
    let s = 0;

    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;

        s =
            l > 0.5
                ? d / (2 - max - min)
                : d / (max + min);

        switch (max) {
            case r:
                h =
                    (g - b) / d +
                    (g < b ? 6 : 0);
                break;

            case g:
                h =
                    (b - r) / d + 2;
                break;

            case b:
                h =
                    (r - g) / d + 4;
                break;
        }

        h *= 60;
    }

    return {
        h,
        s: s * 100,
        l: l * 100,
    };
};

const colorDistance = (a, b) => {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;

    return Math.sqrt(
        dr * dr +
        dg * dg +
        db * db
    );
};

const getNearestColor = (rgb) => {
    let closest = COLOR_NAMES[0];
    let smallestDistance = Infinity;

    for (const color of COLOR_NAMES) {
        const colorRgb = hexToRgb(color.hex);

        if (!colorRgb) continue;

        const distance = colorDistance(
            rgb,
            colorRgb
        );

        if (distance < smallestDistance) {
            smallestDistance = distance;
            closest = color;
        }
    }

    return closest.name;
};

// Generate a useful name when the color is
// between standard named colors.
const generateDescriptiveName = (rgb) => {
    const { h, s, l } = rgbToHsl(
        rgb.r,
        rgb.g,
        rgb.b
    );

    // Very low saturation = gray family
    if (s < 8) {
        if (l < 12) return "Near Black";
        if (l < 30) return "Dark Gray";
        if (l < 55) return "Gray";
        if (l < 78) return "Light Gray";
        return "Off White";
    }

    let base;

    if (h < 15 || h >= 345) {
        base = "Red";
    } else if (h < 40) {
        base = "Orange";
    } else if (h < 65) {
        base = "Yellow";
    } else if (h < 155) {
        base = "Green";
    } else if (h < 195) {
        base = "Cyan";
    } else if (h < 250) {
        base = "Blue";
    } else if (h < 290) {
        base = "Purple";
    } else if (h < 345) {
        base = "Pink";
    }

    let modifier = "";

    if (l < 25) {
        modifier = "Deep";
    } else if (l < 40) {
        modifier = "Dark";
    } else if (l > 82) {
        modifier = "Very Light";
    } else if (l > 68) {
        modifier = "Light";
    } else if (s < 30) {
        modifier = "Muted";
    } else if (s < 50) {
        modifier = "Dusty";
    } else if (s > 80) {
        modifier = "Vivid";
    }

    return modifier
        ? `${modifier} ${base}`
        : base;
};

export const getColorName = (hex) => {
    const rgb = hexToRgb(hex);

    if (!rgb) {
        return "Color";
    }

    const nearestName = getNearestColor(rgb);

    // Always return a useful name.
    // For unusual colors, generate a descriptive
    // human-readable name instead.
    const descriptiveName =
        generateDescriptiveName(rgb);

    return descriptiveName || nearestName;
};