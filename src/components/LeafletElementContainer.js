import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useUIContext } from '../logic/useUIContext';
import useLeafletElementContainer from './useLeafletElementContainer';

function LeafletElementContainer (props) {
    // #region hooks
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
    // #endregion

    useEffect(() => {
        setMap(map);
    }, [map, setMap]);

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