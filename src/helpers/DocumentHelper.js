import { saveAs } from "file-saver";

function blankDocument () {
    return {
        "settings": templateDocumentSettings(),
        "features": {
            "markers": [],
            "lines": [],
            "polygons": [],
        }
    };
}

function templateDocumentSettings () {
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

function examplePolygon () {
    return {
        "type": "Feature",
        "id": crypto.randomUUID(),
        "properties": {
            "name": "Sample feature",
            "category": "default",
            "leaflys": templatePolygonSettings()
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

function templatePolygonSettings () {
    return {
        "enabled": true,
    };
}

function exampleDocument () {
    const doc = blankDocument();
    doc.features.polygons.push(examplePolygon());
    return doc;
}

function newPolygon (name, category, id) {
    return {
        "type": "Feature",
        "id": id,
        "properties": {
            "shape": "Polygon",
            "name": name,
            "category": category,
            "leaflys": templatePolygonSettings()
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

function formatGeojsonCoords (json) {
    const regexCoords = /\[[\n\r\s]+[0-9\-,.]+[\n\r\s]+[0-9\-,.]+[\n\r\s]+]/g;
    return json.replace(regexCoords, e => {
        const coords = e.replace("[", "").replace("]", "").split(",");
        const lng = coords[0].trim();
        const lat = coords[1].trim();
        return `[${lng}, ${lat}]`;
    });
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

const DocumentHelper = {
    getTemplate: {
        blankDocument,
        document: exampleDocument,
        polygon: examplePolygon,
        documentSettings: templateDocumentSettings,
        polygonSettings: templatePolygonSettings,
    },
    getNew: {
        polygon: newPolygon,
    },
    formatGeojsonCoords,
    copyToClipboard,
    saveAsFile,
};

export default DocumentHelper;