import { useDocumentContext } from "../logic/useDocumentContext";

const useEditorControlPanel = () => {
    const { document } = useDocumentContext();

    /**
     * Returns an array containing all the different categories
     * used inside the document, ordered alphabetically.
     */
    function getPolygonCategories () {
        // create a set with all the different categories used in the document.
        const setCats = new Set();
        for (const p of document.features.polygons) {
            setCats.add(p.properties.category);
        }

        // sort them alphabetically.
        return [...setCats].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
    }

    return {
        getPolygonCategories,
    }
}

export default useEditorControlPanel;