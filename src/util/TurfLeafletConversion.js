import turf from "turf";

export const ToGeoJSON = {
    /**
     * Transforms an array of subpolygons into a GeoJSON feature.
     * @param {*} subpolygonArray The array of subpolygons.
     */
    polygon: (subpolygonArray) => {
        const multiPolygon = subpolygonArray.length !== 1;
    
        const _shapes = []; // the shapes that will be used for the geojson polygon.
        for (const s of subpolygonArray) {
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
    },
    /**
     * Transform a Leaflet coordinate object into a GeoJSON coordinate array.
     * @param {*} array The Leaflet coordinate.
     */
    coord: (object) => {
        return [object.lng, object.lat];
    },
}

export const ToLeaflet = {
    /**
     * Transform a GeoJSON Polygon or MultiPolygon feature object into an array
     * of subpolygons.
     * @param {*} feature The GeoJSON feature to transform.
     */
    polygon: (feature) => {
        const polyType = feature.geometry.type;
        const polyShapes = []; // the shapes contained in the geojson polygon.
        if (polyType === "MultiPolygon") {
            for (const s of feature.geometry.coordinates) {
                polyShapes.push(s);
            }
        }
        else if (polyType === "Polygon") {
            polyShapes.push(feature.geometry.coordinates);
        }
        else {
            console.error(`Unknown polygon type (${polyType}). The geojson associated with this polygon may be corrupt.`);
            return null;
        }
    
        const _subPolygons = []; // the shapes as leaflet latlng objects.
        for (const subpoly of polyShapes) {
            const _rings = [];
            for (const ring of subpoly) {
                const _vertices = ring.map(c => ({lat: c[1], lng: c[0]}));
                _vertices.pop();
                _rings.push(_vertices);
            }
            _subPolygons.push(_rings);
        }
    
        return _subPolygons;
    },
    /**
     * Transform a GeoJSON coordinate array into a Leaflet coordinate object.
     * @param {*} array The GeoJSON coordinate.
     */
    coord: (array) => {
        return {
            lat: array[1],
            lng: array[0],
        };
    },
}