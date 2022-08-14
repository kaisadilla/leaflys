import React from 'react';
import Button from '../../elements/Button';
import Checkbox from '../../elements/Checkbox';
import InputCombo from '../../elements/InputCombo';
import Slider from '../../elements/Slider';
import { POLYGON_EDITOR_TOOLS, POLYGON_EDITOR_TOOL_MODES, useUIContext } from '../../logic/useUIContext';
import { HELP_MESSAGE_TOOL_DRAW, HELP_MESSAGE_TOOL_DRAW_DRAW_LINE, HELP_MESSAGE_TOOL_DRAW_SNAP, POLYGON_EDITOR_MARKER_SIZE, POLYGON_EDITOR_PENCIL_STEP, POLYGON_EDITOR_SNAP_DISTANCE, POLYGON_EDITOR_SNAP_DISTANCE_MAX, POLYGON_EDITOR_SNAP_DISTANCE_MIN } from '../../global';

function DrawToolOptions (props) {
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

    if (editor.selectedTool !== POLYGON_EDITOR_TOOLS.draw) return <></>;

    return (
        <>
            <h2 className="control-panel-header">Draw tool</h2>
            <div className="help">
                <p><i>{HELP_MESSAGE_TOOL_DRAW}</i></p>
            </div>
            <div className="tool-options">
                <div className="horizontal-control-group">
                    <span className="horizontal-control-group-name">Draw mode</span>
                    <div className="horizontal-control-group-controls">
                        <Button
                            icon="fa-map-pin" iconStyle="fad" title="Place corners"
                            onClick={() => setEditorSelectedToolMode(POLYGON_EDITOR_TOOL_MODES.place)}
                            selected={editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.place}
                        />
                        <Button
                            icon="fa-scribble" iconStyle="fa" title="Draw line"
                            onClick={() => setEditorSelectedToolMode(POLYGON_EDITOR_TOOL_MODES.draw)}
                            selected={editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.draw}
                        />
                        <Button
                            icon="fa-magnet" iconStyle="fad" title="Snap to foreign vertices"
                            onClick={() => setEditorSelectedToolMode(POLYGON_EDITOR_TOOL_MODES.snap)}
                            selected={editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.snap}
                        />
                    </div>
                </div>
                {
                    editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.draw &&
                    <div className="help">
                        <p><b>Draw line</b> — <i>{HELP_MESSAGE_TOOL_DRAW_DRAW_LINE}</i></p>
                    </div>
                }
                {
                    editor.selectedToolMode === POLYGON_EDITOR_TOOL_MODES.snap &&
                    <div className="help">
                        <p><b>Snap to foreign vertices</b> — <i>{HELP_MESSAGE_TOOL_DRAW_SNAP}</i></p>
                    </div>
                }
                <div>
                    <Checkbox
                        id="snap-borders"
                        label="Snap to nearby polygons."
                        checked={editor.snap}
                        onChange={evt_snap}
                        highlight
                    />
                    <Checkbox
                        id="show-others"
                        label="Show other polygons."
                        checked={editor.showForeignFeatures}
                        onChange={evt_foreignFeatures}
                        highlight
                    />
                </div>
                <div className="control-table">
                    <InputCombo className="option-slider pair">
                        <label htmlFor="snap-distance">Snap distance</label>
                        <Slider
                            id="snap-distance"
                            {...POLYGON_EDITOR_SNAP_DISTANCE}
                            value={editor.snapDistance}
                            onChange={evt_snapDistance}
                        />
                    </InputCombo>
                    <InputCombo className="option-slider pair">
                        <label htmlFor="marker-size">Marker size</label>
                        <Slider
                            id="marker-size"
                            {...POLYGON_EDITOR_MARKER_SIZE}
                            value={editor.markerSize}
                            onChange={evt_markerSize}
                        />
                    </InputCombo>
                    <InputCombo className="option-slider pair">
                        <label htmlFor="pencil-step">Pencil step</label>
                        <Slider
                            id="pencil-step"
                            {...POLYGON_EDITOR_PENCIL_STEP}
                            value={editor.pencilStep}
                            onChange={evt_pencilStep}
                        />
                    </InputCombo>
                </div>
                <div className="options-control-bar">
                    <Button baseStyle="danger" label="Reset options" />
                </div>
            </div>
        </>
    );
}

export default DrawToolOptions;