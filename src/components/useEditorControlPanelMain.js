import { useLayoutEffect, useState } from "react";
import fileDialog from "file-dialog";
import { Buffer } from "buffer";
import { useDocumentContext } from "../logic/useDocumentContext";

const useEditorControlPanel = () => {
    const {
        document,
        isCategoryEnabled,
        addLayoutImage,
    } = useDocumentContext();

    const [isPolygonSectionEnabled, setPolygonSectionEnabled] = useState(true);
    const [isPolygonCategoryEnabled, setPolygonCategoryEnabled] = useState([]);

    useLayoutEffect(() => {
        setPolygonSectionEnabled(() => isCategoryEnabled("polygons", null));
        
        const enabledCats = getPolygonCategories().map(c => {
            return isCategoryEnabled("polygons", c);
        });
        setPolygonCategoryEnabled(enabledCats);
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

    /**
     * Loads a Leaflys document as the document for the editor.
     */
    function loadLayoutImage () {
        fileDialog().then(file => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file[0]);
            reader.onload = e => {
                const img64 = Buffer.from(e.target.result, "binary").toString("base64");
                addLayoutImage(file[0].name, img64);
                console.info(`[DEBUG] Loaded new layout image! (${file[0].name}, length: ${img64.length})`);
            };
        });
    }

    return {
        isPolygonSectionEnabled,
        isPolygonCategoryEnabled,
        getPolygonCategories,
        loadLayoutImage,
    }
}

export default useEditorControlPanel;