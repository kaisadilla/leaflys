import React from 'react';
import { HELP_MESSAGE_TOOL_ERASER } from '../../global';
import { POLYGON_EDITOR_TOOLS, useUIContext } from '../../logic/useUIContext';

function DeleteCornersOptions (props) {
    const { editor } = useUIContext();

    
    if (editor.selectedTool !== POLYGON_EDITOR_TOOLS.eraser) return <></>;

    return (
        <>
            <h2 className="control-panel-header">Delete corners tool</h2>
            <div className="help">
                <p><i>{HELP_MESSAGE_TOOL_ERASER}</i></p>
            </div>
        </>
    );
}

export default DeleteCornersOptions;