import React from 'react';
import { useUIContext } from '../../logic/useUIContext';
import DocumentControlPanel from './DocumentControlPanel';
import PolygonControlPanel from './PolygonControlPanel';

function ControlPanel () {
    const { editedFeatureIndex } = useUIContext();

    if (editedFeatureIndex === null) {
        return <DocumentControlPanel />;
    }
    else {
        return <PolygonControlPanel />;
    }
}

export default ControlPanel;