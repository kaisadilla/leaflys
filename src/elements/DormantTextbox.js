import React, { useState } from 'react';

/**
 * Valid props:
 ** value — the value of the textbox.
 ** onEnable [function()] — a function called when the textbox is enabled.
 ** onDisable [function()] — a function called when the textbox is disabled.
 ** onChange [function(e)] — a function called when the textbox value is changed.
 ** className — additional css classes for the textbox.
 */
function DormantTextbox (props) {
    const customClass = props.className ? props.className : "";
    const [value, setValue] = useState(props.value);
    const [enabled, setEnabled] = useState(false);

    function enable () {
        if (!enabled) {
            setEnabled(true);
            if (props.onEnable) props.onEnable();
        }
    }
    function disable () {
        if (enabled) {
            setEnabled(false);
            if (props.onDisable) props.onDisable();
        }
    }
    function changeValue (e) {
        if (enabled) {
            setValue(e.target.value);
            if (props.onChange) props.onChange(e);
        }
    }

    return (
        <input
            type="text"
            className={`dormant-textbox ${customClass} ${enabled ? "enabled" : ""}`}
            value={value}
            onChange={changeValue}
            onDoubleClick={enable}
            onBlur={disable}
        />
    );
}

export default DormantTextbox;