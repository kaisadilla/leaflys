import { Marker, Polygon, Polyline } from "react-leaflet";
import { getElementsBetween } from "./Util";

function buildPolygon (polygon, key, color, eventHandlers = null) {
    return (
        <Polygon key={key} positions={polygon} color={color} eventHandlers={eventHandlers} />
    );
}

/**
 * Returns the leaflet object of the selected polygon for the draw tool.
 * @param {*} polygon The polygon to render.
 * @param {*} key A unique key to use for elements of this polygon.
 * @param {*} color The color of this polygon.
 * @param {*} vertexIcon The icon to use for the vertices of this polygon.
 * @param {*} bounds The bounds of the map. If defined, only vertices within
 * these bounds will be rendered.
 */
function buildPolygon_draw (polygon, key, color, vertexIcon, bounds = null) {
    const _leafletFeatures = [];
    
    if (polygon[0].length > 0) {
        for (const r in polygon) {
            const ring = polygon[r];
            for (const c in ring) {
                if (!bounds || bounds.contains(ring[c])) {
                    _leafletFeatures.push(
                        <Marker key={["marker", key, r, c]} position={ring[c]} icon={vertexIcon} />
                    );
                }
                if (r !== 0) {
                    <Marker key={["marker", key, r, c]} position={ring[0]} icon={vertexIcon} />
                }
            }

            _leafletFeatures.push(
                <Polyline key={["line", key, r, ring.length]} positions={ring} color={color} />
            );
        }

        _leafletFeatures.push(
            <Polygon key={[key, polygon[0].length, "polygon"]} positions={polygon} color={color} stroke={false} />,
        );
    }

    return _leafletFeatures;
}

/**
 * Draws a polygon for edition mode, rendering corners and midpoints.
 * @param {*} polygon The polygon to render.
 * @param {*} key The key for this polygon.
 * @param {*} color The color of this polygon.
 * @param {*} dragIcon An icon for the corners of the polygon.
 * @param {*} createIcon An icon for the midpoints of each polygon side.
 * @param {replaceVertexFunc} replaceVertexFunc A function to replace vertices in the polygon.
 * @param {insertVertexFunc} insertVertexFunc A function to insert vertices into the polygon.
 * 
 * @callback replaceVertexFunc
 * @param {*} index The position in the polygon array.
 * @param {*} position The new position for the vertex.
 * 
 * @callback insertVertexFunc
 * @param {*} index The position in the polygon array.
 * @param {*} position The position for the vertex.
 */
function buildPolygon_edit (polygon, key, color, dragIcon, createIcon, replaceVertexFunc, insertVertexFunc) {
    const _leafletFeatures = [];

    if (polygon[0].length > 0) {
        for (const r in polygon) {
            const ring = polygon[r];
            
            for (const c in ring) {
                const dragVertex = {
                    dragend: e => {
                        replaceVertexFunc(c, e.target._latlng);
                    }
                }
                
                _leafletFeatures.push(
                    <Marker
                        key={["marker", key, r, c]}
                        position={ring[c]}
                        icon={dragIcon}
                        eventHandlers={dragVertex}
                        draggable={true}
                    />
                );

                const thisRing = ring[c];
                const lastRing = c === "0" ? ring[ring.length - 1] : ring[c - 1];

                _leafletFeatures.push(
                    <Polyline
                        key={["line", key, r, c]}
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
                        insertVertexFunc(c, lMidPoint);
                    }
                }

                _leafletFeatures.push(
                    <Marker
                        key={["marker-add", key, r, c]}
                        position={lMidPoint}
                        icon={createIcon}
                        eventHandlers={addVertex}
                    />
                );
            }
        }

        _leafletFeatures.push(
            <Polygon
                key={["edit-polygon", key, polygon[0].length, "polygon", /*editPolygonFlag*/]}
                positions={polygon}
                color={color}
                stroke={false}
            />
        );
    }

    return _leafletFeatures;
}

/**
 * Draws a polygon for delete mode.
 * @param {*} polygon The polygon to render.
 * @param {*} key The key for this polygon.
 * @param {*} color The color of this polygon.
 * @param {*} deleteIcon The icon of the delete markers.
 * @param {deleteVertexFunc} deleteVertexFunc A function to delete vertices from the polygon.
 * 
 * @callback deleteVertexFunc
 * @param {*} index The position in the polygon array.
 * @returns 
 */
function buildPolygon_delete (polygon, key, color, deleteIcon, deleteVertexFunc) {
    const _leafletFeatures = [];

    if (polygon[0].length === 0) {
        return _leafletFeatures;
    }

    _leafletFeatures.push(
        <Polygon
            key={["eraser-polygon", key, polygon[0].length, "polygon"]}
            positions={polygon}
            color={color}
        />
    );

    for (const r in polygon) {
        const ring = polygon[r];
        
        for (const c in ring) {
            const evt_removeVertex = {
                click: e => {
                    deleteVertexFunc(c);
                }
            }
            
            _leafletFeatures.push(
                <Marker
                    key={["delete-marker", key, r, c]}
                    position={ring[c]}
                    icon={deleteIcon}
                    eventHandlers={evt_removeVertex}
                />
            );
        }
    }

    return _leafletFeatures;
}

/**
 * Draws a polygon for delete mode.
 * @param {*} polygon The polygon to render.
 * @param {*} key The key for this polygon.
 * @param {*} color The color of this polygon.
 * @param {*} vertexIcon The icon of the vertex markers.
 * @param {*} highlightIcon The icon for markers of vertices that will be deleted.
 * @param {*} selectedIcon The icon of the chosen vertex markers.
 * @param {*} selectedVertices An array of selected vertices.
 * @param {bool} direction "true" for forward, "false" for backward.
 * @param {selectVertexFunc} selectVertexFunc A function to call when a vertex is clicked.
 * 
 * @callback selectVertexFunc
 * @param {*} index The position of the vertex in the polygon array.
 * @returns 
 */
function buildPolygon_deletePath (
    polygon, key, color, vertexIcon, highlightIcon, selectedIcon,
    selectedVertices, direction, selectVertexFunc
) {
    if (polygon[0].length === 0) return [];

    const _leafletFeatures = [];

    _leafletFeatures.push(
        <Polygon
            key={["eraser-polygon", key, polygon[0].length, "polygon"]}
            positions={polygon}
            color={color}
        />
    );

    /** An array with the indices of the vertices inside the path between
     * the two selected vertices.
     */
    let highlightedVertices = [];
    /** An array with the vertices inside the path. */
    let pathDeleted = [];

    // calculate the vertices that will be deleted.
    if (selectedVertices.length === 2) {
        const arrays = getElementsBetween(polygon[0], ...selectedVertices, direction);
        highlightedVertices = arrays.indices;
        pathDeleted = arrays.elements;

        _leafletFeatures.push(
            <Polyline
                key={["selectedLine", key, selectedVertices, direction]}
                positions={pathDeleted}
                color={"#ff0000"}
            />
        );
    }

    for (const r in polygon) {
        const ring = polygon[r];
        
        for (const c in ring) {
            const cInt = Number.parseInt(c);

            const evt_clickMarker = {
                click: e => {
                    selectVertexFunc(cInt);
                }
            }

            let icon = vertexIcon;
            if (r === "0") {
                if (selectedVertices.includes(cInt)) {
                    icon = selectedIcon;
                }
                else if (highlightedVertices.includes(cInt)) {
                    icon = highlightIcon;
                }
            }
            
            _leafletFeatures.push(
                <Marker
                    key={["delete-marker", key, r, c]}
                    position={ring[c]}
                    icon={icon}
                    eventHandlers={evt_clickMarker}
                />
            );
        }
    }

    return _leafletFeatures;
}

/**
 * Returns the leaflet object of the selected polygon for the select start tool.
 * @param {*} polygon The polygon to render.
 * @param {*} key The key for this polygon.
 * @param {*} color The color of this polygon.
 * @param {*} vertexIcon The icon to use in normal vertices.
 * @param {*} chosenVertexIcon The icon to use in the selected vertex. 
 * @param {selectVertexFunc} selectVertexFunc A function to delete vertices from the polygon.
 * 
 * @callback selectVertexFunc
 * @param {*} ringIndex The ring on which the vertex was selected.
 * @param {*} index The position in the polygon array.
 * @returns 
 */
function buildPolygon_selectEnd (polygon, key, color, vertexIcon, chosenVertexIcon, selectVertexFunc) {
    const _leafletFeatures = [];
    
    if (polygon[0].length > 0) {
        _leafletFeatures.push(
            <Polygon key={["selectStart", key, polygon[0].length]} positions={polygon} color={color} />
        );

        for (const r in polygon) {
            const ring = polygon[r];
            for (const c in ring) {
                const evt_selectMarker = {
                    click: e => {
                        selectVertexFunc(Number.parseInt(r), Number.parseInt(c));
                    }
                }

                if (c === (ring.length -1).toString()) {
                    _leafletFeatures.push(
                        <Marker
                            key={["marker", key, r, c]}
                            position={ring[c]}
                            icon={chosenVertexIcon}
                        />
                    );
                }
                else {
                    _leafletFeatures.push(
                        <Marker
                            key={["marker", key, r, c]}
                            position={ring[c]}
                            icon={vertexIcon}
                            eventHandlers={evt_selectMarker}
                        />
                    );
                }
            }
        }
    }

    return _leafletFeatures;
}

const DrawFeature = {
    polygon: {
        normal: buildPolygon,
        drawMode: buildPolygon_draw,
        editMode: buildPolygon_edit,
        deleteMode: buildPolygon_delete,
        deletePathMode: buildPolygon_deletePath,
        selectEnd: buildPolygon_selectEnd
    }
}

export default DrawFeature;