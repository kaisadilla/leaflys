import React from 'react';
import Button from '../../elements/Button';
import Checkbox from '../../elements/Checkbox';
import InputCombo from '../../elements/InputCombo';
import Slider from '../../elements/Slider';
import { POLYGON_EDITOR_TOOLS, POLYGON_EDITOR_TOOL_MODES, useUIContext } from '../../logic/useUIContext';
import { POLYGON_EDITOR_MARKER_SIZE, POLYGON_EDITOR_PENCIL_STEP, POLYGON_EDITOR_SNAP_DISTANCE, POLYGON_EDITOR_SNAP_DISTANCE_MAX, POLYGON_EDITOR_SNAP_DISTANCE_MIN } from '../../global';
import { useDocumentContext } from '../../logic/useDocumentContext';
import Dropdown from '../../elements/Dropdown';

function DeleteOverlapOptions (props) {
    const { document } = useDocumentContext();

    const {
        editor,
        setEditorSelectedToolMode,
        setEditorSnap,
        setEditorShowForeignFeatures,
        setEditorSnapDistance,
        setEditorMarkerSize,
        setEditorPencilStep,
    } = useUIContext();

    const evt_snap = (evt) => setEditorSnap(evt.target.checked);
    const evt_foreignFeatures = (evt) => setEditorShowForeignFeatures(evt.target.checked);
    const evt_snapDistance = (evt) => setEditorSnapDistance(parseFloat(evt.target.value));
    const evt_markerSize = (evt) => setEditorMarkerSize(parseFloat(evt.target.value));
    const evt_pencilStep = (evt) => setEditorPencilStep(parseFloat(evt.target.value));

    if (editor.selectedTool !== POLYGON_EDITOR_TOOLS.deleteOverlap) return <></>

    return (
        <>
            <h2 className="control-panel-header">Cut shape options</h2>
            <div className="tool-options">
                <select>
                    {
                        document.features.polygons.map(p => (
                            <option>{p.properties.name}</option>
                        ))
                    }
                </select>
                <InputCombo>
                    <label htmlFor="select-polygon">Select polygon</label>
                    <Dropdown label={document.features.polygons[0].properties.name + "adfsagasfh awh awrhhwr "}>
                        {
                            document.features.polygons.map(p => (
                                <Dropdown.Item>
                                    {p.properties.name}
                                </Dropdown.Item>
                            ))
                        }
                    </Dropdown>
                </InputCombo>
            </div>
        </>
    );
}

export default DeleteOverlapOptions;