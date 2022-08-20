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
 * Returns the first polygon given, with all of the area of the
 * second polygon added to it. Be aware that, due to a bug in Turf's
 * line intersection calculation, the resulting cut may not be precise.
 * @param {*} poly1 The polygon to add to.
 * @param {*} poly2 The polygon whose area will be added to the first.
 * @returns 
 */
export function polygonUnion (poly1, poly2) {
    const fusedPoly = turf.union(poly1, poly2);
    return fusedPoly;
}

/**
 * Returns the intersection between the two polygons.
 * Be aware that, due to a bug in Turf's
 * line intersection calculation, the resulting cut may not be precise.
 * @param {*} poly1 The first polygon.
 * @param {*} poly2 The second polygon.
 * @returns 
 */
export function polygonIntersect (poly1, poly2) {
    const intersection = turf.intersect(poly1, poly2);
    return intersection;
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

/**
 * Given an array and an index, returns a new array that starts at the
 * new index given, appending the elements before that index to the end.
 * @param {*} arr The array to manipulate
 * @param {*} newIndex The index of the element that will now be at the start.
 * @returns A new array containing the items rearranged.
 */
export function setNewArrayStart (arr, newIndex) {
    arr = [...arr];
    const newStart = arr.splice(newIndex, arr.length - newIndex);
    arr = [...newStart, ...arr];

    return arr;
}

/**
 * Given an array, selects all elements that are between two indices. If the second
 * index is smaller than the first, the function will roll over to the start to
 * keep going until it reaches the end index.
 * @param {*} arr The array to search.
 * @param {*} start The index of the first element.
 * @param {*} end The index of the last element (inclusive).
 * @param {*} direction True to go forward, false to go backwards.
 * @returns An object containing an array with all the elements selected, and
 * another array with all indices selected.
 */
export function getElementsBetween (arr, start, end, direction = true) {
    let i = start;
    const elements = [];
    const indices = [];

    while (true) {
        if (direction === true) {
            i++;
            if (i > arr.length - 1) i = 0;
        }
        else {
            i--;
            if (i === 0) i = arr.length - 1;
        }

        elements.push(arr[i]);
        indices.push(i);

        if (i === end) break;
    }

    return {
        elements,
        indices
    };
}

/**
 * Gets all the polygons in the array, in alphabetical order, that are enabled.
 * @param {*} polygonArray The polygon array in the document.
 * @param {*} excludeIdArray Optionally, an array of ids of polygons to exclude.
 */
export function getSortedActivePolygons (polygonArray, excludeIdArray) {
    return [...polygonArray]
        // enabled polygons that are not in the exclude array.
        .filter(p => {
            const enabled = p.properties.leaflys.enabled ?? true;
            const notExcluded = !excludeIdArray || !excludeIdArray.includes(p.id);

            return enabled && notExcluded;
        })
        // sort alphabetically.
        .sort((a, b) => a.properties.name.localeCompare(b.properties.name));
}