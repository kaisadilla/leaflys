import { useEffect, useState } from "react";
import { useDocumentContext } from "../logic/useDocumentContext";
import { POLYGON_EDITOR_TOOLS, POLYGON_EDITOR_TOOL_MODES, useUIContext } from "../logic/useUIContext";
import L from "leaflet";
import {
    ImageOverlay, MapContainer, TileLayer, GeoJSON, Marker,
    Polyline, useMapEvents, Tooltip, Polygon, LayersControl
} from "react-leaflet";
import turf from "turf";
import nearestPointOnLine from '@turf/nearest-point-on-line';
import transformTranslate from '@turf/transform-translate';
import { MathUtil } from "../util/MathHelper";
import { ToGeoJSON, ToLeaflet } from "../util/TurfLeafletConversion";
import { useEventContext } from "../logic/useEventContext";

const useLeafletElementContainer = () => {
    const { document, layoutImages, flags: docFlags } = useDocumentContext();

    const {
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editedFeature,
        editor,
        setEditedFeatureSubpolygonIndex,
        setEditedFeature,
        setEditorSelectedTool,
        flags: uiFlags,
    } = useUIContext();

    const { keys } = useEventContext();

    const ICON_EDIT_VERTICES = L.divIcon({
        className: "leaflet-bullet-marker edit-layer-marker-vertex",
        iconSize: [editor.markerSize, editor.markerSize]
    });
    const ICON_EDIT_POINTER = L.divIcon({
        className: "leaflet-bullet-marker edit-layer-marker-add",
        iconSize: [editor.markerSize, editor.markerSize]
    });
    const ICON_EDIT_VERTEX_MIDPOINT = L.divIcon({
        className: "leaflet-bullet-marker edit-layer-marker-vertex",
        iconSize: [editor.markerSize * 0.625, editor.markerSize * 0.625]
    });
    const ICON_CHOSEN_POINTER = L.divIcon({
        className: "leaflet-bullet-marker edit-layer-marker-chosen",
        iconSize: [editor.markerSize * 2, editor.markerSize * 2],
    });
    const ICON_DELETE = L.icon({
        iconUrl: "img/marker_delete.png",
        iconSize: [editor.markerSize * 1.25, editor.markerSize * 1.25],
    });

    /*** leaflet map and elements drawn to it. */
    const [map, setMap] = useState(null);
    /** contains <LayoutImage> elements. */
    const [$layoutImages, setLayoutImages] = useState([]);
    /** contains the leaflet elements that draw Polygons not being edited. */
    const [$backgroundPolygons, setBackgroundPolygons] = useState([]);
    /** contains the leaflet elements that draw the Polygon being edited. */
    const [$editedPolygons, setEditedPolygons] = useState([]);
    /** contains the leaflet elements of the draw tool UI. */
    const [$editionElementsDraw, setEditionElementsDraw] = useState([]);
    
    /*** edit polygon mode ***/
    /** the current coordinates of the marker that follows the mouse. */
    const [editMarkerCoords, setEditMarkerCoords] = useState([0, 0]);
    /** an array containing all the vertices of all other polygons. */
    const [editSnapVertices, setEditSnapVertices] = useState([]);
    const [editSnapRings, setEditSnapRings] = useState([]);
    const [editCutPolygon, setEditCutPolygon] = useState([]);
    /** a flag to update when the user edits the polygon in a way that requires a rerender. */
    const [editPolygonFlag, setEditPolygonFlag] = useState(false);
    
    /** If true, adding the current vertex will finish the shape and deselect the current editing tool. */
    const [finishingVertex, setFinishingVertex] = useState(false);

    useEffect(() => {
        setEditPolygonFlag(!editPolygonFlag);
    }, [editedFeature?.polygons]);

    useEffect(() => {
        console.info("[DEBUG] Layout images rerendered.");
        buildLayoutImages();
    }, [layoutImages])

    useEffect(() => {
        console.info("[DEBUG] Background polygons rerendered.");
        buildBackgroundPolygonObjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docFlags.documentLoaded, docFlags.polygonsChanged, editedFeatureIndex]);

    useEffect(() => {
        console.info("[DEBUG] Edited polygon rerendered.");
        buildEditedPolygonObjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        docFlags.documentLoaded,
        docFlags.polygonsChanged,
        editPolygonFlag,
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editor.selectedTool,
        editor.markerSize,
    ]);

    const updateMarkerCoords = editor.selectedTool === POLYGON_EDITOR_TOOLS.draw && editMarkerCoords;
    useEffect(() => {
        //console.info("[DEBUG] Edit artifacts rerendered.");
        buildEditUI();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        docFlags.documentLoaded,
        docFlags.polygonsChanged,
        editPolygonFlag,
        editedFeatureIndex,
        editedFeatureSubpolygonIndex,
        editor.selectedTool,
        updateMarkerCoords,
        editor.markerSize,
    ]);

    useEffect(() => {
        if (editedFeatureIndex !== null) {
            const _foreignVertices = _getForeignSnapVertices();
            const _foreignRings = _getForeignSnapRings();
    
            setEditSnapVertices(turf.featureCollection(_foreignVertices));
            setEditSnapRings(turf.multiLineString(_foreignRings));
        }
    }, [editedFeatureIndex]);

    function buildLayoutImages () {
        const elements = layoutImages.map((img, i) => {
            return (
                <ImageOverlay
                    key={[i, img.northEast.lat, img.northEast.lng, img.southWest.lat, img.southWest.lng, img.opacity]}
                    url={`data:image/png;base64, ${img.base64}`}
                    bounds={[
                        [img.northEast.lat, img.northEast.lng],
                        [img.southWest.lat, img.southWest.lng],
                    ]}
                    opacity={img.opacity}
                />
            );
        });
        setLayoutImages(elements);
    }

    function buildBackgroundPolygonObjects () {
        // when no feature is being edited.
        if (editedFeatureIndex === null) {
            const polys = getEnabledPolygons().map(p => (
                <GeoJSON key={["noselect", p.id]} data={p} />
            ));
            setBackgroundPolygons(polys);
        }
        // when a feature has been selected for edition.
        else if (editedFeatureIndex !== null) {
            const foreignColor = document.settings.colors["foreign-color"];
            
            let polys = getForeignPolygons().map(p => (
                <GeoJSON key={["foreign", p.id]} data={p} color={foreignColor} fillColor={foreignColor} />
            ));

            setBackgroundPolygons(polys);
        }
        else {
            console.error("[DEBUG] The universe broke: 'editedFeatureIndex'" +
            "is neither equal nor not equal to null somehow.");
        }
    }

    function buildEditedPolygonObjects () {
        if (editedFeatureIndex === null) {
            setEditedPolygons([]);
            return;
        }
        
        const activeColor = document.settings.colors["active-color"];
        const inactiveColor = document.settings.colors["inactive-color"];

        const subpolys = [];

        if (editedFeature !== null) {
            for (let i = 0; i < editedFeature.polygons.length; i++) {
                const key = [editedFeature.id, editedFeatureSubpolygonIndex, i];

                if (i === editedFeatureSubpolygonIndex) {
                    if (editor.selectedTool === POLYGON_EDITOR_TOOLS.draw) {
                        subpolys.push(buildPolygon_draw(editedFeature.polygons[i], i, key, activeColor));
                    }
                    else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.edit) {
                        subpolys.push(buildPolygon_edit(editedFeature.polygons[i], i, key, activeColor));
                    }
                    else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.eraser) {
                        subpolys.push(buildPolygon_eraser(editedFeature.polygons[i], i, key, activeColor));
                    }
                    else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.selectStart) {
                        subpolys.push(buildPolygon_selectStart(editedFeature.polygons[i], i, key, activeColor));
                    }
                    else {
                        subpolys.push(buildPolygon_normal(editedFeature.polygons[i], key, activeColor));
                    }
                }
                else {
                    const evt_selectSubpoly = {
                        click: (evt) => {
                            setEditedFeatureSubpolygonIndex(i);
                        }
                    }
                    subpolys.push(buildPolygon_normal(editedFeature.polygons[i], key, inactiveColor, evt_selectSubpoly));
                }
            }
        }

        setEditedPolygons(subpolys);
    }

    function buildEditUI () {
        if (editedFeatureIndex === null) {
            setEditionElementsDraw([]);
            return;
        }

        const activeColor = document.settings.colors["active-color"];

        const features = [];

        if (editedFeature !== null) {
            for (let i = 0; i < editedFeature.polygons.length; i++) {
                const key = [editedFeature.id, editedFeatureSubpolygonIndex];

                if (i === editedFeatureSubpolygonIndex) {
                    if (editor.selectedTool === POLYGON_EDITOR_TOOLS.draw) {
                        features.push(buildUI_draw(editedFeature.polygons[i], key, activeColor));
                    }
                }
            }

            setEditionElementsDraw(features);
        }
    }
    
    function buildPolygon_normal (polygon, key, color, eventHandlers = null) {
        return (
            <Polygon key={key} positions={polygon} color={color} eventHandlers={eventHandlers} />
        );
    }

    /**
     * Returns the leaflet object of the selected polygon for the draw tool.
     */
    function buildPolygon_draw (polygon, polygonIndex, key, color) {
        const _leafletFeatures = [];
        const bounds = map.getBounds();
        
        if (polygon[0].length > 0) {
            for (const r in polygon) {
                const ring = polygon[r];
                for (const c in ring) {
                    if (bounds.contains(ring[c])) {
                        _leafletFeatures.push(
                            <Marker key={["marker", polygonIndex, r, c]} position={ring[c]} icon={ICON_EDIT_VERTICES} />
                        );
                    }
                    if (r !== 0) {
                        <Marker key={["marker", polygonIndex, r, c]} position={ring[0]} icon={ICON_EDIT_VERTICES} />
                    }
                }

                _leafletFeatures.push(
                    <Polyline key={["line", polygonIndex, r, ring.length]} positions={ring} color={color} />
                );
            }

            _leafletFeatures.push(
                <Polygon key={[key, polygon[0].length, "polygon"]} positions={polygon} color={color} stroke={false} />,
            );
        }

        return _leafletFeatures;
    }

    function buildUI_draw (polygon, key, color) {
        const _leafletFeatures = [];
        
        if (polygon[0].length > 0) {
            _leafletFeatures.push(
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
                    !keys.ctrl &&
                    <Tooltip permanent={true} direction="bottom" offset={[0, 10]} className="edit-layer-marker-tooltip">
                        Click on the first point to finish.
                    </Tooltip>
                }
            </Marker>
        );

        return _leafletFeatures;
    }

    function buildPolygon_edit (polygon, polygonIndex, key, color) {
        const _leafletFeatures = [];

        if (polygon[0].length > 0) {
            for (const r in polygon) {
                const ring = polygon[r];
                
                for (const c in ring) {
                    const dragVertex = {
                        dragend: e => {
                            _replaceVertexAt(c, e.target._latlng);
                            setEditPolygonFlag(!editPolygonFlag);
                        }
                    }
                    
                    _leafletFeatures.push(
                        <Marker
                            key={["marker", polygonIndex, r, c]}
                            position={ring[c]}
                            icon={ICON_EDIT_VERTICES}
                            eventHandlers={dragVertex}
                            draggable={true}
                        />
                    );

                    const thisRing = ring[c];
                    const lastRing = c === "0" ? ring[ring.length - 1] : ring[c - 1];

                    _leafletFeatures.push(
                        <Polyline
                            key={["line", polygonIndex, r, c]}
                            positions={[lastRing, thisRing]}
                            color={color}
                        />
                    );

                    const lMidPoint = {
                        lat: (0.5 * lastRing.lat) + (0.5 * thisRing.lat),
                        lng: (0.5 * lastRing.lng) + (0.5 * thisRing.lng)
                    }

                    const addVertex = {
                        click: e => {
                            _insertVertexAt(c, lMidPoint);
                            setEditPolygonFlag(!editPolygonFlag);
                        }
                    }

                    _leafletFeatures.push(
                        <Marker
                            key={["marker-add", polygonIndex, r, c]}
                            position={lMidPoint}
                            icon={ICON_EDIT_VERTEX_MIDPOINT}
                            eventHandlers={addVertex}
                        />
                    );
                }
            }

            _leafletFeatures.push(
                <Polygon
                    key={["edit-polygon", key, polygon[0].length, "polygon", editPolygonFlag]}
                    positions={polygon}
                    color={color}
                    stroke={false}
                />
            );
        }

        return _leafletFeatures;
    }

    function buildPolygon_eraser (polygon, polygonIndex, key, color) {
        const _leafletFeatures = [];

        if (polygon[0].length === 0) {
            return _leafletFeatures;
        }

        _leafletFeatures.push(
            <Polygon
                key={["eraser-polygon", key, polygon[0].length, "polygon", editPolygonFlag]}
                positions={polygon}
                color={color}
            />
        );

        for (const r in polygon) {
            const ring = polygon[r];
            
            for (const c in ring) {
                const evt_removeVertex = {
                    click: e => {
                        _deleteVertexAt(c);
                        setEditPolygonFlag(!editPolygonFlag);
                    }
                }
                
                _leafletFeatures.push(
                    <Marker
                        key={["delete-marker", polygonIndex, r, c]}
                        position={ring[c]}
                        icon={ICON_DELETE}
                        eventHandlers={evt_removeVertex}
                    />
                );
            }
        }

        return _leafletFeatures;
    }

    /**
     * Returns the leaflet object of the selected polygon for the select start tool.
     */
     function buildPolygon_selectStart (polygon, polygonIndex, key, color) {
        function selectMarker (ringIndex, index) {
            //polygon[ringIndex].pop(); // remove the last coordinate, which is the same as the first
            const newStart = polygon[ringIndex].splice(index, polygon[ringIndex].length - index);
            polygon[ringIndex] = [...newStart, ...polygon[ringIndex]];

            setEditPolygonFlag(!editPolygonFlag);
        }

        const _leafletFeatures = [];
        const bounds = map.getBounds();
        
        if (polygon[0].length > 0) {
            _leafletFeatures.push(
                <Polygon key={[key, polygon[0].length, "polygon"]} positions={polygon} color={color} />
            );

            for (const r in polygon) {
                const ring = polygon[r];
                for (const c in ring) {
                    const evt_selectMarker = {
                        click: e => {
                            selectMarker(r, c);
                        }
                    }

                    if (c === "0") {
                        _leafletFeatures.push(
                            <Marker
                                key={["marker", polygonIndex, r, c]}
                                position={ring[c]}
                                icon={ICON_CHOSEN_POINTER}
                            />
                        );
                    }
                    else {
                        _leafletFeatures.push(
                            <Marker
                                key={["marker", polygonIndex, r, c]}
                                position={ring[c]}
                                icon={ICON_EDIT_POINTER}
                                eventHandlers={evt_selectMarker}
                            />
                        );
                    }
                }
            }
        }

        return _leafletFeatures;
    }

    /**
     * Returns an array with the polygons in the document that are enabled.
     */
    function getEnabledPolygons () {
        return document.features.polygons.filter(p => (
            p.properties.leaflys?.enabled ?? true
        ));
    }

    /**
     * Returns an array with the enabled polygons in the document, except for
     * the one that is being edited..
     */
    function getForeignPolygons () {
        if (editedFeatureIndex !== null) {
            const editedPolygonId = document.features.polygons[editedFeatureIndex].id;
            return getEnabledPolygons().filter(p => p.id !== editedPolygonId);
        }
        else {
            console.error("[DEBUG] getForeignPolygons() was called when no feature is being edited.");
        }
    }

    /**
     * Returns the last vertex in the polygon given.
     * @param polygon The polygon on which to extract the last vertex.
     * @param isRing True if the polygon given is an array of coordinates,
     * and not an array of rings (rings are arrays of coordinates).
     */
    function getLastVertex (polygon, isRing) {
        if (isRing && polygon.length > 0) {
            return polygon.at(-1);
        }
        else if (!isRing && polygon.length > 0) {
            return polygon[0].at(-1);
        }
        return undefined;
    }

    /**
     * Returns an array containing the vertices in all active
     * foreign polygons as Turf points.
     */
    function _getForeignSnapVertices () {
        const foreignVertices = [];

        for (const p of getForeignPolygons()) {
            // remember that multi-polygon is an array of polygon.
            const multiPolygon = p.geometry.type === "MultiPolygon"
                ? p.geometry.coordinates
                : [p.geometry.coordinates];

            for (const s of multiPolygon) {
                for (const r of s) {
                    for (const c of r) {
                        foreignVertices.push(turf.point([c[0], c[1]])); // TODO: Why c[0], c[1]??
                    }
                }
            }
        }

        return foreignVertices;
    }

    /**
     * Returns an array containing the rings in all active foreign polygons.
     */
    function _getForeignSnapRings () {
        const foreignRings = [];

        for (const p of getForeignPolygons()) {
            const multiPolygon = p.geometry.type === "MultiPolygon"
                ? p.geometry.coordinates
                : [p.geometry.coordinates];

            for (const s of multiPolygon) {
                for (const r of s) {
                    if (r.length > 0) {
                        const vertices = [...r];
                        vertices.push(vertices[0]);
                        foreignRings.push(vertices);
                    }
                }
            }
        }

        return foreignRings;
    }

    function _insertVertexAt (index, vertex) {
        const newFeature = structuredClone(editedFeature);
        newFeature.polygons[editedFeatureSubpolygonIndex][0].splice(index, 0, vertex);
        setEditedFeature(newFeature);
    }

    function _replaceVertexAt (index, vertex) {
        const newFeature = structuredClone(editedFeature);
        newFeature.polygons[editedFeatureSubpolygonIndex][0].splice(index, 1, vertex);
        setEditedFeature(newFeature);
    }

    function _deleteVertexAt (index) {
        const newFeature = structuredClone(editedFeature);
        newFeature.polygons[editedFeatureSubpolygonIndex][0].splice(index, 1);
        setEditedFeature(newFeature);
    }

    /**
     * An element that controls user input to the leaflet map.
     */
    function LeafletEditInteraction () {
        const evt_click = e => {
            if (editedFeatureIndex !== null) {
                if (editor.selectedTool === POLYGON_EDITOR_TOOLS.draw) {
                    if (finishingVertex) {
                        setEditorSelectedTool(null);
                        setFinishingVertex(false);
                    }
                    else {
                        _addVertexToEditedPolygon();
                    }
                    setEditPolygonFlag(!editPolygonFlag);
                }
                else if (editor.selectedTool === POLYGON_EDITOR_TOOLS.cut) {
                    // logic to cut stuff.
                }
            }
        };
        const evt_mousemove = e => {
            if (editedFeatureIndex === null) return;
            if (!editor.selectedTool === POLYGON_EDITOR_TOOLS.draw
                && !editor.selectedTool === POLYGON_EDITOR_TOOLS.cut) {
                return;
            }

            const currentSubpoly = editedFeature.polygons[editedFeatureSubpolygonIndex][0];
            const straightLineMode = keys.shift;
            const snapDisabledByKey = keys.ctrl;

            let markerPos = undefined; // when this variable is assigned, no further attempts to snap will be made.
            let snappedToWhat = undefined; // what the cursor snapped to.

            let lastVertex = getLastVertex(currentSubpoly, true); // TODO: use editCutPolygon for cut tool.

            // make markerPos form the straight line that is closer to the mouse.
            if (straightLineMode && lastVertex) {
                const distLat = e.latlng.lat - lastVertex.lat;
                const distLng = e.latlng.lng - lastVertex.lng;

                if (Math.abs(distLat) < Math.abs(distLng)) {
                    markerPos = { lat: lastVertex.lat, lng: e.latlng.lng };
                }
                else {
                    markerPos = { lat: e.latlng.lat, lng: lastVertex.lng };
                }
            }

            // if snapping is disabled by pressing ctrl, then it'll only
            // snap to the first point (which closes the polygon).
            if (!markerPos && !snapDisabledByKey) {
                const pxCursor = map.latLngToLayerPoint(e.latlng);

                // if the cursor is near the initial point, snap to it,
                // even if snapping is disabled by key.
                let lFinishPoint;

                if (editor.selectedTool === POLYGON_EDITOR_TOOLS.draw) {
                    if (currentSubpoly.length > 2) {
                        lFinishPoint = currentSubpoly[0];
                    }
                }
                // else if cut
                else {
                    lFinishPoint = undefined;
                }

                // if the cursor is close enoguh to the first coordinate,
                // it'll snap to it and activate the "finish edit" flag.
                if (lFinishPoint) {
                    const lFirstCoord = lFinishPoint;
                    const pxFirst = map.latLngToLayerPoint(lFirstCoord);
                    if (MathUtil.vec2distance(pxCursor, pxFirst) < editor.snapDistance) {
                        setFinishingVertex(true);
                        markerPos = lFirstCoord;
                    }
                    else {
                        setFinishingVertex(false);
                    }
                }

                // if shapes are enabled, snapping is enabled, and the marker
                // isn't already set to close.
                if (!markerPos && editor.snap && editor.showForeignFeatures) {
                    const turfCursor = turf.point([e.latlng.lng, e.latlng.lat]);
                    const nearestPoint = turf.nearest(turfCursor, editSnapVertices);

                    // snap to vertex
                    if (nearestPoint) {
                        const lNearest = ToLeaflet.coord(nearestPoint.geometry.coordinates);
                        const pxNearest = map.latLngToLayerPoint(lNearest);

                        if (MathUtil.vec2distance(pxCursor, pxNearest) < editor.snapDistance) {
                            markerPos = lNearest;
                            snappedToWhat = "vertex";
                        }
                    }
                    // snap to perimeter
                    if (!markerPos) {
                        const nearestInLine = nearestPointOnLine(editSnapRings, turfCursor);
                        const lNearestInLine = ToLeaflet.coord(nearestInLine.geometry.coordinates);
                        const pxNearestInLine = map.latLngToLayerPoint(lNearestInLine);

                        if (MathUtil.vec2distance(pxCursor, pxNearestInLine) < editor.snapDistance) {
                            markerPos = lNearestInLine;
                        }
                    }
                }
            }

            // if we still don't have a marker pos, then it's the cursor's pos.
            markerPos ??= e.latlng;
            setEditMarkerCoords(markerPos);

            if (keys.z && lastVertex && markerPos) {
                _leftMouseInteraction(lastVertex, markerPos, snappedToWhat);
            }

        }

        const map = useMapEvents({
            click: evt_click,
            mousemove: evt_mousemove,
        });
    
        return null;
    }

    return {
        $layoutImages,
        /** An array containing the polygons that are not being edited right now. */
        $backgroundPolygons,
        /**
         * An array containing the polygon that is being edited right now. This
         * array will be empty if no polygon is being edited. A check is not necessary.
         */
        $editedPolygons,
        $editionElementsDraw,
        getEnabledPolygons,
        getForeignPolygons,
        map,
        setMap,
        LeafletEditInteraction,
        editPolygonFlag,
        setEditPolygonFlag,
        editMarkerCoords,
        setEditMarkerCoords,
        editSnapVertices,
        editSnapRings,
    }

    /**
     * Adds a vertex at the end of the currently edited subpolygon, in the position,
     * defined by the editMarkerCoords variable.
     */
    function _addVertexToEditedPolygon () {
        const updatedFeature = structuredClone(editedFeature);
        updatedFeature.polygons[editedFeatureSubpolygonIndex][0].push(editMarkerCoords);
        setEditedFeature(updatedFeature);
    }

    function _leftMouseInteraction (lastVertex, markerPos, snappedToWhat) {
        if (editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.draw) {
            const pxLast = map.latLngToLayerPoint(lastVertex);
            const pxMarker = map.latLngToLayerPoint(markerPos);

            if (MathUtil.vec2distance(pxLast, pxMarker) > editor.pencilStep) {
                _addVertexToEditedPolygon();
            }
        }
        else if (editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.snap
            && snappedToWhat === "vertex"
        ) {
            if (!(lastVertex.lat === markerPos.lat && lastVertex.lng === markerPos.lng)) {
                _addVertexToEditedPolygon();
            }
        }
    }
}

export default useLeafletElementContainer;