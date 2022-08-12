import React, { useEffect, useState } from 'react';
import { CircleMarker, ImageOverlay, LayersControl, Marker, TileLayer, useMap } from 'react-leaflet';
import useLeafletMap from './useLeafletMap';
import { useUIContext } from '../logic/useUIContext';
import useLeafletElementContainer from './useLeafletElementContainer';
import L from "leaflet";

function LeafletElementContainer (props) {
    const map = useMap();

    const {
        setBuiltMap,
    } = useLeafletMap();

    const {
        setMap,
        $backgroundPolygons,
        $editedPolygons,
        $editionElementsDraw,
        LeafletEditInteraction,
    } = useLeafletElementContainer();

    const { editedFeature } = useUIContext();

    useEffect(() => {
        setMap(map);
    }, []);

    const ICON_EDIT_VERTICES = () => L.divIcon({
        className: "leaflet-bullet-marker edit-layer-marker-vertex",
        iconSize: 12
    }); // TODO: Dynamic.

    return (
        <>
            {$backgroundPolygons}
            {$editedPolygons}
            {$editionElementsDraw}
            {editedFeature !== null && <LeafletEditInteraction />}
        </>
    );
}

export default LeafletElementContainer;