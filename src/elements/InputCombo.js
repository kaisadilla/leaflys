import React from 'react';

/**
 * Valid props:
 ** className — additional css classes for the textbox.
 */
function InputCombo (props) {
    const customClass = props.className ? props.className : "";

    return (
        <div className={`input-combo ${customClass}`}>
            {props.children}
        </div>
    );
}

export default InputCombo;