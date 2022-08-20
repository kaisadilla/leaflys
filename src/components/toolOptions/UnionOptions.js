import React from 'react';
import Button from '../../elements/Button';
import InputCombo from '../../elements/InputCombo';
import { useUIContext } from '../../logic/useUIContext';
import { HELP_MESSAGE_TOOL_UNION, HELP_WARNING_INACCURATE } from '../../global';
import { useDocumentContext } from '../../logic/useDocumentContext';
import { getSortedActivePolygons, polygonUnion } from '../../util/Util';
import { useStateCallback } from '../../ext/useStateCallback';
import { ToGeoJSON } from '../../util/TurfLeafletConversion';

function UnionOptions (props) {
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

    const evt_join = (evt) => {
        if (selectedPoly !== null) {
            const geojson = ToGeoJSON.polygon(editedFeature.polygons);
            const newGeojson = polygonUnion(geojson, getPolygonById(selectedPoly));
            setEditedFeatureGeometry(newGeojson);
        }
    };

    return (
        <>
            <h2 className="control-panel-header">Polygon union tool</h2>
            <div className="help">
                <p><i>{HELP_MESSAGE_TOOL_UNION}</i></p>
                <p><b>WARNING: </b><i>{HELP_WARNING_INACCURATE}</i></p>
            </div>
            <div className="tool-options">
                <InputCombo>
                    <label htmlFor="delete-overlap-list">Polygon to join: </label>
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
                    <Button baseStyle="success" label="Join" onClick={evt_join} />
                </div>
            </div>
        </>
    );
}

export default UnionOptions;