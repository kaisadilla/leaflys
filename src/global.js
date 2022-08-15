/**
 * A single integer number that only changes when the structure of the
 * document object is changed.
 */
export const CURRENT_DOCUMENT_VERSION = 2;

export const DEFAULT_ZOOM = 2;
export const DEFAULT_MAP_CENTER = [18, 40];
export const DEFAULT_EDITOR_OVERLAY_LAT = 2.5;
export const DEFAULT_EDITOR_OVERLAY_LONG = 14;

export const DEFAULT_SNAP_DISTANCE = 25;
export const DEFAULT_MARKER_SIZE = 12;
export const DEFAULT_PENCIL_STEP = 20;

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

export const EDITOR_MODES = {
    mapEditor: 0,
    spreadsheet: 1,
}

export const EDITOR_MODES_NAMES = {
    [EDITOR_MODES.mapEditor]: "Map editor",
    [EDITOR_MODES.spreadsheet]: "Spreadsheet",
}

export const POLYGON_TOOLS = {
    draw: 0,
    edit: 1,
    cut: 2,
    eraser: 3,
    move: 4,
    selectEnd: 5,
    deleteOverlap: 6,
}

export const POLYGON_TOOL_MODES = {
    place: 0,
    draw: 1,
    snap: 2,
    pickOne: 3,
    path: 4,
}

export const HELP_MESSAGE_TOOL_DRAW =
    "Click anywhere on the map to add the next vertex of your polygon. " +
    "When you are done, click on the first vertex of the polygon to close " +
    "it, or simply deselect the draw tool to let it close automatically.";

export const HELP_MESSAGE_TOOL_EDIT =
    "Click and drag the big markers to move the corners of your polygon, " +
    "or click the small markers to place new corners in their position.";

export const HELP_MESSAGE_TOOL_CUT =
    "Draw a polygon normally. This polygon will be cut from your current " +
    "active subpolygon!";

export const HELP_MESSAGE_TOOL_ERASER =
    "Click on a vertex in your polygon to delete it.";

export const HELP_MESSAGE_TOOL_MOVE =
    "Drag your polygon to place it elsewhere on the map.";

export const HELP_MESSAGE_TOOL_SELECT_START =
    "Select one of the vertices to set it at the new first vertex of " +
    "your polygon!";

export const HELP_MESSAGE_TOOL_DELETE_OVERLAP =
    "Select another polygon by clicking it on the map or choosing it on " +
    "the menu below. Then press \"Carve\" to cut that polygon from yours!";

export const HELP_MESSAGE_TOOL_DRAW_DRAW_LINE =
    "Press and hold 'Z' to draw a line of vertices.";
//    "Press and hold left click to draw a line of vertices. To move the " +
//    "map while in this mode, simply hold Ctrl before dragging the map.";

export const HELP_MESSAGE_TOOL_DRAW_SNAP =
    "Press and hold left click. When you move your mouse near a foreign " +
    "vertex, a vertex will be placed.";

export const HELP_MESSAGE_TOOL_ERASER_DELETE_PATH =
    "Select two vertices from your polygon and accept to delete all " +
    "highlighted vertices in between.";