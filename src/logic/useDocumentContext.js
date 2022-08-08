import { createContext, useContext, useMemo, useState } from "react";
import DocumentHelper from "../helpers/DocumentHelper";

const DocumentContext = createContext(null);
export const useDocumentContext = () => useContext(DocumentContext);

export const DocumentContextProvider = ({ children }) => {
    const [state, setState] = useState({
        document: getInitialDocument(),
        /**
         * useEffect statements can subscribe to this flag to update when the document
         * is substantially changed (e.g. when loading a new document). */
        forceReloadFlag: false,
    });

    const value = useMemo(() => {
        /**
         * Sets the document object for the context, overriding the previous one.
         * @param {*} document The document object.
         */
        const setDocument = document => {
            setState({
                ...state,
                document: document,
                forceReloadFlag: !state.forceReloadFlag,
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
            const newState = { ...state };
            newState.document.features.polygons.push(newFeature);

            setState(newState);
        }
        /**
         * Replaces the polygon at the index given with the one given.
         * @param {*} index The index of the polygon in the document's polygon array.
         * @param {*} polygon Ab oject containing a polygon (or multipolygon).
         */
        const replacePolygonAt = (index, polygon) => {
            const newState = { ...state }
            newState.document.features.polygons[index] = polygon;

            setState(newState);
        }

        return {
            ...state,
            setDocument,
            addNewPolygon,
            replacePolygonAt
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
function getInitialDocument () {
    // TODO: Read local storage.
    return DocumentHelper.getTemplate.document();
}