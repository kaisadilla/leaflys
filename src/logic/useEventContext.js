import { createContext, useContext, useMemo, useState } from "react";
import { ToLeaflet } from "../util/TurfLeafletConversion";

const EventContext = createContext(null);
export const useEventContext = () => useContext(EventContext);

export const EventContextProvider = ({ children }) => {
    const [state, setState] = useState({
        leftClick: false,
        shift: false,
        ctrl: false,
        z: false,
    });

    const value = useMemo(() => {
        const setMouseLeftPressed = pressed => setState({
            ...state,
            leftClick: pressed,
        });
        const setShiftPressed = pressed => setState({
            ...state,
            shift: pressed,
        });
        const setCtrlPressed = pressed => setState({
            ...state,
            ctrl: pressed,
        });
        const setZPressed = pressed => setState({
            ...state,
            z: pressed,
        });

        return {
            keys: state,
            setMouseLeftPressed,
            setShiftPressed,
            setCtrlPressed,
            setZPressed,
        }
    }, [state]);

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};