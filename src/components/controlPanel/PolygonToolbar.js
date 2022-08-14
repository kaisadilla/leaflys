import React from 'react';
import Button from '../../elements/Button';
import { POLYGON_EDITOR_TOOLS, useUIContext } from '../../logic/useUIContext';

function PolygonToolbar () {
    const {
        editor,
        setEditorSelectedTool,
    } = useUIContext();

    return (
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
                        disabled
                        icon="open_with" iconStyle="g-round" title="Move shape (not available)"
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
    );
    
    function setTool (selectedTool) {
        setEditorSelectedTool(editor.selectedTool === selectedTool ? null : selectedTool);
    }
}

export default PolygonToolbar;