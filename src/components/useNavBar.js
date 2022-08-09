import fileDialog from "file-dialog";
import { CURRENT_DOCUMENT_VERSION } from "../global";
import DocumentHelper from "../helpers/DocumentHelper";
import updateDocument from "../logic/updateDocument";
import { useDocumentContext } from "../logic/useDocumentContext";

const useNavBar = () => {
    const { document, setDocument } = useDocumentContext();

    /**
     * Loads a Leaflys document as the document for the editor.
     */
    function openDocument () {
        fileDialog().then(file => {
            const reader = new FileReader();
            reader.readAsText(file[0]);
            reader.onload = e => {
                const txt = e.target.result;
                const newDocument = JSON.parse(txt);
                updateDocument(newDocument);
                setDocument(newDocument);
                
                console.info("[DEBUG] Loaded new document:");
                console.info(newDocument);
            };
        });
    }

    /**
     * Saves the current Leaflys document as a JSON file.
     */
    function saveDocument () {
        const json = JSON.stringify(document, null, 4);
        DocumentHelper.saveAsFile(`leaflys-document.json`, DocumentHelper.formatGeojsonCoords(json));
    }

    return {
        openDocument,
        saveDocument,
    };
}

export default useNavBar;