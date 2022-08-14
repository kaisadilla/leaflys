import React, { useEffect, useState } from 'react';
import { useEventContext } from '../logic/useEventContext';

function Input () {    
    const {
        setMouseLeftPressed,
        setShiftPressed,
        setCtrlPressed,
        setZPressed,
    } = useEventContext();

    const [listenersAdded, setListenersAdded] = useState(false);
    
    useEffect(() => {
        if (!listenersAdded) {
            window.addEventListener("keydown", e => {
                if (!e.repeat) {
                    if      (e.key === "Shift")   setShiftPressed(true);
                    else if (e.key === "Control") setCtrlPressed(true);
                    else if (e.key === "z")       setZPressed(true);
                }
            });
            window.addEventListener("keyup", e => {
                if      (e.key === "Shift")   setShiftPressed(false);
                else if (e.key === "Control") setCtrlPressed(false);
                else if (e.key === "z")       setZPressed(false);
            });
            //window.addEventListener("mousedown", e => {
            //    if (e.buttons === 1) setMouseLeftPressed(true);
            //});
            //window.addEventListener("mouseup", e => {
            //    if (e.buttons === 1) setMouseLeftPressed(false);
            //});

            setListenersAdded(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listenersAdded]);

    return (
        <></>
    );
}

export default Input;