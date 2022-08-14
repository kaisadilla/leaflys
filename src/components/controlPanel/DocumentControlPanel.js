import React, { useState } from 'react';
import Button from '../../elements/Button';
import Switch from '../../elements/Switch';
import { useDocumentContext } from '../../logic/useDocumentContext';
import NewPolygonDialog from '../dialogs/NewPolygonDialog';
import FeatureCollection from '../FeatureCollection';
import OverlayImagesSection from '../OverlayImagesSection';
import useDocumentControlPanel from './useDocumentControlPanel';

function DocumentControlPanel () {
    const [dialogNewPolygon, setDialogNewPolygon] = useState(false);

    const {
        isPolygonSectionEnabled,
        isPolygonCategoryEnabled,
        getPolygonCategories,
    } = useDocumentControlPanel();

    const {
        setCategoryEnabled,
    } = useDocumentContext();

    const $polygonCollections = getPolygonCategories().map(cat => (
        <React.Fragment key={cat}>
            <h2 className="toggle-header control-panel-header">
                <Switch
                    id={`enable-${cat.replace(" ", "-")}`}
                    checked={isPolygonCategoryEnabled[cat]}
                    onChange={evt => setCategoryEnabled("polygons", cat, evt.target.checked)}
                />
                <span>{cat}</span>
            </h2>
            <FeatureCollection
                typeFilter={["Polygon", "MultiPolygon"]}
                categoryFilter={[cat]}
                addButton
            />
        </React.Fragment>
    ));

    // #region Events
    const evt_enablePolygons = evt => {
        setCategoryEnabled("polygons", null, evt.target.checked);
    }
    const evt_newPolygon = evt => {
        setDialogNewPolygon(true);
    };
    // #endregion

    return (
        <>
            <div className="editor-control-panel">
                <div className="control-panel">
                    <h1 className="control-panel-header">Document</h1>
                    <OverlayImagesSection />
                    <h1 className="collection-section control-panel-header">
                        <div className="left">
                            <Switch
                                id="enable-all"
                                checked={isPolygonSectionEnabled}
                                onChange={evt_enablePolygons}
                            />
                        </div>
                        <div className="center">
                            <span>Polygons</span>
                        </div>
                        <div className="right">
                            <div className="control-panel-button-collection">
                                <Button baseStyle="clear" label="Export section" />
                                <Button baseStyle="success" icon="add" onClick={evt_newPolygon} />
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

export default DocumentControlPanel;