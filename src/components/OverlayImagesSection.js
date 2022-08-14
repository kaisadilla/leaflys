import React from 'react';
import fileDialog from "file-dialog";
import { Buffer } from "buffer";
import CollapsableBlock from '../elements/CollapsableBlock';
import Button from '../elements/Button';
import OverlayImagePanel from './OverlayImagePanel';
import { useDocumentContext } from '../logic/useDocumentContext';

function OverlayImagesSection () {
    const {
        layoutImages,
        addLayoutImage,
    } = useDocumentContext();

    const $layoutImages = layoutImages.map((img, i) => {
        return <OverlayImagePanel key={i} imageIndex={i} />
    });

    return (
        <CollapsableBlock className="collapsable-section" header={`Overlay images (${layoutImages.length})`}>
            {$layoutImages}
            <div className="control-collection align-right" style={{width: "100%"}}>
                <Button baseStyle="success" icon="add" onClick={loadLayoutImage}/>
            </div>
        </CollapsableBlock>
    );

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
}

export default OverlayImagesSection;