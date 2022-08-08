export const MathHelper = {
    vec2distance: (a, b) => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    toString: number => {
        return Intl.NumberFormat("en-UK", {maximumFractionDigits: 2}).format(number);
    },
};