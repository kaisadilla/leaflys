import React from 'react';
import Button from '../../elements/Button';
import { HELP_MESSAGE_TOOL_ERASER, HELP_MESSAGE_TOOL_ERASER_DELETE_PATH } from '../../global';
import { useUIContext } from '../../logic/useUIContext';
import { POLYGON_TOOLS, POLYGON_TOOL_MODES } from "../../global";
import { getElementsBetween } from '../../util/Util';

function DeleteCornersOptions (props) {
    const {
        editor,
        editedFeature,
        setEditedFeature,
        editedFeatureSubpolygonIndex,
        setEditorSelectedToolMode,
        deleteTool,
        setDeleteToolVertexArray,
        setDeleteToolDirection,
    } = useUIContext();

    if (editor.selectedTool !== POLYGON_TOOLS.eraser) return <></>;

    const evt_reversePath = (evt) => {
        setDeleteToolDirection(!deleteTool.direction);
    };

    const evt_deleteVertices = (evt) => {
        const ring = editedFeature.polygons[editedFeatureSubpolygonIndex][0];
        const arrays = getElementsBetween(ring, ...deleteTool.vertexArray, deleteTool.direction);
        const verticesToDelete = arrays.indices;
        // remove the first and last vertex from the selection.
        verticesToDelete.splice(0, 1);
        verticesToDelete.pop();

        const newFeature = structuredClone(editedFeature);
        newFeature.polygons[editedFeatureSubpolygonIndex][0] = [];

        for (let i = 0; i < ring.length; i++) {
            if (!verticesToDelete.includes(i)) {
                newFeature.polygons[editedFeatureSubpolygonIndex][0].push(ring[i]);
            }
        }

        setEditedFeature(newFeature);
        setDeleteToolVertexArray([]);
    };

    return (
        <>
            <h2 className="control-panel-header">Delete vertices tool</h2>
            <div className="help">
                <p><i>{HELP_MESSAGE_TOOL_ERASER}</i></p>
            </div>
            <div className="tool-options">
                <div className="horizontal-control-group">
                    <span className="horizontal-control-group-name">Delete mode</span>
                    <div className="horizontal-control-group-controls">
                        <Button
                            icon="fa-arrow-pointer"
                            iconStyle="fa"
                            title="Place corners"
                            onClick={() => setEditorSelectedToolMode(POLYGON_TOOL_MODES.pickOne)}
                            selected={editor.selectedToolMode === POLYGON_TOOL_MODES.pickOne}
                        />
                        <Button
                            icon="edit_road"
                            iconStyle="g"
                            title="Draw line"
                            onClick={() => setEditorSelectedToolMode(POLYGON_TOOL_MODES.path)}
                            selected={editor.selectedToolMode === POLYGON_TOOL_MODES.path}
                        />
                    </div>
                </div>
                {
                    editor.selectedToolMode === POLYGON_TOOL_MODES.path &&
                    <div className="help">
                        <p><b>Delete path</b> — <i>{HELP_MESSAGE_TOOL_ERASER_DELETE_PATH}</i></p>
                    </div>
                }
                {
                    editor.selectedToolMode === POLYGON_TOOL_MODES.path &&
                    <div className="delete-path-panel">
                        <span><b>Selected vertices:</b> {deleteTool.vertexArray.join(", ")}</span>
                        <div className="delete-path-buttons">
                            <Button label="Reverse path" onClick={evt_reversePath} />
                            <Button baseStyle="success" label="Delete vertices" onClick={evt_deleteVertices} />
                        </div>
                    </div>
                }
            </div>
        </>
    );
}

export default DeleteCornersOptions;