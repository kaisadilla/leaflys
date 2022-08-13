import { createContext, useContext, useMemo, useState } from "react";
import DocumentHelper from "../helpers/DocumentHelper";

const DocumentContext = createContext(null);
export const useDocumentContext = () => useContext(DocumentContext);

export const DocumentContextProvider = ({ children }) => {
    const [state, setState] = useState({
        document: _getInitialDocument(),
        layoutImages: [],
        /**
         * useEffect statements can subscribe to this flag to update when the document
         * is substantially changed (e.g. when loading a new document). */
        forceReloadFlag: false,
        forceRedrawFlag: false,
    });

    const value = useMemo(() => {
        /**
         * Sets the document object for the context, overriding the previous one.
         * @param {*} document The document object.
         */
        const setDocument = document => {
            setState({
                ...state,
                document,
                forceReloadFlag: !state.forceReloadFlag,
                forceRedrawFlag: !state.forceRedrawFlag,
            });
        }

        const addLayoutImage = (fileName, imgBase64) => {
            const layoutImages = [
                ...state.layoutImages,
                DocumentHelper.getNew.layoutImage(fileName, imgBase64),
            ];
            setState({
                ...state,
                layoutImages,
            });
        }

        /**
         * Replaces the polygon at the index given with the one given.
         * @param {*} index The index of the polygon in the document's polygon array.
         * @param {*} polygon Ab oject containing a polygon (or multipolygon).
         */
        const updateLayoutImageAt = (index, layoutImage) => {
            const layoutImages = [...state.layoutImages];
            layoutImages.splice(index, 1, layoutImage);

            setState({
                ...state,
                layoutImages,
            });
        };

        const removeLayoutImageAt = index => {
            const layoutImages = [...state.layoutImages];
            layoutImages.splice(index, 1);
            setState({
                ...state,
                layoutImages,
            });
        }

        /**
         * Creates a new polygon with the info given, and adds it to the polygon array.
         * @param {*} name The name for the polygon.
         * @param {*} category The category for the polygon.
         * @param {*} id The id of the polygon.
         */
        const addNewPolygon = (name, category, id) => {
            const newFeature = DocumentHelper.getNew.polygon(name, category, id);
            const newState = structuredClone(state);
            newState.document.features.polygons.push(newFeature);

            setState({
                ...newState,
                forceReloadFlag: !state.forceReloadFlag,
            });
        };

        /**
         * Replaces the polygon at the index given with the one given.
         * @param {*} index The index of the polygon in the document's polygon array.
         * @param {*} polygon Ab oject containing a polygon (or multipolygon).
         */
        const updatePolygon = (id, polygon) => {
            const newState = structuredClone(state);
            const index = newState.document.features.polygons.findIndex(p => p.id === id);
            newState.document.features.polygons[index] = polygon;

            setState({
                ...newState,
                forceReloadFlag: !state.forceReloadFlag,
            });
        };

        /**
         * Deletes the polygon at the index given.
         * @param {*} index The index of the polygon in the document's polygon array.
         */
        const deletePolygon = (id) => {
            const newState = structuredClone(state);
            const index = newState.document.features.polygons.findIndex(p => p.id === id);
            newState.document.features.polygons.splice(index, 1);

            setState({
                ...newState,
                forceReloadFlag: !state.forceReloadFlag,
            });
        };

        const getPolygonById = (id) => {
            return state.document.features.polygons.find(p => p.id === id);
        }

        /**
         * Returns true only if all features in a section is enabled.
         * If "null" is passed as section, all features in the document will be counted.
         * @param {*} type The type of feature to check.
         * @param {*} section The section of the features. If this equals "null",
         * all section will be counted as one.
         */
        const isCategoryEnabled = (type, section) => {
            let features = state.document.features[type];
            // if a category is given, only count features from that section.
            if (section) {
                features = features.filter(f => {
                    return f.properties.category === section;
                });
            }

            const enabledCount = features.filter(f => {
                return f.properties.leaflys?.enabled ?? true;
            }).length;

            return enabledCount === features.length;
        }

        /**
         * Sets all features of a type in a section as enabled or disabled.
         * @param {*} type The type of feature.
         * @param {*} section The section for the feature. Use "null" to
         * enable or disable ALL features regardless of their section.
         * @param {*} enabled True if enabled, false if enabled.
         */
        const setCategoryEnabled = (type, section, enabled) => {
            const newState = structuredClone(state);

            for (const f of newState.document.features[type]) {
                if (!section || f.properties.category === section) {
                    f.properties.leaflys.enabled = enabled;
                }
            }

            setState({
                ...newState,
                forceReloadFlag: !state.forceReloadFlag
            });
        }

        return {
            ...state,
            setDocument,
            addLayoutImage,
            updateLayoutImageAt,
            removeLayoutImageAt,
            addNewPolygon,
            updatePolygon,
            deletePolygon,
            getPolygonById,
            isCategoryEnabled,
            setCategoryEnabled,
        }
    }, [state]);

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    )
};

/**
 * Returns a document in the local storage if there's any,
 * or a sample document if there isn't.
 */
function _getInitialDocument () {
    // TODO: Read local storage.
    return DocumentHelper.getTemplate.document();
}

/**
 * Returns the position in the array of the feature with the given id.
 * @param {*} featureArray An array of features.
 * @param {*} id The id of the feature.
 * @deprecated almost instantly
 */
function _findFeatureById (featureArray, id) {
    //return featureArray.some((p, i) => {
    //    return p.id === id ? i : false;
    //})
}