import React from 'react';

/**
 * Valid props:
 ** min — the minimum value for the slider.
 ** max — the maximum value for the slider.
 ** value — the initial value of the slider.
 ** onChange — the effect of the slider when its value changes.
 ** id — the id of the input element.
 ** className — the class(es) of the button.
 */
function Slider (props) {
    const customClass = props.className ? props.className : "";

    return (
        <div className={`default-slider ${customClass}`} >
            <input id={props.id} className="default-slider-control" type="range" min={props.min} max={props.max}
                value={props.value}
                onChange={props.onChange}
            />
            <span className="default-slider-value">{props.value}</span>
        </div>
    );
}

export default Slider;