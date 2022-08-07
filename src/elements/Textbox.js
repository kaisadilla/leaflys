import React from 'react';

/**
 * Valid props:
 ** id — The id of the textbox.
 ** value — The content of the textbox.
 ** className — additional css classes for the textbox.
 ** onChange — the "onChange" event.
 ** size [small | normal | big] — the size of the button's content.
 */
function Textbox (props) {
    const baseSize = `size-${props.size ? props.size : "normal"}`;
    const customClass = props.className ? props.className : "";

    return (
        <input
            className={`default-textbox ${baseSize} ${customClass}`}
            type="textbox"
            id={props.id}
            value={props.value}
            onChange={props.onChange}
        />
    );
}

export default Textbox;