import { useLayoutEffect, useState } from "react";
import { useDocumentContext } from "../../logic/useDocumentContext";

const useDocumentControlPanel = () => {
    const {
        document,
        isCategoryEnabled,
    } = useDocumentContext();

    const [isPolygonSectionEnabled, setPolygonSectionEnabled] = useState(true);
    const [isPolygonCategoryEnabled, setPolygonCategoryEnabled] = useState({});

    useLayoutEffect(() => {
        setPolygonSectionEnabled(() => isCategoryEnabled("polygons", null));

        const enabledCats = {};
        for (const c of getPolygonCategories()) {
            enabledCats[c] = isCategoryEnabled("polygons", c);
        }
        
        setPolygonCategoryEnabled(enabledCats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document.features.polygons]);

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
        isPolygonSectionEnabled,
        isPolygonCategoryEnabled,
        getPolygonCategories,
    }
}

export default useDocumentControlPanel;