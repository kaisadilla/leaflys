import React, { useEffect } from 'react';
import { LayersControl, TileLayer, useMap } from 'react-leaflet';
import useLeafletMap from './useLeafletMap';
import { useUIContext } from '../logic/useUIContext';
import useLeafletElementContainer from './useLeafletElementContainer';

function LeafletElementContainer (props) {
    const map = useMap();

    const {
        setBuiltMap,
        $drawablePolygons,
    } = useLeafletMap();

    const {
        setMap,
        $backgroundPolygons,
        $editedPolygons,
        LeafletEditInteraction,
    } = useLeafletElementContainer();

    const { editedFeature } = useUIContext();

    useEffect(() => {
        setMap(map);
    }, []);

    return (
        <>
            {$backgroundPolygons}
            {$editedPolygons}
            {editedFeature !== null && <LeafletEditInteraction />}
        </>
    );
}

export default LeafletElementContainer;