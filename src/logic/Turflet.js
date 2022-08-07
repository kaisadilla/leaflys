import turf from "turf";

function polygon_geojsonToLeaflet (polygon) {
    const polyType = polygon.geometry.type;
    const polyShapes = []; // the shapes contained in the geojson polygon.
    if (polyType === "MultiPolygon") {
        for (const s of polygon.geometry.coordinates) {
            polyShapes.push(s);
        }
    }
    else if (polyType === "Polygon") {
        polyShapes.push(polygon.geometry.coordinates);
    }
    else {
        console.error(`Unknown polygon type (${polyType}). The geojson associated with this polygon may be corrupt.`);
        return null;
    }

    const _shapes = []; // the shapes as leaflet latlng objects.
    for (const s of polyShapes) {
        const _rings = [];
        for (const r of s) {
            const _vertices = r.map(c => ({lat: c[1], lng: c[0]}));
            _vertices.pop();
            _rings.push(_vertices);
        }
        _shapes.push(_rings);
    }

    return _shapes;
}

function polygon_leafletToGeojson (polygon) {
    const multiPolygon = polygon.length !== 1;

    const _shapes = []; // the shapes that will be used for the geojson polygon.
    for (const s of polygon) {
        const _rings = [];
        for (const r of s) {
            const _vertices = r.map(c => [c.lng, c.lat]);
            if (_vertices.length > 0) {
                _vertices.push(_vertices[0]);
            }

            _rings.push(_vertices);
        }
        _shapes.push(_rings);
    }

    return multiPolygon ? turf.multiPolygon(_shapes) : turf.polygon(_shapes[0]);
}

export const Turflet = {
    polygon: {
        /**
        * Transforms a geojson polygon into an array of latlng coordinates.
        */
        geojsonToLeaflet: polygon_geojsonToLeaflet,
        /**
         * Transforms an array of latlng coordinates into a geojson object,
         * automatically calculating whether it's a polygon or a multipolygon.
         */
        leafletToGeojson: polygon_leafletToGeojson,
    }
};