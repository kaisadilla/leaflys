import React from 'react';

/**
 * Valid props:
 ** className — the class(es) of the button
 ** onClick — The effect of the button on click
 ** label — The text of the button
 ** icon — The icon of the button
 ** description — A legend to show on hover
 */
function SpanButton (props) {
    const materialIconsName = props.iconStyle === 0 ? "material-icons"
                                                    : "material-icons-outlined";
    const extraClass = props.className ? props.className : "";

    return (
        <div className={`span-button ${extraClass}`} onClick={props.onClick}>
        {props.icon && <span className={`icon ${materialIconsName}`}>{props.icon}</span>}
        {props.label && <span className={`label ${props.iconName ? "label-margin" : ""}`}>{props.label}</span>}
        </div>
    );
}

export default SpanButton;