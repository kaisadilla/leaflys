import React, { useEffect, useLayoutEffect, useState } from 'react';
import { toHaveFormValues } from '@testing-library/jest-dom/dist/matchers';
import SpanButton from '../elements/SpanButton';
import Switch from '../elements/Switch';
import DormantTextbox from '../elements/DormantTextbox';
import Button from '../elements/Button';
import DocumentUtil from '../util/DocumentUtil';
import { useUIContext } from '../logic/useUIContext';
import { useDocumentContext } from '../logic/useDocumentContext';
import ConfirmDialog from '../elements/ConfirmDialog';

function FeatureCollection_Feature (props) {
    const { updatePolygon, deletePolygon } = useDocumentContext();
    const { setEditedFeatureIndex } = useUIContext();

    const [dialogDelete, setDialogDelete] = useState(false);

    const feature = props.feature;
    const index = props.index;

    const name = feature.properties.name;
    const id = feature.id;

    const empty = feature.geometry.coordinates.length === 0 || feature.geometry.coordinates[0].length === 0;
    const [enabled, setEnabled] = useState(true);

    const editButton = () => setEditedFeatureIndex(index, feature);
    const deleteButton = () => setDialogDelete(true);
    const copyButton = () => copyFeature(feature);
    const exportButton = () => exportFeature(name, feature);

    const evt_toggleFeature = (e) => {
        const newFeature = structuredClone(feature);
        newFeature.properties.leaflys.enabled = e.target.checked;
        updatePolygon(id, newFeature);
    };

    useLayoutEffect(() => {
        setEnabled(feature.properties.leaflys ? feature.properties.leaflys.enabled : true);
    }, [feature]);
    
    return (
        <>
        <div className={`feature ${enabled ? "" : "disabled-feature"}`}>
            <div className="feature-row name-row">
                <Switch className="toggle-feature"
                    checked={enabled}
                    onChange={evt_toggleFeature}
                />
                <div className="feature-name">
                    <DormantTextbox
                        className="feature-name-textbox"
                        value={name}
                        onChange={e => feature.properties.name = e.target.value}
                    />
                </div>
                {
                    enabled ?
                    <div className="feature-buttons">
                        <Button baseStyle="clear" icon="edit" iconStyle="g-outline" onClick={editButton} />
                        <Button baseStyle="danger" icon="delete" iconStyle="g-outline" onClick={deleteButton} />
                    </div> :
                    <div className="feature-buttons-placeholder"></div>
                }
            </div>
            {
                enabled &&
                <div className="feature-row id-row">
                    <div className="feature-id">{id}</div>
                    <div className="feature-quick-actions">
                        <SpanButton label="copy" onClick={copyButton} />
                        <span> | </span>
                        <SpanButton label="export" onClick={exportButton} />
                        <span> | </span>
                        <SpanButton label="raw" />
                    </div>
                </div>
            }
        </div>
        <ConfirmDialog
            isOpen={dialogDelete}
            title="Delete feature"
            messageHTML={<span>Do you want to delete <b>{name}</b>?</span>}
            confirm={() => deletePolygon(feature.id)}
            confirmLabel="Delete"
            confirmStyle="danger"
            close={() => setDialogDelete(false)}
        />
        </>
    );
}

function copyFeature (geojson) {
    DocumentUtil.copyToClipboard(encodedGeojson(geojson));
}

function exportFeature (fileName, geojson) {
    DocumentUtil.saveAsFile(`${fileName}.geojson`, encodedGeojson(geojson));
}

function encodedGeojson (geojson) {
    const rawJson = JSON.stringify(geojson, null, 4);
    return DocumentUtil.formatGeojsonCoords(rawJson);
}

export default FeatureCollection_Feature;