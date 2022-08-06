import React from 'react';
import Button from '../elements/Button';
import Switch from '../elements/Switch';
import FeatureCollection from './FeatureCollection';
import useEditorControlPanel from './useEditorControlPanelMain';

function EditorControlPanelMain (props) {
    const { getPolygonCategories } = useEditorControlPanel();

    const polygonCategories = getPolygonCategories();

    const $polygonCollections = polygonCategories.map(c => (
        <>
            <h2 className="toggle-header">
                <Switch id="enable-all" checked={true} />
                <span>{c}</span>
            </h2>
            <FeatureCollection key={c} typeFilter={["Polygon", "MultiPolygon"]} categoryFilter={c} addButton />
        </>
    ));

    return (
        <div className="editor-control-panel">
            <div className="control-panel">
                <h1 className="collection-section">
                    <div className="left">
                        <Switch id="enable-all" checked={true} />
                    </div>
                    <div className="center">
                        <span>Polygons</span>
                    </div>
                    <div className="right">
                        <div className="control-panel-button-collection">
                            <Button baseStyle="clear" label="Export section" />
                            <Button baseStyle="success" icon="add" />
                        </div>
                    </div>
                </h1>
                {$polygonCollections}
            </div>
        </div>
    );
}

export default EditorControlPanelMain;