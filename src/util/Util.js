import turf from "turf";
import { ToGeoJSON } from "./TurfLeafletConversion";

/**
 * Returns the first polygon given, with all of the area of the
 * second polygon clipped from it. Be aware that, due to a bug in Turf's
 * line intersection calculation, the resulting cut may not be precise.
 * @param {*} target The polygon to cut from.
 * @param {*} clipper The polygon whose shape will be clipped from the first.
 */
export function clipPolygon (target, clipper) {
    const clippedPoly = turf.difference(target, clipper);
    return clippedPoly;
}

/**
 * Calculates the area of a set of EDITOR polygons (not geojson).
 * @param {*} subpolygonArray The polygons array in the edited feature.
 * @returns The area of the polygons, in squared meters.
 */
export function calculateEditedArea (subpolygonArray) {
    try {
        const geojson = ToGeoJSON.polygon(subpolygonArray);
        return turf.area(geojson);
    }
    catch {
        return 0;
    }
}

/**
 * Calculates the number of vertices present in an array of EDITOR polygons.
 * @param {*} polygons The polygons array in the edited feature.
 */
export function calculateEditedVertices (polygons) {
    let count = 0;

    for (const poly of polygons) {
        for (const ring of poly) {
            count += ring.length;
        }
    }

    return count;
}