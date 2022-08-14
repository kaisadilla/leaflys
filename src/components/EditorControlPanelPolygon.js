import React, { useState } from 'react';
import Button from '../elements/Button';
import Checkbox from '../elements/Checkbox';
import InputCombo from '../elements/InputCombo';
import Slider from '../elements/Slider';
import Textbox from '../elements/Textbox';
import { MathHelper } from '../helpers/MathHelper';
import { useDocumentContext } from '../logic/useDocumentContext';
import { POLYGON_EDITOR_TOOLS, POLYGON_EDITOR_TOOL_MODES, useUIContext } from '../logic/useUIContext';
import { Turflet } from '../logic/Turflet';
import DrawToolOptions from './toolOptions/DrawToolOptions';
import { HELP_MESSAGE_TOOL_CUT, HELP_MESSAGE_TOOL_DELETE_OVERLAP, HELP_MESSAGE_TOOL_DELETE_PATH, HELP_MESSAGE_TOOL_DRAW, HELP_MESSAGE_TOOL_EDIT, HELP_MESSAGE_TOOL_ERASER, HELP_MESSAGE_TOOL_MOVE, HELP_MESSAGE_TOOL_SELECT_START } from '../global';
import DeleteOverlapOptions from './toolOptions/DeleteOverlapOptions';

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
        setEditedFeatureAndSubindex,
        setEditorSelectedTool,
    } = useUIContext();

    const $subPolygons = editedFeature.polygons.map((p, i) => (
        <Button
            label={i}
            key={i} // old one used p as key, for some reason.
            onClick={() => setEditedFeatureSubpolygonIndex(i)}
            selected={editedFeatureSubpolygonIndex === i}
        />
    ));

    function setTool (selectedTool) {
        setEditorSelectedTool(editor.selectedTool === selectedTool ? null : selectedTool);
    }

    // #region Events
    const evt_cancelEdit = () => {
        setEditedFeatureIndex(null);
    };
    const evt_saveEdit = () => {
        setEditorSelectedTool(null);

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
    const evt_addSubpolygon = (evt) => {
        setEditedFeatureAndSubindex({
            ...editedFeature,
            polygons: [
                ...editedFeature.polygons,
                [[]],
            ]
        }, editedFeature.polygons.length);
    }
    // #endregion

    return (
        <div className="editor-control-panel">
            <div className="panel-header">
                <div className="content">
                    <span className="header-title">Edit {editedFeature.polygons.length > 1 ? "multipolygon" : "polygon"}</span>
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
                <h2 className="control-panel-header">
                    {editedFeature.polygons.length > 1 ? "Subpolygons (MultiPolygon)" : "Subpolygons"}
                </h2>
                <div className="polygon-selector">
                    <div className="polygon-gallery">
                        {$subPolygons}
                        <Button baseStyle="success" label="+" onClick={evt_addSubpolygon} />
                    </div>
                </div>
                <div className="tools-and-actions">
                    <div className="tools">
                        <h2 className="control-panel-header">Tools</h2>
                        <div className="control-collection wrap padded-collection">
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
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.deletePath)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.deletePath}
                            />
                            <Button
                                icon="fa-diagram-venn" iconStyle="fa" title="Clip overlapping polygon"
                                onClick={() => setTool(POLYGON_EDITOR_TOOLS.deleteOverlap)}
                                selected={editor.selectedTool === POLYGON_EDITOR_TOOLS.deleteOverlap}
                            />
                        </div>
                    </div>
                    <div className="actions" style={{maxWidth: "106px"}}>
                        <h2 className="control-panel-header">Actions</h2>
                        <div className="control-collection wrap align-center padded-collection">
                            <Button icon="undo" iconStyle="g-round" disabled />
                            <Button icon="redo" iconStyle="g-round" disabled />
                        </div>
                    </div>
                </div>
                <div className="help">
                    {
                        // TODO: REMOVE
                        editor.selectedTool === POLYGON_EDITOR_TOOLS.edit &&
                        <p><b>Edit tool</b> — {HELP_MESSAGE_TOOL_EDIT}</p>
                    }
                    {
                        // TODO: REMOVE
                        editor.selectedTool === POLYGON_EDITOR_TOOLS.cut &&
                        <p><b>Cut tool</b> — {HELP_MESSAGE_TOOL_CUT}</p>
                    }
                    {
                        // TODO: REMOVE
                        editor.selectedTool === POLYGON_EDITOR_TOOLS.eraser &&
                        <p><b>Delete vertex tool</b> — {HELP_MESSAGE_TOOL_ERASER}</p>
                    }
                    {
                        // TODO: REMOVE
                        editor.selectedTool === POLYGON_EDITOR_TOOLS.move &&
                        <p><b>Move tool</b> — {HELP_MESSAGE_TOOL_MOVE}</p>
                    }
                    {
                        // TODO: REMOVE
                        editor.selectedTool === POLYGON_EDITOR_TOOLS.selectStart &&
                        <p><b>Select starting vertex tool</b> — {HELP_MESSAGE_TOOL_SELECT_START}</p>
                    }
                    {
                        // TODO: REMOVE
                        editor.selectedTool === POLYGON_EDITOR_TOOLS.deletePath &&
                        <p><b>Delete path tool</b> — {HELP_MESSAGE_TOOL_DELETE_PATH}</p>
                    }
                </div>
                <DrawToolOptions />
                <DeleteOverlapOptions />
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
}

export default EditorControlPanelPolygon;