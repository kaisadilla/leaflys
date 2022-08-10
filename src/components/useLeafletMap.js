import { useContext, useEffect, useState } from "react";
import L from "leaflet";
import { useDocumentContext } from "../logic/useDocumentContext";
import { POLYGON_EDITOR_TOOLS, useUIContext } from "../logic/useUIContext";
import {
    ImageOverlay, MapContainer, TileLayer, GeoJSON, Marker,
    Polyline, useMapEvents, Tooltip, Polygon, LayersControl
} from "react-leaflet";

const useLeafletMap = () => {
    const ICON_EDIT_VERTICES = L.divIcon({className: "leaflet-bullet-marker edit-layer-marker-vertex", iconSize: 12}); // TODO: Dynamic.
    const ICON_EDIT_POINTER = L.divIcon({ className: "leaflet-bullet-marker edit-layer-marker-add" })
    const ICON_EDIT_VERTEX_MIDPOINT = L.divIcon({className: "leaflet-bullet-marker edit-layer-marker-vertex", iconSize: 12 * 0.625}); // TODO: Dynamic

    const {
        specialKeys,
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editedFeature,
        editor,
        setEditedFeatureSubpolygonIndex,
        setEditedFeature,
        setEditorSelectedTool,
    } = useUIContext();
    const { document } = useDocumentContext();

    const [builtMap, setBuiltMap] = useState(null);

    /*** edit polygon mode ***/
    /** stores the current coordinates of the marker that follows the mouse. */
    const [editMarkerCoords, setEditMarkerCoords] = useState([0, 0]);
    const [editCutPolygon, setEditCutPolygon] = useState([]);

    function getEditedPolygon () {
        const activeColor = document.settings.colors["active-color"];
        const inactiveColor = document.settings.colors["inactive-color"];

        // TODO: Implement multiple shapes per polygon.
        if (editedFeature !== null) {
            const _subpolys = [];
            for (let i = 0; i < editedFeature.polygons.length; i++) {
                const key = [editedFeature.id, editedFeatureSubpolygonIndex];

                if (i === editedFeatureSubpolygonIndex) { // === shapeIndex
                    if (editor.selectedTool === POLYGON_EDITOR_TOOLS.draw) {
                        _subpolys.push(getPolygon_draw(editedFeature.polygons[i], key, i, activeColor));
                    }
                    else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.edit) {
                        
                    }
                    else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.cut) {
                        _subpolys.push(getPolygon_normal(editedFeature.polygons[i], key, i, activeColor));
                    }
                    else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.eraser) {
                    }
                    else {
                        _subpolys.push(getPolygon_normal(editedFeature.polygons[i], key, i, activeColor));
                    }
                }
                else {
                    _subpolys.push(getPolygon_normal(editedFeature.polygons[i], key, i, inactiveColor, true));
                }
            }

            return _subpolys;
        }
    }

    function getPolygon_normal (polygon, key, polygonIndex, color, clickToSelectSubpolygon = false) {
        const eventHandlers = {
            click: e => {
                setEditedFeatureSubpolygonIndex(polygonIndex);
            }
        }

        return (
            <Polygon key={key} positions={polygon} color={color} eventHandlers={clickToSelectSubpolygon ? eventHandlers : null} />
        );
    }

    /**
     * Returns the leaflet object of the selected polygon for the draw tool.
     */
    function getPolygon_draw (polygon, key, polygonIndex, color) {
        const _leafletFeatures = [];
        const bounds = builtMap.getBounds();
        
        if (polygon[0].length > 0) {
            for (const r in polygon) {
                const ring = polygon[r];
                for (const c in ring) {
                    if (bounds.contains(ring[c])) {
                        _leafletFeatures.push(
                            <Marker key={["marker", polygonIndex, r, c]} position={ring[c]} icon={ICON_EDIT_POINTER} />
                        );
                    }
                }

                _leafletFeatures.push(
                    <Polyline key={["line", polygonIndex, r, ring.length]} positions={ring} color={color} />
                );
            }

            _leafletFeatures.push(
                <Polygon key={[key, polygon[0].length, "polygon"]} positions={polygon} color={color} stroke={false} />,
                <Polyline
                    key={[[key, polygon[0].length], "polyline"]}
                    positions={[polygon[0][polygon[0].length - 1], editMarkerCoords]}
                    dashArray={"7, 8, 1, 8"}
                    color={color}
                />
            );
        }

        _leafletFeatures.push(
            <Marker key="marker-add" position={editMarkerCoords} icon={ICON_EDIT_POINTER}>
                {
                    polygon[0].length > 2 &&
                    !specialKeys.ctrl &&
                    <Tooltip permanent={true} direction="bottom" offset={[0, 10]} className="edit-layer-marker-tooltip">
                        Click on the first point to finish.
                    </Tooltip>
                }
            </Marker>
        );

        return _leafletFeatures;
    }

    return {
        builtMap,
        setBuiltMap,
    }
}

export default useLeafletMap;