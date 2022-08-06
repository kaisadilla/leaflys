import React from 'react';

/**
 * Valid props:
 ** iconStyle — [**g** | g-round | g-outline | line | fa] — The library that contains the icon.
 */
function Icon (props) {
    const iconStyle = props.iconStyle ? props.iconStyle : "g";

    return (
        <>
            {props.icon && iconStyle === "g" && <span className="icon material-icons"></span>}
            {props.icon && iconStyle === "g-round" && <span className="icon material-icons-round">{props.icon}</span>}
            {props.icon && iconStyle === "g-outline" && <span className="icon material-icons-outlined">{props.icon}</span>}
            {props.icon && iconStyle === "line" && <span className={`icon las ${props.icon}`} />}
            {props.icon && iconStyle === "fa" && <span className={`icon fas ${props.icon}`} />}
            {props.label && <span className={`label ${props.icon ? "label-margin" : ""}`}>{props.label}</span>}
        </>
    );
}

export default Icon;