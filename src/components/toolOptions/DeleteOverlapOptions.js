import React, { useState } from 'react';
import Button from '../../elements/Button';
import Checkbox from '../../elements/Checkbox';
import InputCombo from '../../elements/InputCombo';
import Slider from '../../elements/Slider';
import { POLYGON_EDITOR_TOOLS, POLYGON_EDITOR_TOOL_MODES, useUIContext } from '../../logic/useUIContext';
import { HELP_MESSAGE_TOOL_DELETE_OVERLAP, POLYGON_EDITOR_MARKER_SIZE, POLYGON_EDITOR_PENCIL_STEP, POLYGON_EDITOR_SNAP_DISTANCE, POLYGON_EDITOR_SNAP_DISTANCE_MAX, POLYGON_EDITOR_SNAP_DISTANCE_MIN } from '../../global';
import { useDocumentContext } from '../../logic/useDocumentContext';
import Dropdown from '../../elements/Dropdown';
import { clipPolygon } from '../../util/Util';
import { useStateCallback } from '../../ext/useStateCallback';
import { ToGeoJSON } from '../../util/TurfLeafletConversion';

function DeleteOverlapOptions (props) {
    const {
        document,
        getPolygonById,
        forceRedrawFlag,
    } = useDocumentContext();

    const {
        editor,
        editedFeature,
        setEditedFeatureGeometry
    } = useUIContext();

    const sortedPolygons = [...document.features.polygons]
        // enabled polygons that are not the currently edited polygon.
        .filter((p => (p.properties.leaflys.enabled ?? true) && (p.id !== editedFeature.id)))
        // sort alphabetically.
        .sort((a, b) => a.properties.name.localeCompare(b.properties.name));

    const firstPolyInList = sortedPolygons[0] ? sortedPolygons[0].id : null;
    const [ selectedPoly, setSelectedPoly ] = useStateCallback(firstPolyInList);

    if (editor.selectedTool !== POLYGON_EDITOR_TOOLS.deleteOverlap) return <></>

    const evt_carve = (evt) => {
        if (selectedPoly !== null) {
            const geojson = ToGeoJSON.polygon(editedFeature.polygons);
            const newGeojson = clipPolygon(geojson, getPolygonById(selectedPoly));
            setEditedFeatureGeometry(newGeojson);
        }
    };

    return (
        <>
            <h2 className="control-panel-header">Clip overlapping polygon tool</h2>
            <div className="help">
                <p><i>{HELP_MESSAGE_TOOL_DELETE_OVERLAP}</i></p>
            </div>
            <div className="tool-options">
                <InputCombo>
                    <label htmlFor="delete-overlap-list">Polygon to clip: </label>
                    <select 
                        id="delete-overlap-list"
                        value={selectedPoly}
                        onChange={e => setSelectedPoly(e.target.value)}
                    >
                        {
                            sortedPolygons.map(p => (
                                <option key={p.id} value={p.id}>{p.properties.name}</option>
                            ))
                        }
                    </select>
                </InputCombo>
                <div className="options-control-bar">
                    <Button baseStyle="danger" label="Carve" onClick={evt_carve} />
                </div>
            </div>
        </>
    );
}

export default DeleteOverlapOptions;