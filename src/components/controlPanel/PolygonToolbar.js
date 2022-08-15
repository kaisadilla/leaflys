import React from 'react';
import Button from '../../elements/Button';
import { useUIContext } from '../../logic/useUIContext';
import { POLYGON_TOOLS, POLYGON_TOOL_MODES } from "../../global";

function PolygonToolbar () {
    const {
        editor,
        setEditorSelectedTool,
        setEditorSelectedToolMode,
        setDeleteToolVertexArray,
        setDeleteToolDirection,
    } = useUIContext();

    const evt_selectDraw = (evt) => {
        setTool(POLYGON_TOOLS.draw);
        setEditorSelectedToolMode(POLYGON_TOOL_MODES.draw);
    }

    const evt_selectDelete = (evt) => {
        setTool(POLYGON_TOOLS.eraser);
        setEditorSelectedToolMode(POLYGON_TOOL_MODES.pickOne);
        setDeleteToolVertexArray([]);
        setDeleteToolDirection(true);
    }

    return (
        <div className="tools-and-actions">
            <div className="tools">
                <h2 className="control-panel-header">Tools</h2>
                <div className="control-collection wrap padded-collection">
                    <Button
                        icon="mode_edit" iconStyle="g-outline" title="Draw shape"
                        onClick={evt_selectDraw}
                        selected={editor.selectedTool === POLYGON_TOOLS.draw}
                    />
                    <Button icon="fa-draw-polygon" iconStyle="fad" title="Move corners"
                        onClick={() => setTool(POLYGON_TOOLS.edit)}
                        selected={editor.selectedTool === POLYGON_TOOLS.edit}
                    />
                    <Button
                        icon="content_cut" iconStyle="g" title="Cut shape"
                        onClick={() => setTool(POLYGON_TOOLS.cut)}
                        selected={editor.selectedTool === POLYGON_TOOLS.cut}
                    />
                    <Button
                        icon="fa-eraser" iconStyle="fad" title="Remove corners"
                        onClick={evt_selectDelete}
                        selected={editor.selectedTool === POLYGON_TOOLS.eraser}
                    />
                    <Button
                        disabled
                        icon="open_with" iconStyle="g-round" title="Move shape (not available)"
                        onClick={() => setTool(POLYGON_TOOLS.move)}
                        selected={editor.selectedTool === POLYGON_TOOLS.move}
                    />
                    <Button
                        icon="fa-bullseye-pointer" iconStyle="fad" title="Select last vertex"
                        onClick={() => setTool(POLYGON_TOOLS.selectEnd)}
                        selected={editor.selectedTool === POLYGON_TOOLS.selectEnd}
                    />
                    <Button
                        icon="fa-diagram-venn" iconStyle="fa" title="Clip overlapping polygon"
                        onClick={() => setTool(POLYGON_TOOLS.deleteOverlap)}
                        selected={editor.selectedTool === POLYGON_TOOLS.deleteOverlap}
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
    );
    
    function setTool (selectedTool) {
        setEditorSelectedTool(editor.selectedTool === selectedTool ? null : selectedTool);
    }
}

export default PolygonToolbar;