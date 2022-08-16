import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_MARKER_SIZE, DEFAULT_PENCIL_STEP, DEFAULT_SNAP_DISTANCE, DEFAULT_ZOOM, EDITOR_MODES } from "../global";
import { ToLeaflet } from "../util/TurfLeafletConversion";

/**
 * Returns an object containing the necessary data to edit a feature.
 */
function getEditedFeatureObject (feature) {
    return {
        name: feature.properties.name,
        category: feature.properties.category,
        id: feature.id,
        /** used to identify the feature in the document even if the user edits its id. */
        originalId: feature.id,
        polygons: ToLeaflet.polygon(feature),
    };
}

const UIContext = createContext(null);
export const useUIContext = () => useContext(UIContext);

export const UIContextProvider = ({ children }) => {
    const [state, setState] = useState({
        editorMode: EDITOR_MODES.mapEditor,
        editedFeatureIndex: null,
        /** The index of the subpolygon inside the multipolygon feature */
        editedFeatureSubpolygonIndex: null,
        editedFeature: null,
        editor: {
            selectedTool: null,
            selectedToolMode: null,
            snap: true,
            showForeignFeatures: true,
            snapDistance: DEFAULT_SNAP_DISTANCE,
            markerSize: DEFAULT_MARKER_SIZE,
            pencilStep: DEFAULT_PENCIL_STEP,
            optimizeGraphics: true,
        },
        mapData: {
            zoom: DEFAULT_ZOOM,
        },
        deleteTool: {
            vertexArray: [],
            direction: true,
        },
        flags: {
            editorUpdate: false,
        }
    });

    const value = useMemo(() => {
        const setEditorMode = mode => setState({
            ...state,
            editorMode: mode,
        });

        const setEditedFeatureIndex = (index, feature) => {
            if (index === null) {
                setState({
                    ...state,
                    editedFeatureIndex: index,
                    editor: {
                        ...state.editor,
                        selectedTool: null,
                    }
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
                        selectedToolMode: null,
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

        const setEditedFeature = feature => {
            setState(prevState => {
                return {
                    ...prevState,
                    editedFeature: feature,
                }
            });
        }
        
        const setEditedFeatureAndSubindex = (feature, subindex) => {
            setState({
                ...state,
                editedFeature: feature,
                editedFeatureSubpolygonIndex: subindex,
            });
        };

        const setEditedFeatureGeometry = (geojsonFeature) => {
            setState({
                ...state,
                editedFeatureIndex: state.editedFeatureIndex,
                editedFeatureSubpolygonIndex: 0,
                editedFeature: {
                    ...state.editedFeature,
                    polygons: ToLeaflet.polygon(geojsonFeature),
                },
                flags: {
                    ...state.flags,
                    editorUpdate: !state.flags.editorUpdate,
                }
            });
        }

        const setEditorSelectedTool = tool => {
            setState(prevState => {
                return {
                    ...prevState,
                    editor: {
                        ...prevState.editor,
                        selectedTool: tool,
                    }
                };
            });
        };

        const setEditorSelectedToolMode = mode => {
            setState(prevState => {
                return {
                    ...prevState,
                    editor: {
                        ...prevState.editor,
                        selectedToolMode: mode,
                    }
                };
            });
        };

        const setEditorSnap = active => setState({
            ...state,
            editor: {
                ...state.editor,
                snap: active,
            }
        });

        const setEditorShowForeignFeatures = active => setState({
            ...state,
            editor: {
                ...state.editor,
                showForeignFeatures: active,
            }
        });

        const setEditorSnapDistance = distance => setState({
            ...state,
            editor: {
                ...state.editor,
                snapDistance: distance,
            }
        });

        const setEditorMarkerSize = size => setState({
            ...state,
            editor: {
                ...state.editor,
                markerSize: size,
            }
        });

        const setEditorPencilStep = distance => setState({
            ...state,
            editor: {
                ...state.editor,
                pencilStep: distance,
            }
        });

        const setEditorOptimizeGraphics = optimize => setState({
            ...state,
            editor: {
                ...state.editor,
                optimizeGraphics: optimize,
            }
        });

        const setDeleteToolVertexArray = array => {
            setState(prevState => {
                return {
                    ...prevState,
                    deleteTool: {
                        ...prevState.deleteTool,
                        vertexArray: array,
                    }
                }
            });
        };

        const setDeleteToolDirection = direction => {
            setState(prevState => {
                return {
                    ...prevState,
                    deleteTool: {
                        ...prevState.deleteTool,
                        direction: direction,
                    }
                }
            });
        };

        const setMapDataZoom = zoom => {
            setState(prevState => {
                return {
                    ...prevState,
                    mapData: {
                        ...prevState.mapData,
                        zoom: zoom
                    }
                };
            });
        }

        return {
            ...state,
            setEditorMode,
            setEditedFeatureIndex,
            setEditedFeatureSubpolygonIndex,
            setEditedFeature,
            setEditedFeatureAndSubindex,
            setEditedFeatureGeometry,
            setEditorSelectedTool,
            setEditorSelectedToolMode,
            setEditorSnap,
            setEditorShowForeignFeatures,
            setEditorOptimizeGraphics,
            setEditorSnapDistance,
            setEditorMarkerSize,
            setEditorPencilStep,
            setDeleteToolVertexArray,
            setDeleteToolDirection,
            setMapDataZoom,
        }
    }, [state]);

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
};