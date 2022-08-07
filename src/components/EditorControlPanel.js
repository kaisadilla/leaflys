import React from 'react';
import { useUIContext } from '../logic/useUIContext';
import EditorControlPanelMain from './EditorControlPanelMain';
import EditorControlPanelPolygon from './EditorControlPanelPolygon';

function EditorControlPanel (props) {
    const { editedFeatureIndex } = useUIContext();

    if (editedFeatureIndex === null) {
        return <EditorControlPanelMain />;
    }
    else {
        return <EditorControlPanelPolygon />;
    }
}

export default EditorControlPanel;