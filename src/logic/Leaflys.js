import turf from "turf";

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