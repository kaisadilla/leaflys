/**
 * A single integer number that only changes when the structure of the
 * document object is changed.
 */
export const CURRENT_DOCUMENT_VERSION = 2;

export const DEFAULT_ZOOM = 2;
export const DEFAULT_MAP_CENTER = [18, 40];
export const DEFAULT_EDITOR_OVERLAY_LAT = 2.5;
export const DEFAULT_EDITOR_OVERLAY_LONG = 14;

export const POLYGON_EDITOR_SNAP_DISTANCE = {
    min: 0,
    max: 100,
};
export const POLYGON_EDITOR_MARKER_SIZE = {
    min: 4,
    max: 32,
};
export const POLYGON_EDITOR_PENCIL_STEP = {
    min: 1,
    max: 100,
};