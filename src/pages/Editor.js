import React from 'react';
import EditorControlPanel from '../components/EditorControlPanel';
import EditorMap from '../components/EditorMap';
import NavBar from '../components/NavBar';

function Editor (props) {
    return (
        <div className="map-editor">
            <div className="editor-tab">
                <EditorMap />
                <EditorControlPanel />
            </div>
            <div className="editor-navbar">
                <NavBar />
            </div>
        </div>
    );
}

export default Editor;