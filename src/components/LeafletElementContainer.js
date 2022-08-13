import React, { useEffect, useState } from 'react';
import { CircleMarker, ImageOverlay, LayersControl, Marker, TileLayer, useMap } from 'react-leaflet';
import useLeafletMap from './useLeafletMap';
import { useUIContext } from '../logic/useUIContext';
import useLeafletElementContainer from './useLeafletElementContainer';
import L from "leaflet";
import { useDocumentContext } from '../logic/useDocumentContext';

function LeafletElementContainer (props) {
    const map = useMap();

    const {
        layoutImages,
    } = useDocumentContext();

    const {
        setBuiltMap,
    } = useLeafletMap();

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