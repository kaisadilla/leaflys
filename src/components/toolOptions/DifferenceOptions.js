import React from 'react';
import Button from '../../elements/Button';
import InputCombo from '../../elements/InputCombo';
import { useUIContext } from '../../logic/useUIContext';
import { HELP_MESSAGE_TOOL_DIFFERENCE, HELP_WARNING_INACCURATE } from '../../global';
import { useDocumentContext } from '../../logic/useDocumentContext';
import { clipPolygon, getSortedActivePolygons } from '../../util/Util';
import { useStateCallback } from '../../ext/useStateCallback';
import { ToGeoJSON } from '../../util/TurfLeafletConversion';

function SubtractOptions (props) {
    const {
        document,
        getPolygonById,
    } = useDocumentContext();

    const {
        editedFeature,
        setEditedFeatureGeometry
    } = useUIContext();

    const sortedPolygons = getSortedActivePolygons(document.features.polygons, [editedFeature.id]);

    const firstPolyInList = sortedPolygons[0] ? sortedPolygons[0].id : null;
    const [ selectedPoly, setSelectedPoly ] = useStateCallback(firstPolyInList);

    const evt_carve = (evt) => {
        if (selectedPoly !== null) {
            const geojson = ToGeoJSON.polygon(editedFeature.polygons);
            const newGeojson = clipPolygon(geojson, getPolygonById(selectedPoly));
            setEditedFeatureGeometry(newGeojson);
        }
    };

    return (
        <>
            <h2 className="control-panel-header">Polygon difference tool</h2>
            <div className="help">
                <p><i>{HELP_MESSAGE_TOOL_DIFFERENCE}</i></p>
                <p><b>WARNING: </b><i>{HELP_WARNING_INACCURATE}</i></p>
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

export default SubtractOptions;