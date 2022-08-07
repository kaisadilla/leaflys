import React from 'react';

/**
 * Valid props:
 ** id — The id of the textbox.
 ** label — The label of the textbox.
 ** checked {bool} — whether the checkbox is checked or not.
 ** onChange — the "onChange" event.
 ** highlight — if true, highlights the label of the checkbox if it's checked.
 ** className — additional css classes for the div containing the checbkox.
 */
function Checkbox (props) {
    const customClass = props.className ? props.className : "";
    const highlight = props.highlight && props.checked ? "highlight" : "";

    return (
        <div className={`default-checkbox ${customClass}`}>
            <input className="default-checkbox-control" type="checkbox" id={props.id} checked={props.checked} onChange={props.onChange} />
            <label className={`default-checkbox-legend ${highlight}`} htmlFor={props.id}>{props.label}</label>
        </div>
    );
}

export default Checkbox;