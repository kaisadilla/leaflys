import { CURRENT_DOCUMENT_VERSION } from "../global";

/**
 * Updates the necessary data in a document to make sure it's fit for
 * the current version of the program.
 * @param document A document object to update.
 */
function updateDocument (document) {
    const docVersion = document.version ?? 1;

    /* Each update must be applied after the previous one. For example,
    the updates to the version 2 should be applied first to any version
    before 2, then the updates to version 3 should be applied to any document
    whose version is lower than 3, and so on.
    */
    if (docVersion < 2) {
        _update2(document);
    }

    if (!document.version || document.version < CURRENT_DOCUMENT_VERSION) {
        document.version = CURRENT_DOCUMENT_VERSION;
    }

    return document;
}

function _update2 (document) {
    // change disabled for enabled.
    for (const p of document.features.polygons) {
        const disabled = p.properties.leaflys.disabled ?? false;
        p.properties.leaflys.enabled = !disabled;
        delete p.properties.leaflys.disabled;
    }
}

export default updateDocument;