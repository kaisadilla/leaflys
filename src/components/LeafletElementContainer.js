import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useUIContext } from '../logic/useUIContext';
import useLeafletElementContainer from './useLeafletElementContainer';

function LeafletElementContainer (props) {
    const map = useMap();

    const {
        setMap,
        $layoutImages,
        $backgroundPolygons,
        $editedPolygons,
        $editionElementsDraw,
        LeafletEditInteraction,
    } = useLeafletElementContainer();

    const { editedFeature } = useUIContext();

    useEffect(() => {
        setMap(map);
    }, []);

    return (
        <>
            {$layoutImages}
            {$backgroundPolygons}
            {$editedPolygons}
            {$editionElementsDraw}
            {editedFeature !== null && <LeafletEditInteraction />}
        </>
    );
}

export default LeafletElementContainer;