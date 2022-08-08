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
    const { document, replacePolygonAt } = useDocumentContext();
    const {
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editedFeature,
        editor,
        setEditedFeatureIndex,
        setEditedFeatureSubpolygonIndex,
        setEditedFeature,
        setEditorSelectedTool,
        setEditorSelectedToolMode
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

        replacePolygonAt(editedFeatureIndex, newFeature);
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
                <h2>Properties</h2>
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
                <div className="polygon-selector">
                    <h2>{editedFeatureIndex.length > 1 ? "Polygons (MultiPolygon)" : "Polygons"}</h2>
                    <div className="polygon-gallery">
                        {$subPolygons}
                        <Button baseStyle="success" label="+" />
                    </div>
                </div>
                <div className="tools-and-actions">
                    <div className="tools">
                        <h2>Tools</h2>
                        <div className="control-collection">
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
                                icon="open_with" iconStyle="g-round" title="Move shape" disabled
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.move)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.move}
                            />
                        </div>
                    </div>
                    <div className="actions">
                        <h2>Actions</h2>
                        <div className="control-collection">
                            <Button icon="undo" iconStyle="g-round" disabled />
                            <Button icon="redo" iconStyle="g-round" disabled />
                        </div>
                    </div>
                    <div className="edit-mode">
                        <h2>Edit mode</h2>
                        <div className="control-collection">
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
                <div className="options">
                    <h2>Options</h2>
                    <Checkbox id="snap-borders" label="Snap to nearby polygons." defaultchecked />
                    <Checkbox id="show-others" label="Show other polygons." defaultchecked />
                    <div className="control-table">
                        <InputCombo className="option-slider pair">
                            <label htmlFor="snap-distance">Snap distance</label>
                            <Slider id="snap-distance" {...POLYGON_EDITOR_SNAP_DISTANCE} value={25} />
                        </InputCombo>
                        <InputCombo className="option-slider pair">
                            <label htmlFor="marker-size">Marker size</label>
                            <Slider id="marker-size" {...POLYGON_EDITOR_MARKER_SIZE} value={12} />
                        </InputCombo>
                        <InputCombo className="option-slider pair">
                            <label htmlFor="pencil-step">Pencil step</label>
                            <Slider id="pencil-step" {...POLYGON_EDITOR_PENCIL_STEP} value={40} />
                        </InputCombo>
                    </div>
                    <div className="options-control-bar">
                        <Button baseStyle="danger" label="Reset options" />
                    </div>
                </div>
                <h2>Data</h2>
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
                <h2>TO-DO</h2>
                <div className="todo">
                    <div>- Remove placeholder data from Data section and replace it with real data.</div>
                    <div>- Count how many vertices the shape has, with an option to reduce them.</div>
                    <div>- Handle the error that occurs when saving a Polygon with less than 4 Positions.</div>
                </div>
            </div>
        </div>
    );

    function setTool (selectedTool) {
        setEditorSelectedTool(editor.selectedTool === selectedTool ? null : selectedTool);
    }
}

export default EditorControlPanelPolygon;