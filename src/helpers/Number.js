export const Number = {
    toString: toString,
};

function toString (number) {
    return Intl.NumberFormat("en-UK", {maximumFractionDigits: 2}).format(number);
}