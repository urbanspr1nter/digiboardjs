const Colors = {
    Red: { r: 255, g: 0, b: 0 },
    Orange: { r: 255, g: 140, b: 0 },
    Yellow: { r: 255, g: 255, b: 0 },
    Green: { r: 0, g: 187, b: 0 },
    Blue: { r: 0, g: 0, b: 187 },
    Purple: { r: 128, g: 0, b: 128 },
    Black: { r: 0, g: 0, b: 0 },
    White: { r: 255, g: 255, b: 255 },

    getRgbCss: (color) => {
        return `rgb(${color.r}, ${color.g}, ${color.b})`;
    },

    isEqual: (color1, color2) => {
        return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
    }
};

export default Colors;