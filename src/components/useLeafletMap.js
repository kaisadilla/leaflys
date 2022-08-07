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
    } = useUIContext();
    const { document } = useDocumentContext();

    const [builtMap, setBuiltMap] = useState(null);
    const [$drawablePolygons, setDrawablePolygons] = useState([]);

    /*** edit polygon mode ***/
    const [editMarkerCoords, setEditMarkerCoords] = useState([0, 0]);
    const [editCutPolygon, setEditCutPolygon] = useState([]);

    // update the array of forms drawn to leaflet when a dependency in the array changes.
    useEffect(() => {
        if (editedFeatureIndex === null) {
            const polys = getEnabledPolygons().map(p => <GeoJSON key={["edit", p.id]} data={p} />);
            setDrawablePolygons(polys);
        }
        else if (editedFeatureIndex !== null) {
            const foreignColor = document.settings.colors["foreign-color"];

            let polys = getForeignPolygons().map(p => (
                <GeoJSON key={["foreign", p.id]} data={p} color={foreignColor} fillColor={foreignColor} />
            ));
            polys.push(getEditedPolygon());

            setDrawablePolygons(polys);
        }
        else {
            console.log("[DEBUG] THIS SHOULDN'T BE REACHED");
            const polys = [];
            setDrawablePolygons(polys);
        }
    }, [document, editedFeatureIndex, editor.selectedTool]);

    /**
     * Returns an array with the polygons in the document that are not disabled.
     */
    function getEnabledPolygons () {
        return document.features.polygons.filter(p => p.properties.leaflys?.disabled === undefined || !p.properties.leaflys.disabled);
    }

    /**
     * Returns an array with the enabled polygons in the document, except for
     * the one that is being edited..
     */
    function getForeignPolygons () {
        const editedPolygonId = document.features.polygons[editedFeatureIndex].id;
        return getEnabledPolygons().filter(p => p.id !== editedPolygonId);
    }

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
                        _subpolys.push(getPolygon_edit(editedFeature.polygons[i], key, i, activeColor));
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

    function getPolygon_edit (polygon, key, polygonIndex, color) {
        const _subpolys = [];

        if (polygon[0].length > 0) {
            for (const r in polygon) {
                const ring = polygon[r];
                for (const c in ring) {
                    const dragVertex = {
                        // use event "drag" to update borders in real time.
                        dragend: e => {
                            replaceVertexAt(c, e.target._latlng);
                        }
                    }

                    _subpolys.push(
                        <Marker
                            key={["marker", polygonIndex, r, c]}
                            position={ring[c]}
                            icon={ICON_EDIT_VERTICES}
                            eventHandlers={dragVertex}
                            draggable={true}
                        />
                    )

                    const thisCoord = ring[c];
                    const lastCoord = c === "0" ? ring[ring.length - 1] : ring[c - 1];
                    
                    debugger;

                    _subpolys.push(
                        <Polyline key={["line", polygonIndex, r, c]} position={[lastCoord, thisCoord]} color />
                    )

                    // TODO: Rework, because this isn't actually the visual midpoint between two points.
                    const lMidPoint = {lat: 0.5 * lastCoord.lat + 0.5 * thisCoord.lat, lng: 0.5 * lastCoord.lng + 0.5 * thisCoord.lng};

                    const addVertex = {
                        click: e => {
                            insertVertexAt(c, lMidPoint);
                        }
                    };

                    _subpolys.push(
                        <Marker
                            key={["marker-add", polygonIndex, r, c]}
                            position={lMidPoint}
                            icon={ICON_EDIT_VERTEX_MIDPOINT}
                            eventHandlers={addVertex}
                        />
                    )
                }
            }

            _subpolys.push(
                <Polygon key={[key, polygon[0].length, "polygon"]} positions={polygon} color={color} stroke={false} />
            )
        }

        return _subpolys;
    }

    function getPolygon_cut () {
        // TODO. variable "editCutPolygon" declared already.
    }

    function insertVertexAt (index, vertex) {
        const newFeature = { ...editedFeature };
        newFeature.polygons[editedFeatureSubpolygonIndex][0].splice(index, 0, vertex);
        setEditedFeature(newFeature);
    }

    function replaceVertexAt (index, vertex) {
        const newFeature = { ...editedFeature };
        newFeature.polygons[editedFeatureSubpolygonIndex][0].splice(index, 1, vertex);
        setEditedFeature(newFeature);
    }

    return {
        builtMap,
        setBuiltMap,
        $drawablePolygons,
        getEnabledPolygons,
    }
}

export default useLeafletMap;