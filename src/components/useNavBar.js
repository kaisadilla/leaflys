import Helpers from "../logic/Helpers";
import { useDocumentContext } from "../logic/useDocumentContext";

const useNavBar = () => {
    const { document } = useDocumentContext();

    /**
     * Saves the current Leaflys document as a JSON file.
     */
    function saveDocument () {
        const json = JSON.stringify(document, null, 4);
        Helpers.saveAsFile(`leaflys-document.json`, Helpers.formatGeojsonCoords(json));
    }

    return {
        saveDocument,
    };
}

export default useNavBar;