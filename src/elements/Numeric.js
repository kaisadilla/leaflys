import React, { useState } from 'react';
import { MathHelper } from '../helpers/MathHelper';

/**
 * Valid props:
 ** value — the value of the numeric.
 ** max — the maximum value.
 ** min — the minimum value.
 ** step — the step of the control.
 ** placeholder — a text to show when the control is empty.
 ** readonly — makes the control readonly.
 ** className — additional css classes for the textbox.
 */
function Numeric (props) {
    const baseSize = `size-${props.size ? props.size : "normal"}`;
    const idName = props.id ?? "";
    const className = props.className ?? "";

    const [displayText, setDisplayText] = useState(props.value);

    const evt_onChange = (evt) => {
        let val = evt.target.value;

        if (val === "-") {
            props.onChange(0);
            setDisplayText(val);
        }
        else if (val === "") {
            props.onChange(0);
            setDisplayText(val);
        }
        else if (val === "-.") {
            props.onChange(0);
            setDisplayText(val);
        }
        else if (isNaN(val)) {
            const onlyNumbers = val.replace(/[\D]/g, '');
            props.onChange(onlyNumbers);
            setDisplayText(onlyNumbers);
        }
        else {
            const rawVal = val;
            const truncatedVal = MathHelper.truncate(val, props.decimalPlaces);
            const clampedVal = MathHelper.clamp(val, props.min, props.max);
            props.onChange(clampedVal);
            setDisplayText(truncatedVal === clampedVal ? rawVal : clampedVal);
        }
    };

    const evt_onBlur = (evt) => {
        let val = isNaN(evt.target.value) ? 0 : evt.target.value;
        val = MathHelper.truncate(val, props.decimalPlaces);
        props.onChange(MathHelper.clamp(val, props.min, props.max));
    }

    return (
        <input
            type="textbox"
            id={idName}
            className={`default-numeric no-arrows ${baseSize} ${className}`}
            value={displayText ?? null}
            onChange={evt_onChange}
            onBlur={evt_onBlur}
            min={props.min ?? null}
            max={props.max ?? null}
            placeholder={props.placeholder ?? null}
            readonly={props.readonly}
        />
    );
}

export default Numeric;