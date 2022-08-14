export const MathUtil = {
    vec2distance: (a, b) => {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    },
    toString: number => {
        return Intl.NumberFormat("en-UK", {maximumFractionDigits: 2}).format(number);
    },
    /**
     * Clamps the value between a minimum and a maximum.
     * null values will be taken as infinity.
     * @param {number} number The number to clamp.
     * @param {number} min The minimum value.
     * @param {number} max The maximum value.
     */
    clamp: (number, min, max) => {
        min = min ?? -Infinity;
        max = max ?? Infinity;

        number = Math.min(max, number);
        return Math.max(min, number);
    },
    /**
     * Truncates a number to the given amount of decimal places.
     * @param {number} number The number to truncate.
     * @param {number} decimalPlaces The number of decimals to preserve.
     */
    truncate: (number, decimalPlaces = 0) => {
        const tenPow = Math.pow(10, decimalPlaces);
        return Math.trunc(number * tenPow) / tenPow;
    },
};