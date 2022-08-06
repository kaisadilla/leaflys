import React from 'react';

/**
 * Valid props:
 ** id — The id of the switch.
 ** checked {bool} — whether the switch is checked or not.
 ** onChange — the "onChange" event.
 ** className — additional css classes for the div containing the checbkox.
 */
function Switch (props) {
    const customClass = props.className ? props.className : "";

    return (
        <label className={`default-switch ${customClass}`}>
            <input type="checkbox" className="switch-checkbox" checked={props.checked} onChange={props.onChange} />
            <span className="switch-slider" />
        </label>
    );
}

export default Switch;