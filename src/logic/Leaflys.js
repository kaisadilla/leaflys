import turf from "turf";
import { Turflet } from "./Turflet";

/**
 * Returns the first polygon passed, with all of the area of the
 * second polygon clipped from it.
 * @param {*} target The polygon to cut from.
 * @param {*} clipper The polygon whose shape will be clipped from the first.
 */
export function clipPolygon (target, clipper) {
    const clippedPoly = turf.difference(target, clipper);
    return clippedPoly;
}

export function calculateEditedArea (polygons) {
    try {
        const geojson = Turflet.polygon.leafletToGeojson(polygons);
        return turf.area(geojson);
    }
    catch {
        return 0;
    }
}

export function calculateEditedVertices (polygons) {
    let count = 0;

    for (const poly of polygons) {
        for (const ring of poly) {
            count += ring.length;
        }
    }

    return count;
}