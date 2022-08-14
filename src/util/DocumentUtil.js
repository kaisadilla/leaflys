import { saveAs } from "file-saver";
import { ToGeoJSON } from "./TurfLeafletConversion";

function getNewDocument () {
    return {
        "settings": getNewDocumentSettings(),
        "features": {
            "markers": [],
            "lines": [],
            "polygons": [],
        }
    };
}

function getNewDocumentSettings () {
    return {
        "group-by-categories": true,
        "show-category-color": true,
        "categories": [
    
        ],
        "colors": {
            "default-color": "#3388ff",
            "active-color": "#ff9500",
            "inactive-color": "#3388ff",
            "foreign-color": "#222222",
            "delete-color": "#ff0000"
        },
    };
}

function getNewPolygon (name, category, id) {
    return {
        "type": "Feature",
        "id": id,
        "properties": {
            "shape": "Polygon",
            "name": name,
            "category": category,
            "leaflys": getNewPolygonSettings()
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    
                ]
            ]
        }
    };
}

function getNewPolygonSettings () {
    return {
        "enabled": true,
    };
}

function getNewLayoutImage (fileName, base64) {
    return {
        name: fileName,
        base64,
        northEast: { lat: 20, lng: 0 },
        southWest: { lat: 0, lng: 20 },
        opacity: 0.5,
    }
}

function getExamplePolygon () {
    return {
        "type": "Feature",
        "id": crypto.randomUUID(),
        "properties": {
            "name": "Sample feature",
            "category": "default",
            "leaflys": getNewPolygonSettings()
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [44.866462, 40.178873],
                    [45.7456, 36.102376],
                    [32.558527, 24.846565],
                    [49.350067, 30.524413],
                    [58.317277, 35.960223],
                    [48.470928, 40.111689],
                    [44.866462, 40.178873]
                ]
            ]
        }
    };
}

function getExampleDocument () {
    const doc = getNewDocument();
    doc.features.polygons.push(getExamplePolygon());
    return doc;
}

function formatGeojsonCoords (json) {
    const regexCoords = /\[[\n\r\s]+[0-9\-,.]+[\n\r\s]+[0-9\-,.]+[\n\r\s]+]/g;
    return json.replace(regexCoords, e => {
        const coords = e.replace("[", "").replace("]", "").split(",");
        const lng = coords[0].trim();
        const lat = coords[1].trim();
        return `[${lng}, ${lat}]`;
    });
}

/**
 * Converts the data of a polygon's edition into a Leaflys GeoJSON object.
 * @param {*} baseFeature The unedited GeoJSON feature stored in the document.
 * @param {*} editedPolygon The object containing the edition data for the polygon.
 */
function savePolygonEdit (baseFeature, editedPolygon) {
    const turfJSON = ToGeoJSON.polygon(editedPolygon.polygons);
    const newFeature = structuredClone(baseFeature);

    newFeature.properties.name = editedPolygon.name;
    newFeature.properties.category = editedPolygon.category;
    newFeature.id = editedPolygon.id;
    newFeature.geometry.type = turfJSON.geometry.type;
    newFeature.geometry.coordinates = turfJSON.geometry.coordinates;

    return newFeature;
}

function copyToClipboard (text) {
    navigator.clipboard.writeText(text);
}

function saveAsFile (fileName, content) {
    const blob = new Blob([content], {
        type: "text/plain;charset=utf-8"
    });
    saveAs(blob, fileName);
}

const DocumentUtil = {
    getNew: {
        document: getNewDocument,
        documentSettings: getNewDocumentSettings,
        layoutImage: getNewLayoutImage,
        polygon: getNewPolygon,
        polygonSettings: getNewPolygonSettings,
    },
    getExample: {
        document: getExampleDocument,
        polygon: getExamplePolygon,
    },
    savePolygonEdit,
    formatGeojsonCoords,
    copyToClipboard,
    saveAsFile,
};

export default DocumentUtil;