import fileDialog from "file-dialog";
import Helpers from "../logic/Helpers";
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
                setDocument(newDocument);
                console.log("Loaded new document:");
                console.log(newDocument);
            };
        });
    }

    /**
     * Saves the current Leaflys document as a JSON file.
     */
    function saveDocument () {
        const json = JSON.stringify(document, null, 4);
        Helpers.saveAsFile(`leaflys-document.json`, Helpers.formatGeojsonCoords(json));
    }

    return {
        openDocument,
        saveDocument,
    };
}

export default useNavBar;