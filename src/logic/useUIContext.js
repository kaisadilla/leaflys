import { createContext, useContext, useMemo, useState } from "react";

export const EDITOR_MODES = {
    mapEditor: 0,
    spreadsheet: 1,
}

export const EDITOR_MODES_NAMES = {
    [EDITOR_MODES.mapEditor]: "Map editor",
    [EDITOR_MODES.spreadsheet]: "Spreadsheet",
}

const UIContext = createContext(null);
export const useUIContext = () => useContext(UIContext);

export const UIContextProvider = ({ children }) => {
    const [state, setState] = useState({
        editorMode: EDITOR_MODES.mapEditor,
    });

    const value = useMemo(() => {
        const setEditorMode = mode => setState({
            ...state,
            editorMode: mode,
        });

        return {
            ...state,
            setEditorMode,
        }
    }, [state]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}