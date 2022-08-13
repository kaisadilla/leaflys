import React, { useState } from 'react';
import Button from '../elements/Button';
import CollapsableBlock from '../elements/CollapsableBlock';
import Switch from '../elements/Switch';
import { useDocumentContext } from '../logic/useDocumentContext';
import NewPolygonDialog from './dialogs/NewPolygonDialog';
import FeatureCollection from './FeatureCollection';
import OverlayImagePanel from './OverlayImagePanel';
import useEditorControlPanel from './useEditorControlPanelMain';

function EditorControlPanelMain (props) {
    const [dialogNewPolygon, setDialogNewPolygon] = useState(false);

    const {
        isPolygonSectionEnabled,
        isPolygonCategoryEnabled,
        getPolygonCategories,
        loadLayoutImage,
    } = useEditorControlPanel();

    const {
        setCategoryEnabled,
        layoutImages,
    } = useDocumentContext();

    const polygonCategories = getPolygonCategories();

    const $polygonCollections = polygonCategories.map(cat => (
        <React.Fragment key={cat}>
            <h2 className="toggle-header control-panel-header">
                <Switch
                    id={`enable-${cat.replace(" ", "-")}`}
                    checked={isPolygonCategoryEnabled[cat]}
                    onChange={evt => setCategoryEnabled("polygons", cat, evt.target.checked)}
                />
                <span>{cat}</span>
            </h2>
            <FeatureCollection typeFilter={["Polygon", "MultiPolygon"]} categoryFilter={[cat]} addButton />
        </React.Fragment>
    ));

    const $layoutImages = layoutImages.map((img, i) => {
        return <OverlayImagePanel key={i} imageIndex={i} />
    });

    return (
        <>
            <div className="editor-control-panel">
                <div className="control-panel">
                    <h1 className="control-panel-header">Document</h1>
                    <CollapsableBlock className="collapsable-section" header={`Overlay images (${layoutImages.length})`}>
                        {$layoutImages}
                        <div className="control-collection align-right" style={{width: "100%"}}>
                            <Button baseStyle="success" icon="add" onClick={loadLayoutImage}/>
                        </div>
                    </CollapsableBlock>
                    <h1 className="collection-section control-panel-header">
                        <div className="left">
                            <Switch
                                id="enable-all"
                                checked={isPolygonSectionEnabled}
                                onChange={e => setCategoryEnabled("polygons", null, e.target.checked)}
                            />
                        </div>
                        <div className="center">
                            <span>Polygons</span>
                        </div>
                        <div className="right">
                            <div className="control-panel-button-collection">
                                <Button baseStyle="clear" label="Export section" />
                                <Button baseStyle="success" icon="add" onClick={() => setDialogNewPolygon(true)} />
                            </div>
                        </div>
                    </h1>
                    {$polygonCollections}
                </div>
            </div>
            <NewPolygonDialog
                isOpen={dialogNewPolygon}
                close={() => setDialogNewPolygon(false)}
            />
        </>
    );
}

export default EditorControlPanelMain;