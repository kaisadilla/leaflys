import { createContext, useContext, useMemo, useState } from "react";
import Helpers from "./Helpers";

const DocumentContext = createContext(null);
export const useDocumentContext = () => useContext(DocumentContext);

export const DocumentContextProvider = ({ children }) => {
    const [state, setState] = useState({
        document: getInitialDocument(),
    });

    const value = useMemo(() => {
        const addNewPolygon = (name, category, id) => {
            const newFeature = Helpers.getNew.polygon(name, category, id);
            const newState = { ...state };
            newState.document.features.polygons.push(newFeature);

            setState(newState);
        }

        return {
            ...state,
            addNewPolygon,
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
    return Helpers.getTemplate.document();
}