import React from 'react';
import PropTypes from "prop-types";

function Button ({
    baseStyle = "normal",
    className,
    disabled = false,
    highlight = false,
    icon,
    iconStyle = "g",
    label,
    onClick,
    selected = false,
    size = "normal",
    title,
}) {
    baseStyle = `style-${baseStyle}`;
    size = `size-${size}`;
    const highlightClass = highlight ? "highlight" : "";
    const selectedClass = selected ? "selected" : "";

    return (
        <button
            className={`default-button ${size} ${baseStyle} ${selected} ${highlightClass} ${selectedClass}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            {icon && iconStyle === "g" && <span className="icon material-icons">{icon}</span>}
            {icon && iconStyle === "g-round" && <span className="icon material-icons-round">{icon}</span>}
            {icon && iconStyle === "g-outline" && <span className="icon material-icons-outlined">{icon}</span>}
            {icon && iconStyle === "line" && <span className={`icon las ${icon}`} />}
            {icon && iconStyle === "fa" && <span className={`icon fas ${icon}`} />}
            {icon && iconStyle === "fad" && <span className={`icon fa-duotone ${icon}`} />}
            {label && <span className={`label ${icon ? "label-margin" : ""}`}>{label}</span>}
        </button>
    );
}

Button.propTypes = {
    /** A base style to apply to the button. */
    baseStyle: PropTypes.oneOf(["normal", "clear", "inverted", "success", "danger"]),
    /** Classes to apply to the <button> element. */
    className: PropTypes.string,
    disabled: PropTypes.bool,
    highlight: PropTypes.bool,
    /** The icon to display. */
    icon: PropTypes.string,
    /** The library that contains the icon. */
    iconStyle: PropTypes.oneOf(["g", "g-round", "g-outline", "line", "fa", "fad"]),
    /** The text in the button. */
    label: PropTypes.string,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    /** The size of the button (and its content). */
    size: PropTypes.oneOf(["small", "normal", "big"]),
    /** A legend to show while hovering. */
    title: PropTypes.string,
}
export default Button;