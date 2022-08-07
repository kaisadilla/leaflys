import { createContext, useContext, useMemo, useState } from "react";
import { Turflet } from "./Turflet";

export const EDITOR_MODES = {
    mapEditor: 0,
    spreadsheet: 1,
}

export const EDITOR_MODES_NAMES = {
    [EDITOR_MODES.mapEditor]: "Map editor",
    [EDITOR_MODES.spreadsheet]: "Spreadsheet",
}

export const POLYGON_EDITOR_TOOLS = {
    draw: 0,
    edit: 1,
    cut: 2,
    eraser: 3,
    move: 4,
}

export const POLYGON_EDITOR_TOOL_MODES = {
    place: 0,
    draw: 1,
    snap: 2,
}

/**
 * Returns an object containing the necessary data to edit a feature.
 */
function getEditedFeatureObject (feature) {
    return {
        name: feature.properties.name,
        category: feature.properties.category,
        id: feature.id,
        polygons: Turflet.polygon.geojsonToLeaflet(feature),
    };
}

const UIContext = createContext(null);
export const useUIContext = () => useContext(UIContext);

export const UIContextProvider = ({ children }) => {
    const [state, setState] = useState({
        specialKeys: {
            ctrl: false,
        },
        editorMode: EDITOR_MODES.mapEditor,
        editedFeatureIndex: null,
        /** The index of the subpolygon inside the multipolygon feature */
        editedFeatureSubpolygonIndex: null,
        editedFeature: null,
        editor: {
            selectedTool: null,
            selectedToolMode: null,
        }
    });

    const value = useMemo(() => {
        const setCtrlPressed = pressed => setState({
            ...state,
            specialKeys: {
                ...state.specialKeys,
                ctrl: pressed,
            }
        })

        const setEditorMode = mode => setState({
            ...state,
            editorMode: mode,
        });

        const setEditedFeatureIndex = (index, feature) => {
            if (index === null) {
                setState({
                    ...state,
                    editedFeatureIndex: index,
                });
            }
            else {
                setState({
                    ...state,
                    editedFeatureIndex: index,
                    editedFeatureSubpolygonIndex: 0,
                    editedFeature: getEditedFeatureObject(feature),
                    editor: {
                        ...state.editor,
                        selectedTool: null,
                        selectedToolMode: POLYGON_EDITOR_TOOL_MODES.draw,
                    }
                });
            }
            //console.log("[DEBUG] Info for edition: ");
            //console.log(state);
        }

        const setEditedFeatureSubpolygonIndex = index => setState({
            ...state,
            editedFeatureSubpolygonIndex: index,
        });
        
        const setEditedFeature = feature => setState({
            ...state,
            editedFeature: feature,
        });

        const setEditorSelectedTool = tool => setState({
            ...state,
            editor: {
                ...state.editor,
                selectedTool: tool,
            }
        });

        const setEditorSelectedToolMode = mode => setState({
            ...state,
            editor: {
                ...state.editor,
                selectedToolMode: mode,
            }
        });

        return {
            ...state,
            setCtrlPressed,
            setEditorMode,
            setEditedFeatureIndex,
            setEditedFeatureSubpolygonIndex,
            setEditedFeature,
            setEditorSelectedTool,
            setEditorSelectedToolMode,
        }
    }, [state]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};