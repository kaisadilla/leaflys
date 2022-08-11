import React, { useState } from 'react';
import Button from '../elements/Button';
import Checkbox from '../elements/Checkbox';
import InputCombo from '../elements/InputCombo';
import Slider from '../elements/Slider';
import Textbox from '../elements/Textbox';
import { MathHelper } from '../helpers/MathHelper';
import { POLYGON_EDITOR_MARKER_SIZE, POLYGON_EDITOR_PENCIL_STEP, POLYGON_EDITOR_SNAP_DISTANCE, POLYGON_EDITOR_SNAP_DISTANCE_MAX, POLYGON_EDITOR_SNAP_DISTANCE_MIN } from '../global';
import { useDocumentContext } from '../logic/useDocumentContext';
import { POLYGON_EDITOR_TOOLS, POLYGON_EDITOR_TOOL_MODES, useUIContext } from '../logic/useUIContext';
import { Turflet } from '../logic/Turflet';

function EditorControlPanelPolygon (props) {
    const { document, updatePolygon } = useDocumentContext();
    const {
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editedFeature,
        editor,
        setEditedFeatureIndex,
        setEditedFeatureSubpolygonIndex,
        setEditedFeature,
        setEditorSelectedTool,
        setEditorSelectedToolMode,
        setEditorSnap,
        setEditorShowForeignFeatures,
        setEditorSnapDistance,
        setEditorMarkerSize,
        setEditorPencilStep,
    } = useUIContext();

    const $subPolygons = editedFeature.polygons.map((p, i) => (
        <Button
            label={i}
            key={i} // old one used p as key, for some reason.
            onClick={() => setEditedFeatureSubpolygonIndex(i)}
            selected={editedFeatureSubpolygonIndex === i}
        />
    ));

    // #region Events
    const evt_cancelEdit = () => {
        setEditedFeatureIndex(null);
    };
    const evt_saveEdit = () => {
        const geojson = Turflet.polygon.leafletToGeojson(editedFeature.polygons);
        const newFeature = { ...document.features.polygons[editedFeatureIndex] }

        newFeature.properties.name = editedFeature.name;
        newFeature.properties.category = editedFeature.category;
        newFeature.id = editedFeature.id;
        newFeature.geometry.type = geojson.geometry.type;
        newFeature.geometry.coordinates = geojson.geometry.coordinates;

        updatePolygon(editedFeature.originalId, newFeature);
        setEditedFeatureIndex(null);
    };
    const evt_nameTextbox = (evt) => {
        setEditedFeature({
            ...editedFeature,
            name: evt.target.value,
        })
    };
    const evt_categoryTextbox = (evt) => {
        setEditedFeature({
            ...editedFeature,
            category: evt.target.value,
        })
    };
    const evt_idTextbox = (evt) => {
        setEditedFeature({
            ...editedFeature,
            id: evt.target.value,
        })
    };
    const evt_snap = (evt) => setEditorSnap(evt.target.checked);
    const evt_foreignFeatures = (evt) => setEditorShowForeignFeatures(evt.target.checked);
    const evt_snapDistance = (evt) => setEditorSnapDistance(parseFloat(evt.target.value));
    const evt_markerSize = (evt) => setEditorMarkerSize(parseFloat(evt.target.value));
    const evt_pencilStep = (evt) => setEditorPencilStep(parseFloat(evt.target.value));
    // #endregion

    return (
        <div className="editor-control-panel">
            <div className="panel-header">
                <div className="content">
                    <span className="header-title">Edit polygon</span>
                    <div className="control-collection">
                        <Button baseStyle="danger" label="Cancel" onClick={evt_cancelEdit} />
                        <Button baseStyle="success" label="Save" onClick={evt_saveEdit} />
                    </div>
                </div>
                <div className="shadow-border" />
            </div>
            <div className="control-panel control-panel-edit">
                <h2 className="control-panel-header">Properties</h2>
                <div className="properties control-table">
                    <InputCombo className="pair">
                        <label htmlFor="feature-name">Name</label>
                        <Textbox id="feature-name" value={editedFeature.name} onChange={evt_nameTextbox} />
                    </InputCombo>
                    <InputCombo className="pair">
                        <label htmlFor="feature-category">Category</label>
                        <Textbox id="feature-category" value={editedFeature.category} onChange={evt_categoryTextbox} />
                    </InputCombo>
                    <InputCombo className="pair">
                        <label htmlFor="feature-id">Id</label>
                        <Textbox id="feature-id" value={editedFeature.id} onChange={evt_idTextbox} />
                    </InputCombo>
                </div>
                <h2 className="control-panel-header">{editedFeatureIndex.length > 1 ? "Polygons (MultiPolygon)" : "Polygons"}</h2>
                <div className="polygon-selector">
                    <div className="polygon-gallery">
                        {$subPolygons}
                        <Button baseStyle="success" label="+" />
                    </div>
                </div>
                <div className="tools-and-actions">
                    <div className="tools">
                        <h2 className="control-panel-header">Tools</h2>
                        <div className="control-collection wrap">
                            <Button
                                icon="mode_edit" iconStyle="g-outline" title="Draw shape"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.draw)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.draw}
                            />
                            <Button icon="fa-draw-polygon" iconStyle="fad" title="Move corners"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.edit)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.edit}
                            />
                            <Button
                                icon="content_cut" iconStyle="g" title="Cut shape"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.cut)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.cut}
                            />
                            <Button
                                icon="fa-eraser" iconStyle="fad" title="Remove corners"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.eraser)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.eraser}
                            />
                            <Button
                                icon="open_with" iconStyle="g-round" title="Move shape (not available)" disabled
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.move)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.move}
                            />
                            <Button
                                icon="fa-bullseye-pointer" iconStyle="fad" title="Select starting point"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.selectStart)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.selectStart}
                            />
                            <Button
                                icon="fa-square-minus" iconStyle="fa" title="Delete part of path"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.selectStart)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.selectStart}
                            />
                        </div>
                    </div>
                    <div className="actions" style={{maxWidth: "82px"}}>
                        <h2 className="control-panel-header">Actions</h2>
                        <div className="control-collection wrap">
                            <Button icon="undo" iconStyle="g-round" disabled />
                            <Button icon="redo" iconStyle="g-round" disabled />
                        </div>
                    </div>
                    <div className="edit-mode" style={{maxWidth: "126px"}}>
                        <h2 className="control-panel-header">Edit mode</h2>
                        <div className="control-collection wrap">
                            <Button
                                icon="fa-map-pin" iconStyle="fad" title="Place points"
                                onClick={() => setEditorSelectedToolMode(POLYGON_EDITOR_TOOL_MODES.place)}
                                selected={editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.place}
                            />
                            <Button
                                icon="fa-scribble" iconStyle="fa" title="Draw line"
                                onClick={() => setEditorSelectedToolMode(POLYGON_EDITOR_TOOL_MODES.draw)}
                                selected={editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.draw}
                            />
                            <Button
                                icon="fa-magnet" iconStyle="fad" title="Copy foreign lines"
                                onClick={() => setEditorSelectedToolMode(POLYGON_EDITOR_TOOL_MODES.snap)}
                                selected={editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.snap}
                            />
                        </div>
                    </div>
                </div>
                <h2 className="control-panel-header">Options</h2>
                <div className="options">
                    <Checkbox
                        id="snap-borders"
                        label="Snap to nearby polygons."
                        checked={editor.snap}
                        onChange={evt_snap}
                        highlight
                    />
                    <Checkbox
                        id="show-others"
                        label="Show other polygons."
                        checked={editor.showForeignFeatures}
                        onChange={evt_foreignFeatures}
                        highlight
                    />
                    <div className="control-table">
                        <InputCombo className="option-slider pair">
                            <label htmlFor="snap-distance">Snap distance</label>
                            <Slider
                                id="snap-distance"
                                {...POLYGON_EDITOR_SNAP_DISTANCE}
                                value={editor.snapDistance}
                                onChange={evt_snapDistance}
                            />
                        </InputCombo>
                        <InputCombo className="option-slider pair">
                            <label htmlFor="marker-size">Marker size</label>
                            <Slider
                                id="marker-size"
                                {...POLYGON_EDITOR_MARKER_SIZE}
                                value={editor.markerSize}
                                onChange={evt_markerSize}
                            />
                        </InputCombo>
                        <InputCombo className="option-slider pair">
                            <label htmlFor="pencil-step">Pencil step</label>
                            <Slider
                                id="pencil-step"
                                {...POLYGON_EDITOR_PENCIL_STEP}
                                value={editor.pencilStep}
                                onChange={evt_pencilStep}
                            />
                        </InputCombo>
                    </div>
                    <div className="options-control-bar">
                        <Button baseStyle="danger" label="Reset options" />
                    </div>
                </div>
                <h2 className="control-panel-header">Data</h2>
                <div className="data">
                    <div className="data-piece">
                        <span className="name">Area: </span>
                        <span className="value">{MathHelper.toString(42)} km²</span>
                    </div>
                    <div className="data-piece">
                        <span className="name">Vertices: </span>
                        <span className="value">{73} vertices</span>
                    </div>
                </div>
                <h2 className="control-panel-header">TO-DO</h2>
                <ul className="todo" style={{textAlign: "left"}}>
                    <li>Remove placeholder data from Data section and replace it with real data.</li>
                    <li>Count how many vertices the shape has, with an option to reduce them.</li>
                    <li>Handle the error that occurs when saving a Polygon with less than 4 Positions.</li>
                </ul>
            </div>
        </div>
    );

    function setTool (selectedTool) {
        setEditorSelectedTool(editor.selectedTool === selectedTool ? null : selectedTool);
    }
}

export default EditorControlPanelPolygon;