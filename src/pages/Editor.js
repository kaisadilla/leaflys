import React from 'react';
import ControlPanel from '../components/controlPanel/ControlPanel';
import EditorMap from '../components/EditorMap';
import NavBar from '../components/NavBar';

function Editor () {
    console.info("[DEBUG - IMPORTANT] EDITOR RERENDERED.");

    return (
        <div className="map-editor">
            <div className="editor-tab">
                <EditorMap />
                <ControlPanel />
            </div>
            <div className="editor-navbar">
                <NavBar />
            </div>
        </div>
    );
};

export default React.memo(Editor);