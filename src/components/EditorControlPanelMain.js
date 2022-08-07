import React from 'react';
import Button from '../elements/Button';
import Switch from '../elements/Switch';
import FeatureCollection from './FeatureCollection';
import useEditorControlPanel from './useEditorControlPanelMain';

function EditorControlPanelMain (props) {
    const { getPolygonCategories } = useEditorControlPanel();

    const polygonCategories = getPolygonCategories();

    const $polygonCollections = polygonCategories.map(c => (
        <React.Fragment key={c}>
            <h2 className="toggle-header">
                <Switch id="enable-all" defaultChecked />
                <span>{c}</span>
            </h2>
            <FeatureCollection typeFilter={["Polygon", "MultiPolygon"]} categoryFilter={[c]} addButton />
        </React.Fragment>
    ));

    return (
        <div className="editor-control-panel">
            <div className="control-panel">
                <h1 className="collection-section">
                    <div className="left">
                        <Switch id="enable-all" defaultChecked />
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