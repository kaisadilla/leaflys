import React, { useEffect } from 'react';
import { ImageOverlay, MapContainer, TileLayer, GeoJSON, Marker, Polyline, useMapEvents, Tooltip, Polygon, LayersControl } from 'react-leaflet';
import { DEFAULT_MAP_CENTER, DEFAULT_ZOOM } from '../global';

import "leaflet/dist/leaflet.css";
import useLeafletMap from './useLeafletMap';
import { useUIContext } from '../logic/useUIContext';
import LeafletElementContainer from './LeafletElementContainer';

function LeafletMap (props) {
    console.log("Leaflet rerender!");
    const {
        setBuiltMap,
        $drawablePolygons,
        LeafletEditInteraction,
    } = useLeafletMap();

    const { editedFeature } = useUIContext();

    return (
        <MapContainer
            className="map-frame"
            center={DEFAULT_MAP_CENTER}
            zoom={DEFAULT_ZOOM}
            ref={mapInstance => { setBuiltMap(mapInstance); }}
        >
            <LayersControl>
                <LayersControl.BaseLayer name="map" checked>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Satellite">
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <LeafletElementContainer />
            {$drawablePolygons}
            {editedFeature !== null && <LeafletEditInteraction />}
        </MapContainer>
    );
}

export default LeafletMap;