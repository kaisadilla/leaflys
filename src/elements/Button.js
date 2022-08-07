import React from 'react';

/**
 * Valid props:
 ** baseStyle [**normal** | clear | inverted | success | danger] — the base style of the button.
 ** size [small | **normal** | big] — the size of the button's content.
 ** className — the class(es) of the button.
 ** onClick — The effect of the button on click.
 ** disabled {bool} — if true, the button is disabled.
 ** label — The text of the button.
 ** icon — The icon of the button.
 ** iconStyle — [**g** | g-round | g-outline | line | fa] — The library that contains the icon.
 ** title — A legend to show on hover.
 ** selected {bool} — if true, display an outline.
 ** highlight {bool} — if true, display an outline when focused.
 */
function Button (props) {
    const baseStyle = `style-${props.baseStyle ? props.baseStyle : "normal"}`;
    const baseSize = `size-${props.size ? props.size : "normal"}`;
    const highlight = props.highlight ? "highlight" : "";
    const selected = props.selected ? "selected" : "";
    const customClass = props.className ? props.className : "";
    const iconStyle = props.iconStyle ? props.iconStyle : "g";

    return (
        <button
            className={`default-button ${baseSize} ${baseStyle} ${selected} ${highlight} ${customClass}`}
            onClick={props.onClick}
            disabled={props.disabled}
            title={props.title}
        >
            {props.icon && iconStyle === "g" && <span className="icon material-icons">{props.icon}</span>}
            {props.icon && iconStyle === "g-round" && <span className="icon material-icons-round">{props.icon}</span>}
            {props.icon && iconStyle === "g-outline" && <span className="icon material-icons-outlined">{props.icon}</span>}
            {props.icon && iconStyle === "line" && <span className={`icon las ${props.icon}`} />}
            {props.icon && iconStyle === "fa" && <span className={`icon fas ${props.icon}`} />}
            {props.label && <span className={`label ${props.icon ? "label-margin" : ""}`}>{props.label}</span>}
        </button>
    );
}

export default Button;