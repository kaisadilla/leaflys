import React from 'react';
import { MathHelper } from '../helpers/MathHelper';
import InputCombo from './InputCombo';
import Numeric from './Numeric';

/**
 * Valid props:
 ** value — the value of the numeric.
 ** setValue — the function that sets the value of the numeric.
 ** max — the maximum value.
 ** min — the minimum value.
 ** className — additional css classes for the textbox.
 */
function DraggableNumeric (props) {
    const className = props.className ?? "";
    /** the amount added to the value for each 100 px traveled by the mouse. */
    let dragPerPixel = props.dragPerHundred;
    if (dragPerPixel !== undefined) {
        dragPerPixel = dragPerPixel / 100;
    }
    else {
        if (props.min && props.max) {
            // 500 pixels to go from min to max.
            dragPerPixel = (props.max - props.min) / 500;
        }
        else {
            dragPerPixel = 1;
        }
    }

    // TODO: Dragging won't update the displayed number, because numeric does
    // not necessarily send the same number it is displaying (because it has)
    // to manage valid values that aren't numbers such as "-" or "."
    const evt_mouseDown = (evt) => {
        const startingX = evt.screenX;
        const startingValue = props.value;

        function onMouseMove (evt) {
            const currentX = evt.screenX;
            const pxDistance = currentX - startingX;

            let value = startingValue + (pxDistance * dragPerPixel);
            value = MathHelper.truncate(value, props.decimalPlaces);
            props.setValue(MathHelper.clamp(value, props.min, props.max));
        }

        function onMouseUp () {
            document.removeEventListener("mouseup", onMouseUp, 1);
            document.removeEventListener("mousemove", onMouseMove, 1);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }

        document.addEventListener("mouseup", onMouseUp, 1);
        document.addEventListener("mousemove", onMouseMove, 1);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";
    }

    return (
        <InputCombo className={`draggable-number ${className}`}>
            <label
                htmlFor={props.id}
                className="draggable-number-label"
                onMouseDown={evt_mouseDown}
            >
                {props.label}
            </label>
            <Numeric
                id={props.id}
                className="draggable-number-input"
                value={props.value ?? 0}
                onChange={props.setValue}
                min={props.min}
                max={props.max}
                decimalPlaces={props.decimalPlaces}
            />
        </InputCombo>
    );
}

export default DraggableNumeric;